
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getWorkouts } from "@/lib/api";
import { Workout } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Activity, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  Flame, 
  Filter 
} from "lucide-react";
import { format, parseISO } from "date-fns";

const WorkoutList: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [workoutTypes, setWorkoutTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await getWorkouts();
        setWorkouts(data);
        
        // Extract unique workout types
        const types = Array.from(new Set(data.map(workout => workout.type)));
        setWorkoutTypes(types);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching workouts:", error);
        setLoading(false);
      }
    };
    
    fetchWorkouts();
  }, []);

  useEffect(() => {
    // Apply filtering and searching
    let result = [...workouts];
    
    // Filter by type
    if (filterType !== "all") {
      result = result.filter(workout => workout.type === filterType);
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(workout => 
        workout.type.toLowerCase().includes(term) ||
        (workout.notes && workout.notes.toLowerCase().includes(term))
      );
    }
    
    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredWorkouts(result);
  }, [workouts, filterType, searchTerm]);

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
          <h1 className="text-2xl font-bold">Your Workouts</h1>
          <p className="text-gray-500">View and manage your workout history</p>
        </div>
        <Button asChild className="mt-4 md:mt-0 bg-fitness-primary hover:bg-fitness-secondary">
          <Link to="/workouts/new">
            <Plus className="mr-2 h-4 w-4" />
            Log Workout
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search workouts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {workoutTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workout List */}
      <div className="space-y-4">
        {filteredWorkouts.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-100 p-6 text-center">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No workouts found</h3>
            <p className="text-gray-500 mt-1">
              {workouts.length === 0 
                ? "You haven't recorded any workouts yet." 
                : "Try adjusting your filters or search term."}
            </p>
            {workouts.length === 0 && (
              <Button asChild className="mt-4 bg-fitness-primary hover:bg-fitness-secondary">
                <Link to="/workouts/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Workout
                </Link>
              </Button>
            )}
          </div>
        ) : (
          filteredWorkouts.map((workout) => (
            <Link 
              key={workout.id} 
              to={`/workouts/${workout.id}`}
              className="block"
            >
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-200 hover-scale">
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-full bg-fitness-primary/10">
                        <Activity className="h-5 w-5 text-fitness-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{workout.type}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{format(parseISO(workout.date), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{workout.duration} min</span>
                      </div>
                      <div className="flex items-center">
                        <Flame className="h-4 w-4 mr-1" />
                        <span>{workout.calories} cal</span>
                      </div>
                    </div>
                  </div>
                  {workout.notes && (
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">{workout.notes}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkoutList;
