import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Copy, RefreshCw, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIWritingAssistantProps {
  onInsertContent: (content: string) => void;
  currentContent?: string;
}

interface GenerationTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: 'blog' | 'intro' | 'conclusion' | 'section';
}

const templates: GenerationTemplate[] = [
  {
    id: 'blog-intro',
    name: 'Blog Introduction',
    description: 'Generate an engaging introduction for your blog post',
    prompt: 'Write an engaging introduction for a blog post about',
    category: 'intro'
  },
  {
    id: 'tech-explanation',
    name: 'Technical Explanation',
    description: 'Explain complex technical concepts simply',
    prompt: 'Explain this technical concept in simple terms',
    category: 'section'
  },
  {
    id: 'code-tutorial',
    name: 'Code Tutorial',
    description: 'Create step-by-step coding tutorials',
    prompt: 'Create a step-by-step tutorial for',
    category: 'blog'
  },
  {
    id: 'conclusion',
    name: 'Conclusion',
    description: 'Write a strong conclusion that summarizes key points',
    prompt: 'Write a compelling conclusion that summarizes',
    category: 'conclusion'
  },
  {
    id: 'list-article',
    name: 'List Article',
    description: 'Generate listicle content with multiple points',
    prompt: 'Create a comprehensive list article about',
    category: 'blog'
  }
];

export const AIWritingAssistant = ({ onInsertContent, currentContent }: AIWritingAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  // Remove API key state - now handled securely on backend
  const [selectedTemplate, setSelectedTemplate] = useState<GenerationTemplate | null>(null);
  const { toast } = useToast();

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing prompt",
        description: "Please enter a prompt to generate content.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const response = await fetch(`https://zklhwdjtccyeoozslafz.supabase.co/functions/v1/ai-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          template: selectedTemplate,
          model: 'gemini-1.5-flash'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to generate content' }));
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data.generatedText);

      toast({
        title: "Content generated!",
        description: "AI has successfully generated your content.",
      });

    } catch (error: any) {
      console.error('Error generating content:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const insertContent = () => {
    if (generatedContent) {
      onInsertContent(generatedContent);
      setIsOpen(false);
      setGeneratedContent('');
      setPrompt('');
      setSelectedTemplate(null);
      toast({
        title: "Content Inserted",
        description: "AI-generated content has been added to your editor",
      });
    }
  };

  const copyContent = async () => {
    if (generatedContent) {
      await navigator.clipboard.writeText(generatedContent);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
    }
  };

  const useTemplate = (template: GenerationTemplate) => {
    setSelectedTemplate(template);
    setPrompt('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          AI Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Writing Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            {/* AI Info */}
            <div className="space-y-2">
              <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Powered by Gemini AI</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Secure AI content generation with advanced templates and customization.
                </p>
              </div>
            </div>

            {/* Templates */}
            <div className="space-y-2">
              <Label>Quick Templates</Label>
              <div className="grid grid-cols-1 gap-2">
                {templates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => useTemplate(template)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium text-sm">{template.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Custom Prompt */}
            <div className="space-y-2">
              <Label htmlFor="prompt">
                {selectedTemplate ? `${selectedTemplate.name} Topic` : 'What would you like to write about?'}
              </Label>
              <Textarea
                id="prompt"
                placeholder={
                  selectedTemplate 
                    ? `Enter the topic for your ${selectedTemplate.name.toLowerCase()}...`
                    : "Describe what you want to write about..."
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              onClick={generateContent} 
              disabled={isGenerating} 
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <Label>Generated Content</Label>
            {generatedContent ? (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Generated Content</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={copyContent}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={generateContent} disabled={isGenerating}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-3 rounded-md max-h-60 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
                  </div>
                  <Button onClick={insertContent} className="w-full mt-3 bg-gradient-primary hover:opacity-90">
                    Insert into Editor
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generated content will appear here</p>
                  <p className="text-sm">Use templates or write a custom prompt to get started</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};