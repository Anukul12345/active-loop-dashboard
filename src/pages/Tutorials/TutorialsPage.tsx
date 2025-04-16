
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tutorial } from '@/lib/types';

const mockTutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Beginner Full Body Workout',
    description: 'Perfect for those just starting their fitness journey.',
    videoUrl: 'https://www.youtube.com/embed/UBMk30rjy0o',
    category: 'strength',
    difficulty: 'beginner',
    isBookmarked: false,
  },
  {
    id: '2',
    title: 'HIIT Cardio Workout',
    description: '20-minute high-intensity interval training.',
    videoUrl: 'https://www.youtube.com/embed/ml6cT4AZdqI',
    category: 'cardio',
    difficulty: 'intermediate',
    isBookmarked: false,
  },
];

const TutorialsPage = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>(mockTutorials);

  const toggleBookmark = (tutorialId: string) => {
    setTutorials(prevTutorials =>
      prevTutorials.map(tutorial =>
        tutorial.id === tutorialId
          ? { ...tutorial, isBookmarked: !tutorial.isBookmarked }
          : tutorial
      )
    );
    toast("Tutorial bookmarked!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Workout Tutorials</h1>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="cardio">Cardio</TabsTrigger>
          <TabsTrigger value="flexibility">Flexibility</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tutorials.map((tutorial) => (
              <Card key={tutorial.id}>
                <CardHeader className="relative">
                  <CardTitle className="pr-8">{tutorial.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4"
                    onClick={() => toggleBookmark(tutorial.id)}
                  >
                    <Bookmark 
                      className={tutorial.isBookmarked ? "fill-current" : ""}
                    />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video mb-4">
                    <iframe
                      src={tutorial.videoUrl}
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {tutorial.description}
                  </p>
                  <div className="flex gap-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {tutorial.difficulty}
                    </span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {tutorial.category}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TutorialsPage;
