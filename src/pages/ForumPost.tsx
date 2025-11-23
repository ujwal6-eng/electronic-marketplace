import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { mockForumPosts } from '@/data/mockForum';
import { 
  ChevronLeft, ArrowUp, ArrowDown, MessageCircle, 
  Share2, CheckCircle2, Flag 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ForumPost() {
  const { id } = useParams();
  const [replyText, setReplyText] = useState('');
  const post = mockForumPosts.find(p => p.id === id);

  if (!post) {
    return <div>Post not found</div>;
  }

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    toast({ title: 'Reply posted successfully!' });
    setReplyText('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: 'Link copied to clipboard!' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24 max-w-4xl">
        <Link to={`/forum/category/${post.category}`}>
          <Button variant="ghost" className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to {post.category}
          </Button>
        </Link>

        {/* Main Post */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              {/* Vote Section */}
              <div className="flex flex-col items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-primary">
                  <ArrowUp className="h-5 w-5" />
                </Button>
                <span className="font-bold text-lg">{post.votes}</span>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-destructive">
                  <ArrowDown className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-wrap items-start gap-2 mb-4">
                  <h1 className="text-3xl font-bold flex-1">{post.title}</h1>
                  {post.hasAcceptedAnswer && (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Solved
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="prose max-w-none mb-6">
                  <p className="text-muted-foreground">{post.content}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{post.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Reputation: {post.author.reputation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Flag className="h-4 w-4 mr-2" />
                      Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            {post.answers.length} Answers
          </h2>

          <div className="space-y-4">
            {post.answers.map((answer) => (
              <Card key={answer.id} className={answer.isAccepted ? 'border-emerald-500 border-2' : ''}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-primary">
                        <ArrowUp className="h-5 w-5" />
                      </Button>
                      <span className="font-semibold">{answer.votes}</span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-destructive">
                        <ArrowDown className="h-5 w-5" />
                      </Button>
                      {answer.isAccepted && (
                        <CheckCircle2 className="h-6 w-6 text-emerald-500 mt-2" />
                      )}
                    </div>

                    {/* Answer Content */}
                    <div className="flex-1">
                      {answer.isAccepted && (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 mb-3">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Accepted Answer
                        </Badge>
                      )}

                      <div className="prose max-w-none mb-4">
                        <p className="text-muted-foreground">{answer.content}</p>
                      </div>

                      {/* Replies */}
                      {answer.replies.length > 0 && (
                        <div className="ml-6 pl-6 border-l-2 border-border space-y-4 mb-4">
                          {answer.replies.map((reply) => (
                            <div key={reply.id} className="text-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <img 
                                  src={reply.author.avatar} 
                                  alt={reply.author.name}
                                  className="w-6 h-6 rounded-full"
                                />
                                <span className="font-semibold">{reply.author.name}</span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-muted-foreground">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-2">
                          <img 
                            src={answer.author.avatar} 
                            alt={answer.author.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-sm">{answer.author.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(answer.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <Button variant="ghost" size="sm">
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Reply Form */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Your Answer</h3>
            <Textarea
              placeholder="Write your answer here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={6}
              className="mb-4"
            />
            <Button onClick={handleSubmitReply} disabled={!replyText.trim()}>
              Post Answer
            </Button>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}
