import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { forumCategories, mockForumPosts } from '@/data/mockForum';
import { 
  Smartphone, Laptop, Home, Tv, Gamepad2, MessageSquare, 
  Search, TrendingUp, Clock, ArrowUp, MessageCircle, Eye, PlusCircle 
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Smartphone, Laptop, Home, Tv, Gamepad2, MessageSquare
};

export default function Forum() {
  const [searchQuery, setSearchQuery] = useState('');

  const trendingPosts = mockForumPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 gradient-primary bg-clip-text text-transparent">
                Community Forum
              </h1>
              <p className="text-muted-foreground">
                Ask questions, share knowledge, and connect with experts
              </p>
            </div>
            <Link to="/forum/create">
              <Button size="lg" className="gap-2">
                <PlusCircle className="h-5 w-5" />
                Ask Question
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for questions, topics, or keywords..."
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Trending Posts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Trending Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trendingPosts.map((post) => (
              <Link key={post.id} to={`/forum/post/${post.id}`}>
                <Card className="hover:shadow-lg transition-all hover:scale-[1.02] h-full">
                  <CardContent className="p-4">
                    {post.isPinned && (
                      <Badge className="mb-2 bg-amber-500/10 text-amber-500 border-amber-500/20">
                        Pinned
                      </Badge>
                    )}
                    <h3 className="font-semibold mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ArrowUp className="h-3 w-3" />
                        {post.votes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.answers.length}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forumCategories.map((category) => {
              const Icon = iconMap[category.icon] || MessageSquare;
              return (
                <Link key={category.id} to={`/forum/category/${category.id}`}>
                  <Card className="hover:shadow-lg transition-all hover:scale-[1.02] hover:border-primary/50">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-3 rounded-lg gradient-secondary">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <Badge variant="secondary">{category.postCount} posts</Badge>
                      </div>
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {category.subcategories?.slice(0, 3).map((sub) => (
                          <Badge key={sub} variant="outline" className="text-xs">
                            {sub}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Recent Activity
          </h2>
          <Card>
            <CardContent className="p-0">
              {mockForumPosts.map((post, index) => (
                <Link 
                  key={post.id} 
                  to={`/forum/post/${post.id}`}
                  className="block hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-4 ${index !== mockForumPosts.length - 1 ? 'border-b border-border' : ''}`}>
                    <div className="flex gap-4">
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          {post.hasAcceptedAnswer && (
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shrink-0">
                              Solved
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
                          <span>{post.author.name}</span>
                          <span>•</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">{post.category}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <ArrowUp className="h-3 w-3" />
                            {post.votes} votes
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {post.answers.length} answers
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.views} views
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}
