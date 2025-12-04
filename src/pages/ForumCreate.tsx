import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Upload, X, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function ForumCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['forum-categories'],
    queryFn: async () => {
      const { data } = await supabase.from('forum_categories').select('*').order('name');
      return data || [];
    }
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] },
    maxSize: 5242880,
    onDrop: (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles]);
      toast({ title: `${acceptedFiles.length} file(s) added` });
    }
  });

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput) && tags.length < 5) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleSubmit = () => {
    if (!title || !content || !category) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    toast({ title: 'Post created successfully!' });
    navigate('/forum');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-24 max-w-4xl">
        <Button variant="ghost" className="mb-4" onClick={() => navigate('/forum')}>
          <ChevronLeft className="h-4 w-4 mr-2" />Back to Forum
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Ask a Question</CardTitle>
            <CardDescription>Get help from the community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Title <span className="text-destructive">*</span></Label>
              <Input placeholder="What's your question?" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2" />
            </div>

            <div>
              <Label>Category <span className="text-destructive">*</span></Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-2"><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description <span className="text-destructive">*</span></Label>
              <RichTextEditor content={content} onChange={setContent} placeholder="Describe your problem..." />
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2 mt-2">
                <Input placeholder="e.g., iphone" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} disabled={tags.length >= 5} />
                <Button onClick={addTag} disabled={!tagInput || tags.length >= 5}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary">#{tag}<X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setTags(tags.filter(t => t !== tag))} /></Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleSubmit} size="lg" className="flex-1">Post Question</Button>
              <Button onClick={() => setPreview(!preview)} variant="outline" size="lg"><Eye className="h-4 w-4 mr-2" />Preview</Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
}