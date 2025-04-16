
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getWorkout, deleteWorkout } from "@/lib/api";
import { Workout } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Activity, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Edit, 
  Flame, 
  MessageSquare, 
  Trash2 
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const WorkoutDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchWorkout = async () => {
      if (!id) return;
      
      try {
        const data = await getWorkout(id);
        setWorkout(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load workout details",
          variant: "destructive",
        });
        navigate("/workouts");
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkout();
  }, [id, navigate, toast]);

  const handleDelete = async () => {
    if (!id) return;
    
    setDeleting(true);
    try {
      await deleteWorkout(id);
      toast({
        title: "Success",
        description: "Workout deleted successfully",
      });
      navigate("/workouts");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete workout",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
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

  if (!workout) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium">Workout not found</h2>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/workouts">Go Back to Workouts</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <Card className="border-none shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-fitness-primary/10">
                <Activity className="h-6 w-6 text-fitness-primary" />
              </div>
              <CardTitle className="text-2xl">{workout.type}</CardTitle>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                size="icon" 
                variant="ghost" 
                asChild
              >
                <Link to={`/workouts/edit/${workout.id}`}>
                  <Edit className="h-5 w-5" />
                </Link>
              </Button>
              
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Workout</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this workout? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-fitness-primary/10">
                <Calendar className="h-5 w-5 text-fitness-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {format(parseISO(workout.date), "MMMM d, yyyy")}
                </p>
                <p className="text-sm text-gray-500">
                  {format(parseISO(workout.date), "h:mm a")}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-fitness-primary/10">
                <Clock className="h-5 w-5 text-fitness-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{workout.duration} minutes</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-fitness-primary/10">
                <Flame className="h-5 w-5 text-fitness-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Calories</p>
                <p className="font-medium">{workout.calories} cal</p>
              </div>
            </div>
          </div>
          
          {workout.notes && (
            <div className="mt-6">
              <div className="flex items-center space-x-2 mb-2">
                <MessageSquare className="h-4 w-4 text-fitness-primary" />
                <h3 className="font-medium">Notes</h3>
              </div>
              <p className="text-gray-700 whitespace-pre-line">{workout.notes}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-2 border-t flex justify-end">
          <Button 
            asChild
            className="bg-fitness-primary hover:bg-fitness-secondary"
          >
            <Link to={`/workouts/edit/${workout.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Workout
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WorkoutDetail;
