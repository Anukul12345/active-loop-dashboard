
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getWorkouts } from "@/lib/api";
import { Workout, WorkoutStats } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Flame, Activity, TrendingUp } from "lucide-react";
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import WorkoutCaloriesChart from "@/components/Charts/WorkoutCaloriesChart";
import WorkoutTypeChart from "@/components/Charts/WorkoutTypeChart";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWorkout, setNewWorkout] = useState("");
  const [stats, setStats] = useState<WorkoutStats>({
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    workoutsByType: {},
  });

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await getWorkouts();
        setWorkouts(data);
        calculateStats(data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkouts();
  }, []);

  const calculateStats = (workouts: Workout[]) => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    
    const todayWorkouts = workouts.filter(workout => 
      format(parseISO(workout.date), 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')
    );
    
    const todayCalories = todayWorkouts.reduce((sum, workout) => sum + workout.calories, 0);
    const averageCalories = todayWorkouts.length > 0 
      ? Math.round(todayCalories / todayWorkouts.length)
      : 0;
    
    const workoutsByType: Record<string, number> = {};
    workouts.forEach(workout => {
      workoutsByType[workout.type] = (workoutsByType[workout.type] || 0) + 1;
    });
    
    setStats({
      totalWorkouts: todayWorkouts.length,
      totalDuration: todayWorkouts.reduce((sum, w) => sum + w.duration, 0),
      totalCalories: todayCalories,
      workoutsByType,
      averageCalories,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-fitness-primary rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-fitness-primary/60 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in p-6">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-500 font-medium mb-2">Calories Burned</p>
                <h3 className="text-3xl font-bold flex items-baseline">
                  {stats.totalCalories.toLocaleString()}
                  <span className="text-sm font-normal text-gray-500 ml-1">kcal</span>
                </h3>
                <p className="text-green-500 text-sm mt-1">(+10%)</p>
                <p className="text-gray-500 text-sm mt-2">Total calories burned today</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-500 font-medium mb-2">Workouts</p>
                <h3 className="text-3xl font-bold flex items-baseline">
                  {stats.totalWorkouts.toLocaleString()}
                  <span className="text-sm font-normal text-gray-500 ml-1"></span>
                </h3>
                <p className="text-green-500 text-sm mt-1">(+10%)</p>
                <p className="text-gray-500 text-sm mt-2">Total no. of workouts for today</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Activity className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-500 font-medium mb-2">Average Calories Burned</p>
                <h3 className="text-3xl font-bold flex items-baseline">
                  {stats.averageCalories?.toLocaleString() || "0"}
                  <span className="text-sm font-normal text-gray-500 ml-1">kcal</span>
                </h3>
                <p className="text-green-500 text-sm mt-1">(+10%)</p>
                <p className="text-gray-500 text-sm mt-2">Average Calories Burned on each workout</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Add Workout Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Weekly Calories Burned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <WorkoutCaloriesChart data={workouts.map(w => ({
                name: format(parseISO(w.date), 'dd'),
                value: w.calories
              }))} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Workout Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <WorkoutTypeChart data={Object.entries(stats.workoutsByType).map(([name, value]) => ({
                name,
                value
              }))} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Add New Workout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter workout details..."
                value={newWorkout}
                onChange={(e) => setNewWorkout(e.target.value)}
                className="min-h-[150px]"
              />
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Workout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Workouts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Today's Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          {workouts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No workouts recorded today</p>
          ) : (
            <div className="space-y-4">
              {workouts.map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{workout.type}</p>
                      <p className="text-sm text-gray-500">{workout.duration} minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <span>{workout.calories} kcal</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
