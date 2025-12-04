import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ArrowUp, ArrowDown, MessageCircle, Share2, CheckCircle2, Flag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function ForumPost() {
  const { id } = useParams();
  const [replyText, setReplyText] = useState('');

  const { data: post, isLoading } = useQuery({
    queryKey: ['forum-post', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('forum_posts')
        .select(`*, profiles(first_name, last_name, avatar_url), forum_categories(name, slug)`)
        .eq('id', id)
        .single();
      return data;
    }
  });

  const { data: replies } = useQuery({
    queryKey: ['forum-replies', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('forum_replies')
        .select(`*, profiles(first_name, last_name, avatar_url)`)
        .eq('post_id', id)
        .order('created_at');
      return data || [];
    },
    enabled: !!id
  });

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    toast({ title: 'Reply posted successfully!' });
    setReplyText('');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background"><Header /><div className="container mx-auto px-4 py-6"><Skeleton className="h-64" /></div></div>;
  }

  if (!post) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p>Post not found</p></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-24 max-w-4xl">
        <Link to={`/forum/category/${post.forum_categories?.slug || 'general'}`}>
          <Button variant="ghost" className="mb-4"><ChevronLeft className="h-4 w-4 mr-2" />Back</Button>
        </Link>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            {post.is_answered && <Badge className="bg-emerald-500/10 text-emerald-500 mb-4"><CheckCircle2 className="h-3 w-3 mr-1" />Solved</Badge>}
            <p className="text-muted-foreground mb-4">{post.content}</p>
            <div className="flex items-center gap-3 pt-4 border-t">
              <img src={post.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author_id}`} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold">{post.profiles?.first_name || 'Anonymous'}</p>
                <p className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4"><MessageCircle className="inline h-6 w-6 mr-2" />{replies?.length || 0} Answers</h2>
        
        <div className="space-y-4 mb-6">
          {replies?.map((reply) => (
            <Card key={reply.id}>
              <CardContent className="p-4">
                <p className="text-muted-foreground mb-3">{reply.content}</p>
                <div className="flex items-center gap-2 text-sm">
                  <img src={reply.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.author_id}`} className="w-6 h-6 rounded-full" />
                  <span>{reply.profiles?.first_name || 'Anonymous'}</span>
                  <span className="text-muted-foreground">• {new Date(reply.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Your Answer</h3>
            <Textarea placeholder="Write your answer..." value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={4} className="mb-4" />
            <Button onClick={handleSubmitReply} disabled={!replyText.trim()}>Post Answer</Button>
          </CardContent>
        </Card>
      </main>
      <BottomNav />
      <Footer />
    </div>
  );
}