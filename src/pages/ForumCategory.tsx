import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { forumCategories, mockForumPosts } from '@/data/mockForum';
import { ChevronLeft, ArrowUp, MessageCircle, Eye, PlusCircle, Filter } from 'lucide-react';

export default function ForumCategory() {
  const { category } = useParams();
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  const categoryInfo = forumCategories.find(c => c.id === category);
  const categoryPosts = mockForumPosts.filter(p => p.category === category);

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
            <h1 className="text-4xl font-bold mb-2">{categoryInfo?.name}</h1>
            <p className="text-muted-foreground">{categoryInfo?.description}</p>
          </div>
          <Link to="/forum/create">
            <Button size="lg" className="gap-2">
              <PlusCircle className="h-5 w-5" />
              New Post
            </Button>
          </Link>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="votes">Most Votes</SelectItem>
              <SelectItem value="answered">Most Answered</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Posts</SelectItem>
              <SelectItem value="answered">Answered</SelectItem>
              <SelectItem value="unanswered">Unanswered</SelectItem>
              <SelectItem value="pinned">Pinned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subcategories */}
        {categoryInfo?.subcategories && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              All
            </Badge>
            {categoryInfo.subcategories.map((sub) => (
              <Badge key={sub} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                {sub}
              </Badge>
            ))}
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {categoryPosts.map((post) => (
            <Link key={post.id} to={`/forum/post/${post.id}`}>
              <Card className="hover:shadow-md transition-all hover:border-primary/50">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center gap-2 min-w-[60px]">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold">{post.votes}</span>
                      <div className="text-xs text-muted-foreground text-center">votes</div>
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        {post.isPinned && (
                          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 shrink-0">
                            Pinned
                          </Badge>
                        )}
                        {post.hasAcceptedAnswer && (
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shrink-0">
                            Solved
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {post.content}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img 
                            src={post.author.avatar} 
                            alt={post.author.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm text-muted-foreground">{post.author.name}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {post.answers.length}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {post.views}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}
