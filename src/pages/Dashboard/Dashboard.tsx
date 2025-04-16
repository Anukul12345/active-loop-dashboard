
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getWorkouts } from "@/lib/api";
import { Workout, WorkoutStats, ChartData } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, Plus, Flame, Clock, TrendingUp } from "lucide-react";
import { format, parseISO, isAfter, startOfWeek, endOfWeek } from "date-fns";
import WorkoutCaloriesChart from "@/components/Charts/WorkoutCaloriesChart";
import WorkoutTypeChart from "@/components/Charts/WorkoutTypeChart";
import RecentWorkouts from "@/components/Workouts/RecentWorkouts";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<WorkoutStats>({
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    workoutsByType: {},
  });
  const [caloriesData, setCaloriesData] = useState<ChartData[]>([]);
  const [typeData, setTypeData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await getWorkouts();
        setWorkouts(data);
        
        // Calculate statistics
        calculateStats(data);
        
        // Prepare chart data
        prepareChartData(data);
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
    
    // Get recent workouts (within the last week)
    const recentWorkouts = workouts.filter(workout => {
      const workoutDate = parseISO(workout.date);
      return isAfter(workoutDate, weekStart) && !isAfter(workoutDate, weekEnd);
    });
    
    // Calculate totals
    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce((total, workout) => total + workout.duration, 0);
    const totalCalories = workouts.reduce((total, workout) => total + workout.calories, 0);
    
    // Count workouts by type
    const workoutsByType: Record<string, number> = {};
    workouts.forEach(workout => {
      if (workoutsByType[workout.type]) {
        workoutsByType[workout.type]++;
      } else {
        workoutsByType[workout.type] = 1;
      }
    });
    
    setStats({
      totalWorkouts,
      totalDuration,
      totalCalories,
      workoutsByType,
    });
  };

  const prepareChartData = (workouts: Workout[]) => {
    // Sort workouts by date (most recent first)
    const sortedWorkouts = [...workouts].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Take only the last 7 workouts for calories chart
    const recentWorkouts = sortedWorkouts.slice(0, 7).reverse();
    
    // Format calories data
    const caloriesChartData = recentWorkouts.map(workout => ({
      name: format(parseISO(workout.date), 'MMM dd'),
      value: workout.calories,
    }));
    
    // Format workout type data
    const typeChartData = Object.entries(stats.workoutsByType).map(([type, count]) => ({
      name: type,
      value: count,
    }));
    
    setCaloriesData(caloriesChartData);
    setTypeData(typeChartData);
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
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(" ")[0]}</h1>
          <p className="text-gray-500">Track your fitness progress</p>
        </div>
        <Button asChild className="mt-4 md:mt-0 bg-fitness-primary hover:bg-fitness-secondary">
          <Link to="/workouts/new">
            <Plus className="mr-2 h-4 w-4" />
            Log Workout
          </Link>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover-glow">
          <CardContent className="p-6 flex items-center">
            <div className="rounded-full bg-fitness-primary/10 p-3 mr-4">
              <Flame className="h-8 w-8 text-fitness-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Calories</p>
              <h3 className="text-2xl font-bold">{stats.totalCalories.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-glow">
          <CardContent className="p-6 flex items-center">
            <div className="rounded-full bg-fitness-primary/10 p-3 mr-4">
              <Clock className="h-8 w-8 text-fitness-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Duration</p>
              <h3 className="text-2xl font-bold">{stats.totalDuration} mins</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-glow">
          <CardContent className="p-6 flex items-center">
            <div className="rounded-full bg-fitness-primary/10 p-3 mr-4">
              <Activity className="h-8 w-8 text-fitness-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Workouts</p>
              <h3 className="text-2xl font-bold">{stats.totalWorkouts}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover-glow">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Calories Burned (Last 7 Workouts)</CardTitle>
            <CardDescription>Track your energy expenditure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <WorkoutCaloriesChart data={caloriesData} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-glow">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Workout Distribution</CardTitle>
            <CardDescription>Breakdown by activity type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <WorkoutTypeChart data={typeData} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Workouts */}
      <Card className="hover-glow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
            <CardDescription>Your latest workout sessions</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link to="/workouts">
              <Calendar className="mr-2 h-4 w-4" />
              View All
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <RecentWorkouts workouts={workouts.slice(0, 5)} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
