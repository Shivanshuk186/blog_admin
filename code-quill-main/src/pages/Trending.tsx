import { useState, useEffect } from 'react';
import { BlogCard, Blog } from '@/components/BlogCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Flame, Clock, Star, Eye } from 'lucide-react';

// Mock trending data
const mockTrendingBlogs: Blog[] = [
  {
    id: '1',
    title: 'The Future of Web Development: What to Expect in 2024',
    slug: 'future-web-development-2024',
    excerpt: 'Explore the emerging trends and technologies that will shape web development in 2024 and beyond.',
    content: 'Web development continues to evolve rapidly...',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
    tags: ['Web Development', 'Trends', 'Technology', 'Future'],
    author: {
      id: '3',
      name: 'Emily Rodriguez',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face'
    },
    status: 'published',
    publishedAt: '2024-01-13T09:15:00Z',
    likesCount: 124,
    commentsCount: 45,
    viewsCount: 2890,
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '2',
    title: 'Building Scalable APIs with Node.js and TypeScript',
    slug: 'building-scalable-apis-nodejs-typescript',
    excerpt: 'Discover best practices for creating maintainable and scalable REST APIs using Node.js, Express, and TypeScript.',
    content: 'When building APIs, scalability is crucial...',
    coverImage: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=400&fit=crop',
    tags: ['Node.js', 'TypeScript', 'API', 'Backend'],
    author: {
      id: '2',
      name: 'Mike Chen',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face'
    },
    status: 'published',
    publishedAt: '2024-01-14T14:30:00Z',
    likesCount: 89,
    commentsCount: 32,
    viewsCount: 1756,
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z'
  },
  {
    id: '3',
    title: 'Getting Started with React 18 and Next.js 13',
    slug: 'getting-started-react-18-nextjs-13',
    excerpt: 'Learn the latest features of React 18 and how to integrate them with Next.js 13 for building modern web applications.',
    content: 'React 18 brings several exciting features...',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    tags: ['React', 'Next.js', 'JavaScript', 'Web Development'],
    author: {
      id: '1',
      name: 'Sarah Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face'
    },
    status: 'published',
    publishedAt: '2024-01-15T10:00:00Z',
    likesCount: 67,
    commentsCount: 28,
    viewsCount: 1234,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

const timeRanges = [
  { key: 'week', label: 'This Week', icon: Clock },
  { key: 'month', label: 'This Month', icon: Star },
  { key: 'year', label: 'This Year', icon: TrendingUp },
  { key: 'all', label: 'All Time', icon: Flame }
];

const Trending = () => {
  const [selectedRange, setSelectedRange] = useState('week');
  const [trendingBlogs, setTrendingBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTrendingBlogs = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sort blogs by a composite trending score
      const sortedBlogs = [...mockTrendingBlogs].sort((a, b) => {
        const scoreA = (a.likesCount * 3) + (a.commentsCount * 2) + (a.viewsCount * 0.1);
        const scoreB = (b.likesCount * 3) + (b.commentsCount * 2) + (b.viewsCount * 0.1);
        return scoreB - scoreA;
      });
      
      setTrendingBlogs(sortedBlogs);
      setIsLoading(false);
    };

    loadTrendingBlogs();
  }, [selectedRange]);

  const getTrendingScore = (blog: Blog) => {
    return (blog.likesCount * 3) + (blog.commentsCount * 2) + Math.floor(blog.viewsCount * 0.1);
  };

  const handleLike = (blogId: string) => {
    setTrendingBlogs(prevBlogs => 
      prevBlogs.map(blog => 
        blog.id === blogId 
          ? { 
              ...blog, 
              isLiked: !blog.isLiked, 
              likesCount: blog.isLiked ? blog.likesCount - 1 : blog.likesCount + 1 
            }
          : blog
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-full">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">Trending Articles</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the most popular and engaging content from our community of developers
          </p>
        </div>

        {/* Time Range Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-primary" />
              Time Range
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {timeRanges.map((range) => {
                const IconComponent = range.icon;
                return (
                  <Button
                    key={range.key}
                    variant={selectedRange === range.key ? "default" : "outline"}
                    onClick={() => setSelectedRange(range.key)}
                    className={`flex items-center gap-2 ${
                      selectedRange === range.key 
                        ? 'bg-gradient-primary text-white' 
                        : ''
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    {range.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Trending Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                </div>
              </div>
              <div className="text-2xl font-bold text-primary">
                {trendingBlogs.reduce((sum, blog) => sum + blog.likesCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Eye className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
              <div className="text-2xl font-bold text-primary">
                {trendingBlogs.reduce((sum, blog) => sum + blog.viewsCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
              </div>
              <div className="text-2xl font-bold text-primary">
                {trendingBlogs.length > 0 ? Math.round(trendingBlogs.reduce((sum, blog) => sum + getTrendingScore(blog), 0) / trendingBlogs.length) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Avg. Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Trending Articles */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted" />
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded w-16" />
                    <div className="h-6 bg-muted rounded w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top 3 Featured */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Flame className="h-6 w-6 text-orange-500" />
                Top Trending
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {trendingBlogs.slice(0, 3).map((blog, index) => (
                  <div key={blog.id} className="relative">
                    {/* Ranking Badge */}
                    <div className="absolute -top-2 -left-2 z-10">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white
                        ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'}
                      `}>
                        {index + 1}
                      </div>
                    </div>
                    {/* Trending Score */}
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="bg-black/50 text-white">
                        {getTrendingScore(blog)} pts
                      </Badge>
                    </div>
                    <BlogCard 
                      blog={blog} 
                      onLike={handleLike}
                      variant="featured"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Rest of Articles */}
            {trendingBlogs.length > 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  More Trending Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {trendingBlogs.slice(3).map((blog, index) => (
                    <div key={blog.id} className="relative">
                      <div className="absolute top-3 right-3 z-10">
                        <Badge variant="secondary">
                          #{index + 4} • {getTrendingScore(blog)} pts
                        </Badge>
                      </div>
                      <BlogCard 
                        blog={blog} 
                        onLike={handleLike}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {trendingBlogs.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Flame className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No trending articles yet</h3>
                  <p>Be the first to create viral content!</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;