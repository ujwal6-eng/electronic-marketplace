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
import { forumCategories } from '@/data/mockForum';
import { ChevronLeft, Upload, X, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ForumCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 5242880, // 5MB
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

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title || !content || !category) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    toast({ title: 'Post created successfully!', description: 'Your question has been posted.' });
    navigate('/forum');
  };

  const handleSaveDraft = () => {
    toast({ title: 'Draft saved', description: 'Your post has been saved as a draft.' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24 max-w-4xl">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('/forum')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Forum
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Ask a Question</CardTitle>
            <CardDescription>
              Get help from the community by asking your question
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-base">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="What's your question? Be specific."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {title.length}/150 characters
              </p>
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category" className="text-base">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {forumCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div>
              <Label className="text-base">
                Description <span className="text-destructive">*</span>
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Provide details about your question. Be clear and concise.
              </p>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Describe your problem in detail..."
              />
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags" className="text-base">Tags</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Add up to 5 tags to help others find your question
              </p>
              <div className="flex gap-2 mb-2">
                <Input
                  id="tags"
                  placeholder="e.g., iphone, screen-repair"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  disabled={tags.length >= 5}
                />
                <Button onClick={addTag} disabled={!tagInput || tags.length >= 5}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    #{tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <Label className="text-base">Attachments</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Upload images to help explain your problem (max 5MB each)
              </p>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                {isDragActive ? (
                  <p className="text-muted-foreground">Drop the files here...</p>
                ) : (
                  <div>
                    <p className="text-muted-foreground mb-1">
                      Drag and drop files here, or click to select
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports: PNG, JPG, GIF (max 5MB)
                    </p>
                  </div>
                )}
              </div>
              
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button onClick={handleSubmit} size="lg" className="flex-1">
                Post Question
              </Button>
              <Button onClick={handleSaveDraft} variant="outline" size="lg">
                Save Draft
              </Button>
              <Button 
                onClick={() => setPreview(!preview)} 
                variant="outline" 
                size="lg"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        {preview && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-2xl font-bold mb-4">{title || 'Your question title'}</h2>
              <div className="flex flex-wrap gap-1 mb-4">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary">#{tag}</Badge>
                ))}
              </div>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content || '<p class="text-muted-foreground">Your question content will appear here...</p>' }}
              />
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
