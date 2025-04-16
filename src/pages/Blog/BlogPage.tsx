
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { BlogPost } from '@/lib/types';

const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Strength Training',
    content: 'Learn the fundamentals of strength training and how to begin your journey...',
    category: 'training',
    author: 'John Doe',
    date: '2025-04-16',
    readTime: 5,
  },
  {
    id: '2',
    title: 'Nutrition Tips for Muscle Growth',
    content: 'Discover the essential nutrients needed for optimal muscle growth...',
    category: 'diet',
    author: 'Jane Smith',
    date: '2025-04-15',
    readTime: 7,
  },
];

const BlogPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Fitness Blog</h1>
      
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {mockPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{post.author}</span>
                <span>•</span>
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{post.readTime} min read</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {post.content}
              </p>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {post.category}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default BlogPage;
