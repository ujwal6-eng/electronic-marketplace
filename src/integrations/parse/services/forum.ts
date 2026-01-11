// Forum Service - Parse Operations
import Parse from '../client';
import type { ForumPost, ForumReply, ForumCategory } from '../types';

const parseObjectToPost = (obj: Parse.Object): ForumPost => ({
  id: obj.id,
  categoryId: obj.get('categoryId'),
  authorId: obj.get('authorId'),
  title: obj.get('title'),
  content: obj.get('content'),
  voteCount: obj.get('voteCount') || 0,
  replyCount: obj.get('replyCount') || 0,
  viewCount: obj.get('viewCount') || 0,
  isPinned: obj.get('isPinned') || false,
  isAnswered: obj.get('isAnswered') || false,
  bestAnswerId: obj.get('bestAnswerId'),
  createdAt: obj.get('createdAt'),
  updatedAt: obj.get('updatedAt'),
});

const parseObjectToReply = (obj: Parse.Object): ForumReply => ({
  id: obj.id,
  postId: obj.get('postId'),
  authorId: obj.get('authorId'),
  parentReplyId: obj.get('parentReplyId'),
  content: obj.get('content'),
  voteCount: obj.get('voteCount') || 0,
  isBestAnswer: obj.get('isBestAnswer') || false,
  createdAt: obj.get('createdAt'),
  updatedAt: obj.get('updatedAt'),
});

export const forumService = {
  // Get forum categories
  async getForumCategories(): Promise<ForumCategory[]> {
    const ForumCategory = Parse.Object.extend('ForumCategory');
    const query = new Parse.Query(ForumCategory);
    query.ascending('displayOrder');
    
    const results = await query.find();
    return results.map(cat => ({
      id: cat.id,
      name: cat.get('name'),
      slug: cat.get('slug'),
      description: cat.get('description'),
      icon: cat.get('icon'),
      postCount: cat.get('postCount') || 0,
      displayOrder: cat.get('displayOrder') || 0,
      createdAt: cat.get('createdAt'),
    }));
  },

  // Get posts by category
  async getPostsByCategory(categoryId: string): Promise<ForumPost[]> {
    const ForumPost = Parse.Object.extend('ForumPost');
    const query = new Parse.Query(ForumPost);
    query.equalTo('categoryId', categoryId);
    query.descending('createdAt');
    
    const results = await query.find();
    return results.map(parseObjectToPost);
  },

  // Get all posts
  async getAllPosts(limit = 50): Promise<ForumPost[]> {
    const ForumPost = Parse.Object.extend('ForumPost');
    const query = new Parse.Query(ForumPost);
    query.descending('createdAt');
    query.limit(limit);
    
    const results = await query.find();
    return results.map(parseObjectToPost);
  },

  // Get post by ID
  async getPostById(postId: string): Promise<ForumPost | null> {
    const ForumPost = Parse.Object.extend('ForumPost');
    const query = new Parse.Query(ForumPost);
    
    try {
      const result = await query.get(postId);
      
      // Increment view count
      result.increment('viewCount');
      await result.save();
      
      return parseObjectToPost(result);
    } catch (error) {
      return null;
    }
  },

  // Create post
  async createPost(postData: Partial<ForumPost>): Promise<ForumPost> {
    const ForumPost = Parse.Object.extend('ForumPost');
    const post = new ForumPost();
    
    post.set('categoryId', postData.categoryId);
    post.set('authorId', postData.authorId);
    post.set('title', postData.title);
    post.set('content', postData.content);
    post.set('voteCount', 0);
    post.set('replyCount', 0);
    post.set('viewCount', 0);
    post.set('isPinned', false);
    post.set('isAnswered', false);
    
    const saved = await post.save();
    
    // Increment category post count
    const ForumCategory = Parse.Object.extend('ForumCategory');
    const catQuery = new Parse.Query(ForumCategory);
    const category = await catQuery.get(postData.categoryId!);
    category.increment('postCount');
    await category.save();
    
    return parseObjectToPost(saved);
  },

  // Update post
  async updatePost(postId: string, updates: Partial<ForumPost>): Promise<ForumPost> {
    const ForumPost = Parse.Object.extend('ForumPost');
    const query = new Parse.Query(ForumPost);
    const post = await query.get(postId);
    
    if (updates.title) post.set('title', updates.title);
    if (updates.content) post.set('content', updates.content);
    
    const saved = await post.save();
    return parseObjectToPost(saved);
  },

  // Delete post
  async deletePost(postId: string): Promise<void> {
    const ForumPost = Parse.Object.extend('ForumPost');
    const query = new Parse.Query(ForumPost);
    const post = await query.get(postId);
    
    // Delete all replies
    const ForumReply = Parse.Object.extend('ForumReply');
    const replyQuery = new Parse.Query(ForumReply);
    replyQuery.equalTo('postId', postId);
    const replies = await replyQuery.find();
    await Parse.Object.destroyAll(replies);
    
    await post.destroy();
  },

  // Get replies for post
  async getPostReplies(postId: string): Promise<ForumReply[]> {
    const ForumReply = Parse.Object.extend('ForumReply');
    const query = new Parse.Query(ForumReply);
    query.equalTo('postId', postId);
    query.ascending('createdAt');
    
    const results = await query.find();
    return results.map(parseObjectToReply);
  },

  // Create reply
  async createReply(replyData: Partial<ForumReply>): Promise<ForumReply> {
    const ForumReply = Parse.Object.extend('ForumReply');
    const reply = new ForumReply();
    
    reply.set('postId', replyData.postId);
    reply.set('authorId', replyData.authorId);
    reply.set('parentReplyId', replyData.parentReplyId);
    reply.set('content', replyData.content);
    reply.set('voteCount', 0);
    reply.set('isBestAnswer', false);
    
    const saved = await reply.save();
    
    // Increment post reply count
    const ForumPost = Parse.Object.extend('ForumPost');
    const postQuery = new Parse.Query(ForumPost);
    const post = await postQuery.get(replyData.postId!);
    post.increment('replyCount');
    await post.save();
    
    return parseObjectToReply(saved);
  },

  // Vote on post
  async voteOnPost(postId: string, userId: string, voteType: 1 | -1): Promise<void> {
    const PostVote = Parse.Object.extend('PostVote');
    
    // Check existing vote
    const query = new Parse.Query(PostVote);
    query.equalTo('postId', postId);
    query.equalTo('userId', userId);
    const existing = await query.first();
    
    if (existing) {
      const oldVoteType = existing.get('voteType');
      if (oldVoteType === voteType) {
        // Remove vote
        await existing.destroy();
        // Update post vote count
        const ForumPost = Parse.Object.extend('ForumPost');
        const postQuery = new Parse.Query(ForumPost);
        const post = await postQuery.get(postId);
        post.increment('voteCount', -voteType);
        await post.save();
      } else {
        // Change vote
        existing.set('voteType', voteType);
        await existing.save();
        // Update post vote count (difference of 2)
        const ForumPost = Parse.Object.extend('ForumPost');
        const postQuery = new Parse.Query(ForumPost);
        const post = await postQuery.get(postId);
        post.increment('voteCount', voteType * 2);
        await post.save();
      }
    } else {
      // New vote
      const vote = new PostVote();
      vote.set('postId', postId);
      vote.set('userId', userId);
      vote.set('voteType', voteType);
      await vote.save();
      
      // Update post vote count
      const ForumPost = Parse.Object.extend('ForumPost');
      const postQuery = new Parse.Query(ForumPost);
      const post = await postQuery.get(postId);
      post.increment('voteCount', voteType);
      await post.save();
    }
  },

  // Mark answer as best
  async markBestAnswer(postId: string, replyId: string): Promise<void> {
    // Unmark any existing best answer
    const ForumReply = Parse.Object.extend('ForumReply');
    const replyQuery = new Parse.Query(ForumReply);
    replyQuery.equalTo('postId', postId);
    replyQuery.equalTo('isBestAnswer', true);
    const existingBest = await replyQuery.first();
    if (existingBest) {
      existingBest.set('isBestAnswer', false);
      await existingBest.save();
    }
    
    // Mark new best answer
    const query = new Parse.Query(ForumReply);
    const reply = await query.get(replyId);
    reply.set('isBestAnswer', true);
    await reply.save();
    
    // Update post
    const ForumPost = Parse.Object.extend('ForumPost');
    const postQuery = new Parse.Query(ForumPost);
    const post = await postQuery.get(postId);
    post.set('isAnswered', true);
    post.set('bestAnswerId', replyId);
    await post.save();
  },

  // Get post tags
  async getPostTags(postId: string): Promise<string[]> {
    const PostTag = Parse.Object.extend('PostTag');
    const query = new Parse.Query(PostTag);
    query.equalTo('postId', postId);
    
    const results = await query.find();
    return results.map(t => t.get('tag'));
  },

  // Add post tags
  async addPostTags(postId: string, tags: string[]): Promise<void> {
    const PostTag = Parse.Object.extend('PostTag');
    
    await Promise.all(tags.map(async (tag) => {
      const postTag = new PostTag();
      postTag.set('postId', postId);
      postTag.set('tag', tag);
      await postTag.save();
    }));
  },
};
