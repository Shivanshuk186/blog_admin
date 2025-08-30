import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Calendar,
  User,
  Tag
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content_markdown: string;
  tags: string[];
  author_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  cover_image_url?: string | null;
  published_at?: string | null;
  profiles?: {
    name: string;
    email: string;
  } | null;
}

const Admin = () => {
  const [submittedPosts, setSubmittedPosts] = useState<BlogPost[]>([]);
  const [publishedPosts, setPublishedPosts] = useState<BlogPost[]>([]);
  const [rejectedPosts, setRejectedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('submitted');
  
  const { user, profile, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || profile?.role !== 'admin') {
      toast({
        title: "Access denied",
        description: "You need admin privileges to access this page",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    fetchPosts();
  }, [isAuthenticated, profile, navigate, toast]);

  const fetchPosts = async () => {
    try {
      const { data: submitted, error: submittedError } = await supabase
        .from('blogs')
        .select(`
          *,
          profiles (
            name,
            email
          )
        `)
        .eq('status', 'submitted')
        .order('created_at', { ascending: false });

      const { data: published, error: publishedError } = await supabase
        .from('blogs')
        .select(`
          *,
          profiles (
            name,
            email
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      const { data: rejected, error: rejectedError } = await supabase
        .from('blogs')
        .select(`
          *,
          profiles (
            name,
            email
          )
        `)
        .eq('status', 'rejected')
        .order('updated_at', { ascending: false });

      if (submittedError) throw submittedError;
      if (publishedError) throw publishedError;
      if (rejectedError) throw rejectedError;

      setSubmittedPosts((submitted || []) as unknown as BlogPost[]);
      setPublishedPosts((published || []) as unknown as BlogPost[]);
      setRejectedPosts((rejected || []) as unknown as BlogPost[]);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Post approved",
        description: "The blog post has been published successfully",
      });
      
      fetchPosts(); // Refresh the data
    } catch (error) {
      console.error('Error approving post:', error);
      toast({
        title: "Error",
        description: "Failed to approve the post",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (postId: string, reason?: string) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ 
          status: 'rejected',
          rejection_reason: reason || 'No reason provided'
        })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Post rejected",
        description: "The blog post has been rejected",
      });
      
      fetchPosts(); // Refresh the data
    } catch (error) {
      console.error('Error rejecting post:', error);
      toast({
        title: "Error",
        description: "Failed to reject the post",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const PostCard = ({ post }: { post: BlogPost }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.profiles?.name} ({post.profiles?.email})
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(post.created_at)}
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {post.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-muted-foreground line-clamp-3">
            {post.content_markdown.substring(0, 200)}...
          </p>
        </div>
        
        {post.status === 'submitted' && (
          <div className="flex gap-2">
            <Button
              onClick={() => handleApprove(post.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              onClick={() => handleReject(post.id)}
              variant="destructive"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        )}
        
        {post.status === 'published' && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            Published on {post.created_at ? formatDate(post.created_at) : 'Unknown'}
          </div>
        )}
        
        {post.status === 'rejected' && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <XCircle className="h-4 w-4" />
            Rejected
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (!isAuthenticated || profile?.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage blog posts and content moderation
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="submitted" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Review ({submittedPosts.length})
            </TabsTrigger>
            <TabsTrigger value="published" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Published ({publishedPosts.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Rejected ({rejectedPosts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submitted" className="space-y-4">
            {submittedPosts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No posts pending review</h3>
                  <p>All submitted posts have been reviewed.</p>
                </CardContent>
              </Card>
            ) : (
              submittedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </TabsContent>

          <TabsContent value="published" className="space-y-4">
            {publishedPosts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No published posts</h3>
                  <p>No posts have been published yet.</p>
                </CardContent>
              </Card>
            ) : (
              publishedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejectedPosts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <XCircle className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No rejected posts</h3>
                  <p>No posts have been rejected.</p>
                </CardContent>
              </Card>
            ) : (
              rejectedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;