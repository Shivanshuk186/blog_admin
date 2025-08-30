import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Heart, 
  MessageCircle, 
  Eye, 
  Calendar, 
  User, 
  ArrowLeft,
  Share2,
  Bookmark,
  Flag
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Blog } from '@/components/BlogCard';

// Mock blog data
const mockBlogDetail: Blog = {
  id: '1',
  title: 'Getting Started with React 18 and Next.js 13',
  slug: 'getting-started-react-18-nextjs-13',
  excerpt: 'Learn the latest features of React 18 and how to integrate them with Next.js 13 for building modern web applications.',
  content: `# Getting Started with React 18 and Next.js 13

React 18 and Next.js 13 bring revolutionary changes to how we build modern web applications. In this comprehensive guide, we'll explore the latest features and learn how to leverage them effectively.

## What's New in React 18?

React 18 introduces several groundbreaking features:

### 1. Concurrent Features
React 18's concurrent features allow your app to stay responsive by breaking up heavy rendering work into smaller chunks.

\`\`\`jsx
import { startTransition } from 'react';

function handleClick() {
  startTransition(() => {
    setTab('posts');
  });
}
\`\`\`

### 2. Automatic Batching
React 18 automatically batches multiple state updates for better performance:

\`\`\`jsx
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}
\`\`\`

## Next.js 13 App Directory

The new App Router in Next.js 13 introduces:

- **Layouts**: Shared UI between routes
- **Server Components**: Components that render on the server
- **Streaming**: Progressive rendering for better user experience

### Creating a Layout

\`\`\`tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
\`\`\`

### Server Components by Default

In the app directory, components are Server Components by default:

\`\`\`tsx
// app/page.tsx
async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <main>{/* Your UI */}</main>;
}
\`\`\`

## Best Practices

1. **Use Suspense for Data Fetching**: Wrap components in Suspense boundaries for better loading states
2. **Leverage Server Components**: Use them for static content and data fetching
3. **Client Components for Interactivity**: Use "use client" directive for interactive components

## Conclusion

React 18 and Next.js 13 provide powerful tools for building fast, interactive web applications. The combination of concurrent features, automatic batching, and the new App Router creates an excellent developer experience while delivering superior performance to users.

Start experimenting with these features in your next project and see the difference they can make!`,
  coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop',
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
  isLiked: false,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z'
};

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call
    const loadBlog = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBlog(mockBlogDetail);
      setIsLoading(false);
    };
    
    loadBlog();
    
    // Simulate view count increment
    if (slug) {
      console.log(`Incrementing view count for blog: ${slug}`);
    }
  }, [slug]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to like articles",
        variant: "destructive"
      });
      return;
    }

    if (blog) {
      setBlog(prev => prev ? {
        ...prev,
        isLiked: !prev.isLiked,
        likesCount: prev.isLiked ? prev.likesCount - 1 : prev.likesCount + 1
      } : null);

      toast({
        title: blog.isLiked ? "Removed from likes" : "Added to likes",
        description: blog.isLiked ? "Article removed from your likes" : "Article added to your likes",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Article link copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-64 bg-muted rounded" />
            <div className="h-12 bg-muted rounded w-3/4" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/">
              <Button className="bg-gradient-primary hover:opacity-90">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to articles
        </Link>

        <article className="space-y-8">
          {/* Header */}
          <header className="space-y-6">
            {/* Cover Image */}
            {blog.coverImage && (
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden bg-muted">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title and Meta */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={blog.author.avatarUrl} />
                    <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">{blog.author.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDistanceToNow(new Date(blog.publishedAt!), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{blog.viewsCount} views</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </header>

          {/* Action Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant={blog.isLiked ? "default" : "outline"}
                    onClick={handleLike}
                    className={`flex items-center gap-2 ${blog.isLiked ? 'bg-red-500 hover:bg-red-600' : ''}`}
                  >
                    <Heart className={`h-4 w-4 ${blog.isLiked ? 'fill-current' : ''}`} />
                    {blog.likesCount}
                  </Button>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    {blog.commentsCount} comments
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  {isAuthenticated && (
                    <>
                      <Button variant="outline" size="sm">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardContent className="p-8">
              <div className="blog-content">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return match ? (
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {blog.content}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Author Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={blog.author.avatarUrl} />
                  <AvatarFallback className="text-xl">{blog.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{blog.author.name}</h3>
                  <p className="text-muted-foreground">
                    Passionate developer sharing knowledge about modern web technologies.
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Comments Section Placeholder */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Comments ({blog.commentsCount})</h3>
            </CardHeader>
            <CardContent className="p-8 text-center text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Comments feature coming soon!</p>
              <p className="text-sm">Join the discussion and share your thoughts.</p>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;