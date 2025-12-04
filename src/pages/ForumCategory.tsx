import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ArrowUp, MessageCircle, Eye, PlusCircle, Filter, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function ForumCategory() {
  const { category } = useParams();
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  const { data: categoryInfo } = useQuery({
    queryKey: ['forum-category', category],
    queryFn: async () => {
      const { data } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('slug', category)
        .single();
      return data;
    }
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ['forum-category-posts', category],
    queryFn: async () => {
      if (!categoryInfo?.id) return [];
      const { data } = await supabase
        .from('forum_posts')
        .select(`*, profiles(first_name, last_name, avatar_url)`)
        .eq('category_id', categoryInfo.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!categoryInfo?.id
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-24">
        <Link to="/forum">
          <Button variant="ghost" className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Forum
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{categoryInfo?.name || 'Category'}</h1>
            <p className="text-muted-foreground">{categoryInfo?.description}</p>
          </div>
          <Link to="/forum/create">
            <Button size="lg" className="gap-2">
              <PlusCircle className="h-5 w-5" />
              New Post
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link key={post.id} to={`/forum/post/${post.id}`}>
                <Card className="hover:shadow-md transition-all hover:border-primary/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                    <p className="text-muted-foreground mb-3 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{post.profiles?.first_name || 'Anonymous'}</span>
                      <span>•</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      <div className="flex items-center gap-1"><ArrowUp className="h-3 w-3" />{post.vote_count || 0}</div>
                      <div className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{post.reply_count || 0}</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card><CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No posts in this category yet.</p>
          </CardContent></Card>
        )}
      </main>
      <BottomNav />
      <Footer />
    </div>
  );
}