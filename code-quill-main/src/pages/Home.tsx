import { useState, useEffect } from 'react';
import { BlogCard, Blog } from '@/components/BlogCard';
import { TrendingSection } from '@/components/TrendingSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, BookOpen, Users, TrendingUp, Star } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

// Mock data for demonstration
const mockBlogs: Blog[] = [
  {
    id: '1',
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
    likesCount: 42,
    commentsCount: 8,
    viewsCount: 256,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
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
    likesCount: 38,
    commentsCount: 12,
    viewsCount: 189,
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z'
  },
  {
    id: '3',
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
    likesCount: 67,
    commentsCount: 23,
    viewsCount: 342,
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    title: 'Understanding Database Design Patterns',
    slug: 'understanding-database-design-patterns',
    excerpt: 'Master the essential database design patterns that every developer should know for efficient data management.',
    content: 'Database design is a critical skill...',
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop',
    tags: ['Database', 'Design Patterns', 'SQL', 'Backend'],
    author: {
      id: '4',
      name: 'David Wilson',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'
    },
    status: 'published',
    publishedAt: '2024-01-12T16:45:00Z',
    likesCount: 29,
    commentsCount: 7,
    viewsCount: 123,
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z'
  }
];

const popularTags = [
  'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Web Development',
  'API', 'Database', 'DevOps', 'Machine Learning', 'Mobile', 'Security'
];

const Home = () => {
  const [blogs, setBlogs] = useState<Blog[]>(mockBlogs);
  const [trendingBlogs, setTrendingBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading trending blogs
    setTrendingBlogs(mockBlogs.slice(0, 3));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
      // In a real app, this would filter the blogs
      console.log(`Filtering by tag: ${tag}`);
    }
  };

  const filteredBlogs = selectedTag 
    ? blogs.filter(blog => blog.tags.includes(selectedTag))
    : blogs;

  const handleLike = (blogId: string) => {
    setBlogs(prevBlogs => 
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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container relative max-w-7xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-yellow-300">Devnovate</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Discover cutting-edge articles, tutorials, and insights from the developer community.
            Share your knowledge and learn from the best.
          </p>
          
          {/* Hero Search */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
              />
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <div>
                  <div className="font-semibold">500+</div>
                  <div className="text-sm text-white/80">Articles</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                <div>
                  <div className="font-semibold">1.2K+</div>
                  <div className="text-sm text-white/80">Authors</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-4 flex items-center gap-2">
                <Star className="h-5 w-5" />
                <div>
                  <div className="font-semibold">10K+</div>
                  <div className="text-sm text-white/80">Readers</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Start Writing CTA */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-3 text-center">Ready to Share Your Knowledge?</h2>
            <p className="text-white/90 text-center mb-6">
              Join our community of developers and start writing with AI assistance
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/editor">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-white/90 font-semibold px-8">
                  Start Writing Now
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
                  Join Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Writing Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Write with AI Assistance</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leverage the power of AI to enhance your writing process and create better content
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Content Generation</h3>
                <p className="text-muted-foreground mb-4">
                  Generate blog introductions, technical explanations, and complete articles with AI assistance
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  <Badge variant="secondary" className="text-xs">Blog Intros</Badge>
                  <Badge variant="secondary" className="text-xs">Tutorials</Badge>
                  <Badge variant="secondary" className="text-xs">Explanations</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Templates</h3>
                <p className="text-muted-foreground mb-4">
                  Choose from pre-built templates for different types of technical content
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  <Badge variant="secondary" className="text-xs">Code Tutorials</Badge>
                  <Badge variant="secondary" className="text-xs">Tech Reviews</Badge>
                  <Badge variant="secondary" className="text-xs">How-to Guides</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Writing Enhancement</h3>
                <p className="text-muted-foreground mb-4">
                  Improve your existing content with AI suggestions and optimizations
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  <Badge variant="secondary" className="text-xs">Grammar Check</Badge>
                  <Badge variant="secondary" className="text-xs">Style Tips</Badge>
                  <Badge variant="secondary" className="text-xs">SEO Boost</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link to="/editor">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 px-8 py-3">
                Try AI Writing Assistant
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tags Filter */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Popular Topics
              </h2>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "secondary"}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedTag === tag 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-primary/10'
                    }`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Latest Articles */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedTag ? `Articles tagged "${selectedTag}"` : 'Latest Articles'}
                </h2>
                {selectedTag && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedTag(null)}
                    className="text-sm"
                  >
                    Clear Filter
                  </Button>
                )}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-48 bg-muted" />
                      <CardContent className="p-6">
                        <div className="h-4 bg-muted rounded mb-2" />
                        <div className="h-4 bg-muted rounded w-3/4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredBlogs.map((blog) => (
                    <BlogCard 
                      key={blog.id} 
                      blog={blog} 
                      onLike={handleLike}
                    />
                  ))}
                </div>
              )}

              {filteredBlogs.length === 0 && selectedTag && (
                <Card>
                  <CardContent className="p-12 text-center text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No articles found for "{selectedTag}"</p>
                    <p className="text-sm">Try selecting a different tag or clear the filter</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Load More */}
            {filteredBlogs.length > 0 && (
              <div className="text-center">
                <Button variant="outline" className="px-8">
                  Load More Articles
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Section */}
            <TrendingSection blogs={trendingBlogs} />

            {/* Quick Stats */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Articles</span>
                  <span className="font-semibold">524</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Active Authors</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-semibold text-primary">+89 articles</span>
                </div>
              </CardContent>
            </Card>

            {/* Featured Author */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Featured Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
                    alt="Sarah Johnson"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">Sarah Johnson</h3>
                    <p className="text-sm text-muted-foreground">Full Stack Developer</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Passionate about React, Node.js, and building scalable web applications.
                </p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>12 articles</span>
                  <span>2.3K followers</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;