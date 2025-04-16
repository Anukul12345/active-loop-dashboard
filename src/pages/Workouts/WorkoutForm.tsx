
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWorkout, createWorkout, updateWorkout } from "@/lib/api";
import { WorkoutFormData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format, parseISO } from "date-fns";

const workoutTypes = [
  "Running",
  "Walking",
  "Cycling",
  "Swimming",
  "Weightlifting",
  "HIIT",
  "Yoga",
  "Pilates",
  "CrossFit",
  "Hiking",
  "Dancing",
  "Other"
];

const WorkoutForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<WorkoutFormData>({
    type: "Running",
    duration: 30,
    calories: 300,
    date: new Date().toISOString(),
    notes: ""
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      if (!isEditMode) return;
      
      try {
        const data = await getWorkout(id);
        setFormData({
          type: data.type,
          duration: data.duration,
          calories: data.calories,
          date: data.date,
          notes: data.notes || ""
        });
      } catch (error) {
        setError("Could not load workout details");
        toast({
          title: "Error",
          description: "Failed to load workout details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkout();
  }, [id, isEditMode, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = parseInt(value, 10);
    
    if (!isNaN(numberValue) && numberValue >= 0) {
      setFormData(prev => ({
        ...prev,
        [name]: numberValue
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateTimeString = e.target.value;
    const dateObj = new Date(dateTimeString);
    setFormData(prev => ({
      ...prev,
      date: dateObj.toISOString()
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      if (isEditMode) {
        await updateWorkout(id, formData);
        toast({
          title: "Success",
          description: "Workout updated successfully",
        });
      } else {
        await createWorkout(formData);
        toast({
          title: "Success",
          description: "Workout added successfully",
        });
      }
      navigate("/workouts");
    } catch (error) {
      setError("Failed to save workout");
      toast({
        title: "Error",
        description: "Failed to save workout",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit Workout" : "Add New Workout"}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type">Workout Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select workout type" />
                </SelectTrigger>
                <SelectContent>
                  {workoutTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="calories">Calories Burned</Label>
                <Input
                  id="calories"
                  name="calories"
                  type="number"
                  min="0"
                  value={formData.calories}
                  onChange={handleNumberChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date and Time</Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                value={format(parseISO(formData.date), "yyyy-MM-dd'T'HH:mm")}
                onChange={handleDateChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Add any notes about your workout..."
                rows={4}
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
            
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-fitness-primary hover:bg-fitness-secondary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Updating..." : "Saving..."}
                </>
              ) : (
                isEditMode ? "Update Workout" : "Add Workout"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default WorkoutForm;
