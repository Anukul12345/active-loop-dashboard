
import React, { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, Loader2, Save, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const UserProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  
  const [profilePicture, setProfilePicture] = useState<string | null>(
    user?.profilePicture || null
  );
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image is too large. Maximum size is 5MB.");
      return;
    }

    // Check file type
    if (!file.type.match("image.*")) {
      setError("Please select an image file.");
      return;
    }

    setError(null);
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);
    
    // In a real app, you would upload this file to your server or cloud storage
    // For now, we'll just use the preview as if it were the uploaded image URL
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Update user data
      await updateProfile({
        name: formData.name,
        // Email update would likely require verification in a real app
        // email: formData.email,
        profilePicture: previewImage || profilePicture,
      });
      
      // Update local state
      setProfilePicture(previewImage || profilePicture);
      setPreviewImage(null);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4">
              <div 
                className="relative cursor-pointer group"
                onClick={handleImageClick}
              >
                <Avatar className="h-24 w-24">
                  <AvatarImage src={previewImage || profilePicture || undefined} />
                  <AvatarFallback className="bg-fitness-primary text-white text-xl">
                    {user?.name?.charAt(0) || <User />}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
                accept="image/*"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleImageClick}
              >
                Change Picture
              </Button>
              
              {previewImage && (
                <p className="text-xs text-green-600">New image selected. Save to apply changes.</p>
              )}
            </div>
            
            <Separator />
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled // Email changes would typically require verification
                  required
                />
                <p className="text-xs text-gray-500">
                  Email address cannot be changed directly. Please contact support.
                </p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end">
            <Button 
              type="submit"
              className="bg-fitness-primary hover:bg-fitness-secondary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UserProfile;
