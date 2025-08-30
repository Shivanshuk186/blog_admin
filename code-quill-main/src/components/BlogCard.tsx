import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Eye, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  status: 'draft' | 'submitted' | 'published' | 'rejected' | 'hidden';
  publishedAt?: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BlogCardProps {
  blog: Blog;
  onLike?: (blogId: string) => void;
  variant?: 'default' | 'compact' | 'featured';
}

export const BlogCard = ({ blog, onLike, variant = 'default' }: BlogCardProps) => {
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLike?.(blog.id);
  };

  const publishDate = blog.publishedAt || blog.createdAt;

  if (variant === 'compact') {
    return (
      <Link to={`/blog/${blog.slug}`}>
        <Card className="group hover:shadow-md transition-all duration-200 border-border/50 hover:border-border">
          <CardContent className="p-4">
            <div className="flex gap-3">
              {blog.coverImage && (
                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {blog.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>{blog.author.name}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(publishDate), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {blog.likesCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {blog.commentsCount}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link to={`/blog/${blog.slug}`}>
        <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-border overflow-hidden">
          {blog.coverImage && (
            <div className="relative h-48 bg-muted">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={blog.author.avatarUrl} />
                <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{blog.author.name}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(publishDate), { addSuffix: true })}
              </span>
            </div>
            <h2 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
              {blog.title}
            </h2>
            <p className="text-muted-foreground line-clamp-2">{blog.excerpt}</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1 mb-4">
              {blog.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between pt-0">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {blog.viewsCount}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {blog.commentsCount}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center gap-1 ${blog.isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
            >
              <Heart className={`h-4 w-4 ${blog.isLiked ? 'fill-current' : ''}`} />
              {blog.likesCount}
            </Button>
          </CardFooter>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/blog/${blog.slug}`}>
      <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-border h-full">
        {blog.coverImage && (
          <div className="relative h-48 bg-muted overflow-hidden">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={blog.author.avatarUrl} />
              <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{blog.author.name}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(publishDate), { addSuffix: true })}
            </span>
          </div>
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-muted-foreground line-clamp-3">{blog.excerpt}</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {blog.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {blog.viewsCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {blog.commentsCount}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-1 ${blog.isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
          >
            <Heart className={`h-4 w-4 ${blog.isLiked ? 'fill-current' : ''}`} />
            {blog.likesCount}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};