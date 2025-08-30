import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogCard, Blog } from './BlogCard';
import { TrendingUp, Flame } from 'lucide-react';

interface TrendingSectionProps {
  blogs: Blog[];
  title?: string;
  showIcon?: boolean;
}

export const TrendingSection = ({ 
  blogs, 
  title = "Trending This Week", 
  showIcon = true 
}: TrendingSectionProps) => {
  if (blogs.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            {showIcon && <TrendingUp className="h-5 w-5 text-primary" />}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Flame className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No trending articles yet.</p>
            <p className="text-sm">Be the first to write something amazing!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {showIcon && <TrendingUp className="h-5 w-5 text-primary" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {blogs.map((blog, index) => (
          <div key={blog.id} className="relative">
            {index < 3 && (
              <div className="absolute -left-2 -top-2 z-10">
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white
                  ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'}
                `}>
                  {index + 1}
                </div>
              </div>
            )}
            <BlogCard blog={blog} variant="compact" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};