
import React from "react";
import { Link } from "react-router-dom";
import { Workout } from "@/lib/types";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Activity, Clock, Flame } from "lucide-react";

interface RecentWorkoutsProps {
  workouts: Workout[];
}

const RecentWorkouts: React.FC<RecentWorkoutsProps> = ({ workouts }) => {
  if (workouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Activity className="h-12 w-12 text-gray-300 mb-2" />
        <p className="text-gray-500">No workouts recorded yet</p>
        <Link 
          to="/workouts/new" 
          className="mt-4 text-fitness-primary hover:underline"
        >
          Add your first workout
        </Link>
      </div>
    );
  }

  // Sort workouts by date (newest first)
  const sortedWorkouts = [...workouts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedWorkouts.map((workout) => (
        <Link
          key={workout.id}
          to={`/workouts/${workout.id}`}
          className="block hover-scale"
        >
          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full bg-fitness-primary/10`}>
                  <Activity className="h-5 w-5 text-fitness-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{workout.type}</h4>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(parseISO(workout.date), { addSuffix: true })}
                  </p>
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
              <p className="mt-2 text-sm text-gray-600 line-clamp-1">{workout.notes}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecentWorkouts;
