import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BlogCard, Blog } from '@/components/BlogCard';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Edit, 
  Save, 
  Camera, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserBlog {
  id: string;
  title: string;
  slug: string;
  content_markdown: string;
  content_html: string;
  cover_image_url?: string;
  tags: string[];
  status: 'draft' | 'submitted' | 'published' | 'rejected';
  published_at?: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
  author_id: string;
  rejection_reason?: string;
}

const Profile = () => {
  const { user, profile, updateUser } = useAuthStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || ''
  });
  const [activeTab, setActiveTab] = useState('published');
  const [userBlogs, setUserBlogs] = useState<Record<string, Blog[]>>({
    drafts: [],
    submitted: [],
    published: [],
    rejected: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchUserBlogs();
    }
  }, [user?.id]);

  const fetchUserBlogs = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      const { data: blogs, error } = await supabase
        .from('blogs')
        .select(`
          id,
          title,
          slug,
          content_markdown,
          content_html,
          cover_image_url,
          tags,
          status,
          published_at,
          likes_count,
          comments_count,
          views_count,
          created_at,
          updated_at,
          author_id,
          rejection_reason
        `)
        .eq('author_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching user blogs:', error);
        toast({
          title: "Error loading blogs",
          description: "Failed to load your blog posts. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Transform the data to match Blog interface
      const transformedBlogs: Blog[] = (blogs || []).map((blog: any) => ({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.content_markdown.substring(0, 200) + '...',
        content: blog.content_markdown,
        coverImage: blog.cover_image_url,
        tags: blog.tags || [],
        author: {
          id: profile?.id || '',
          name: profile?.name || 'User',
          avatarUrl: profile?.avatar_url
        },
        status: blog.status as 'draft' | 'submitted' | 'published' | 'rejected',
        publishedAt: blog.published_at,
        likesCount: blog.likes_count,
        commentsCount: blog.comments_count,
        viewsCount: blog.views_count,
        createdAt: blog.created_at,
        updatedAt: blog.updated_at
      }));

      // Group blogs by status
      const groupedBlogs = {
        drafts: transformedBlogs.filter(blog => blog.status === 'draft'),
        submitted: transformedBlogs.filter(blog => blog.status === 'submitted'),
        published: transformedBlogs.filter(blog => blog.status === 'published'),
        rejected: transformedBlogs.filter(blog => blog.status === 'rejected')
      };

      setUserBlogs(groupedBlogs);
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      toast({
        title: "Error loading blogs",
        description: "Failed to load your blog posts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateUser({
        name: editData.name,
        bio: editData.bio,
        avatar_url: editData.avatar_url
      });
      
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="h-4 w-4" />;
      case 'submitted': return <Clock className="h-4 w-4" />;
      case 'published': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const totalStats = {
    totalPosts: Object.values(userBlogs).flat().length,
    totalViews: Object.values(userBlogs).flat().reduce((sum, blog) => sum + blog.viewsCount, 0),
    totalLikes: Object.values(userBlogs).flat().reduce((sum, blog) => sum + blog.likesCount, 0),
    totalComments: Object.values(userBlogs).flat().reduce((sum, blog) => sum + blog.commentsCount, 0)
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="text-2xl">
                      {profile?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={editData.bio}
                        onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} className="bg-gradient-primary hover:opacity-90">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold">{profile?.name || 'User'}</h1>
                      <Badge variant={profile?.role === 'admin' ? 'default' : 'secondary'}>
                        {profile?.role}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{profile?.email}</p>
                    <p className="text-muted-foreground mb-4">
                      {profile?.bio || 'No bio available. Click edit to add one!'}
                    </p>
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:w-48">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{totalStats.totalPosts}</div>
                  <div className="text-sm text-muted-foreground">Total Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{totalStats.totalViews}</div>
                  <div className="text-sm text-muted-foreground">Total Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{totalStats.totalLikes}</div>
                  <div className="text-sm text-muted-foreground">Total Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{totalStats.totalComments}</div>
                  <div className="text-sm text-muted-foreground">Comments</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your blog posts...</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="published" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Published ({userBlogs.published.length})
              </TabsTrigger>
              <TabsTrigger value="drafts" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Drafts ({userBlogs.drafts.length})
              </TabsTrigger>
              <TabsTrigger value="submitted" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending ({userBlogs.submitted.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Rejected ({userBlogs.rejected.length})
              </TabsTrigger>
            </TabsList>

            {Object.entries(userBlogs).map(([status, blogs]) => (
            <TabsContent key={status} value={status} className="space-y-6">
              {blogs.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center text-muted-foreground">
                    {getStatusIcon(status)}
                    <h3 className="text-lg font-medium mb-2">
                      No {status} articles yet
                    </h3>
                    <p className="mb-4">
                      {status === 'drafts' && "Start writing your first blog post!"}
                      {status === 'submitted' && "No articles are currently pending review."}
                      {status === 'published' && "Write and publish your first article to see it here."}
                      {status === 'rejected' && "No articles have been rejected."}
                    </p>
                    {(status === 'drafts' || status === 'published') && (
                      <Link to="/editor">
                        <Button className="bg-gradient-primary hover:opacity-90">
                          <FileText className="h-4 w-4 mr-2" />
                          Start Writing
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.map((blog) => (
                    <div key={blog.id} className="relative">
                      <BlogCard blog={blog} />
                      {/* Status overlay for non-published posts */}
                      {blog.status !== 'published' && (
                        <div className="absolute top-3 left-3">
                          <Badge className={getStatusColor(blog.status)}>
                            {getStatusIcon(blog.status)}
                            <span className="ml-1 capitalize">{blog.status}</span>
                          </Badge>
                        </div>
                      )}
                      {/* Action buttons for drafts */}
                      {blog.status === 'draft' && (
                        <div className="absolute top-3 right-3 flex gap-1">
                          <Link to={`/editor?id=${blog.id}`}>
                            <Button size="sm" variant="secondary">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Profile;