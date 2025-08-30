import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AIWritingAssistant } from '@/components/AIWritingAssistant';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Save, 
  Send, 
  Eye, 
  Upload, 
  X, 
  ImageIcon,
  FileText,
  Clock,
  User
} from 'lucide-react';

interface BlogDraft {
  title: string;
  content: string;
  tags: string[];
  coverImage?: string;
  status: 'draft' | 'submitted';
}

const Editor = () => {
  const [draft, setDraft] = useState<BlogDraft>({
    title: '',
    content: '',
    tags: [],
    status: 'draft'
  });
  const [tagInput, setTagInput] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  
  const { user, profile, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to write and publish articles",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate, toast]);

  const handleContentChange = useCallback((value?: string) => {
    setDraft(prev => ({ ...prev, content: value || '' }));
  }, []);

  const handleAIContentInsert = useCallback((content: string) => {
    setDraft(prev => ({ 
      ...prev, 
      content: prev.content + '\n\n' + content 
    }));
  }, []);

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !draft.tags.includes(tag) && draft.tags.length < 5) {
        setDraft(prev => ({ ...prev, tags: [...prev.tags, tag] }));
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setDraft(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }));
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      // In a real app, you would upload to a server
      const imageUrl = URL.createObjectURL(file);
      setDraft(prev => ({ ...prev, coverImage: imageUrl }));
      toast({
        title: "Image uploaded",
        description: "Cover image has been added to your post",
      });
    }
  };

  const saveDraft = async () => {
    if (!draft.title.trim()) {
      toast({
        title: "Title required",
        description: "Please add a title to your blog post",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your draft",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const slug = draft.title.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      const { error } = await supabase
        .from('blogs')
        .insert({
          title: draft.title,
          slug: slug,
          content_markdown: draft.content,
          content_html: draft.content, // In real app, convert markdown to HTML
          tags: draft.tags,
          author_id: user.id,
          status: 'draft',
          cover_image_url: draft.coverImage
        });

      if (error) throw error;

      toast({
        title: "Draft saved",
        description: "Your blog post has been saved as a draft",
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Save failed",
        description: "Failed to save your draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const submitForReview = async () => {
    if (!draft.title.trim() || !draft.content.trim()) {
      toast({
        title: "Content required",
        description: "Please add both a title and content before submitting",
        variant: "destructive"
      });
      return;
    }

    if (draft.tags.length === 0) {
      toast({
        title: "Tags required",
        description: "Please add at least one tag to help categorize your post",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit your post",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const slug = draft.title.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      const { error } = await supabase
        .from('blogs')
        .insert({
          title: draft.title,
          slug: slug,
          content_markdown: draft.content,
          content_html: draft.content, // In real app, convert markdown to HTML
          tags: draft.tags,
          author_id: user.id,
          status: 'submitted',
          cover_image_url: draft.coverImage
        });

      if (error) throw error;

      setDraft(prev => ({ ...prev, status: 'submitted' }));
      toast({
        title: "Submitted for review",
        description: "Your blog post has been submitted and is pending admin approval",
      });
      navigate('/profile');
    } catch (error) {
      console.error('Error submitting post:', error);
      toast({
        title: "Submission failed",
        description: "Failed to submit your post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const wordCount = draft.content.split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Write Your Story</h1>
            <p className="text-muted-foreground mt-1">
              Share your knowledge with the developer community
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
            <AIWritingAssistant 
              onInsertContent={handleAIContentInsert}
              currentContent={draft.content}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-3 space-y-6">
            {/* Title */}
            <Card>
              <CardContent className="p-6">
                <Label htmlFor="title" className="text-base font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  value={draft.title}
                  onChange={(e) => setDraft(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Write an engaging title for your blog post..."
                  className="mt-2 text-lg h-12 border-border/50 focus:border-primary"
                />
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ImageIcon className="h-4 w-4" />
                  Cover Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                {draft.coverImage ? (
                  <div className="relative">
                    <img
                      src={draft.coverImage}
                      alt="Cover"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setDraft(prev => ({ ...prev, coverImage: undefined }));
                        setCoverImageFile(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      Add a cover image to make your post stand out
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageUpload}
                      className="hidden"
                      id="cover-upload"
                    />
                    <Label
                      htmlFor="cover-upload"
                      className="cursor-pointer inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </Label>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4" />
                  Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[500px]">
                  <MDEditor
                    value={draft.content}
                    onChange={handleContentChange}
                    preview={isPreview ? 'preview' : 'edit'}
                    hideToolbar={isPreview}
                    data-color-mode="light"
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tags</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Add tags to help readers find your content (max 5)
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {draft.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1 cursor-pointer hover:bg-destructive/10"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <X className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="Type a tag and press Enter or comma..."
                    disabled={draft.tags.length >= 5}
                    className="border-border/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    {draft.tags.length}/5 tags used
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4" />
                  Author
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{profile?.name || 'User'}</p>
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Word count</span>
                  <span className="font-medium">{wordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reading time</span>
                  <span className="font-medium">{readingTime} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={draft.status === 'draft' ? 'secondary' : 'default'}>
                    {draft.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <Button
                  onClick={saveDraft}
                  disabled={isSaving}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Draft
                    </>
                  )}
                </Button>
                
                <Separator />
                
                <Button
                  onClick={submitForReview}
                  disabled={isSubmitting || !draft.title.trim() || !draft.content.trim()}
                  className="w-full flex items-center gap-2 bg-gradient-primary hover:opacity-90"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit for Review
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  Your post will be reviewed by our team before publication
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;