// Admin Service - Parse Operations
import Parse from '../client';
import type { FlaggedContent, AppRole } from '../types';

export const adminService = {
  // Get flagged content
  async getFlaggedContent(): Promise<FlaggedContent[]> {
    const FlaggedContent = Parse.Object.extend('FlaggedContent');
    const query = new Parse.Query(FlaggedContent);
    query.descending('createdAt');
    
    const results = await query.find();
    return results.map(fc => ({
      id: fc.id,
      reporterId: fc.get('reporterId'),
      postId: fc.get('postId'),
      replyId: fc.get('replyId'),
      productId: fc.get('productId'),
      reason: fc.get('reason'),
      status: fc.get('status') || 'pending',
      notes: fc.get('notes'),
      reviewedBy: fc.get('reviewedBy'),
      reviewedAt: fc.get('reviewedAt'),
      createdAt: fc.get('createdAt'),
    }));
  },

  // Update flagged content status
  async updateFlaggedContentStatus(
    flaggedId: string, 
    status: 'approved' | 'removed', 
    reviewedBy: string,
    notes?: string
  ): Promise<void> {
    const FlaggedContent = Parse.Object.extend('FlaggedContent');
    const query = new Parse.Query(FlaggedContent);
    const flagged = await query.get(flaggedId);
    
    flagged.set('status', status);
    flagged.set('reviewedBy', reviewedBy);
    flagged.set('reviewedAt', new Date());
    if (notes) flagged.set('notes', notes);
    
    await flagged.save();
  },

  // Report content
  async reportContent(data: {
    reporterId: string;
    postId?: string;
    replyId?: string;
    productId?: string;
    reason: string;
  }): Promise<void> {
    const FlaggedContent = Parse.Object.extend('FlaggedContent');
    const flagged = new FlaggedContent();
    
    flagged.set('reporterId', data.reporterId);
    flagged.set('postId', data.postId);
    flagged.set('replyId', data.replyId);
    flagged.set('productId', data.productId);
    flagged.set('reason', data.reason);
    flagged.set('status', 'pending');
    
    await flagged.save();
  },

  // Get admin stats
  async getAdminStats(): Promise<{
    totalUsers: number;
    activeOrders: number;
    totalRevenue: number;
    flaggedContent: number;
  }> {
    const [usersCount, ordersCount, flaggedCount] = await Promise.all([
      new Parse.Query(Parse.User).count(),
      new Parse.Query(Parse.Object.extend('Order')).count(),
      new Parse.Query(Parse.Object.extend('FlaggedContent'))
        .equalTo('status', 'pending')
        .count(),
    ]);
    
    // Calculate total revenue
    const Order = Parse.Object.extend('Order');
    const orderQuery = new Parse.Query(Order);
    orderQuery.equalTo('paymentStatus', 'completed');
    const paidOrders = await orderQuery.find();
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.get('total') || 0), 0);
    
    // Count active orders
    const activeQuery = new Parse.Query(Order);
    activeQuery.containedIn('status', ['pending', 'processing', 'shipped']);
    const activeOrders = await activeQuery.count();
    
    return {
      totalUsers: usersCount,
      activeOrders,
      totalRevenue,
      flaggedContent: flaggedCount,
    };
  },

  // Manage user roles
  async updateUserRole(userId: string, role: AppRole, action: 'add' | 'remove'): Promise<void> {
    const UserRole = Parse.Object.extend('UserRole');
    
    if (action === 'remove') {
      const query = new Parse.Query(UserRole);
      query.equalTo('userId', userId);
      query.equalTo('role', role);
      const existing = await query.first();
      if (existing) {
        await existing.destroy();
      }
    } else {
      // Check if exists
      const query = new Parse.Query(UserRole);
      query.equalTo('userId', userId);
      query.equalTo('role', role);
      const existing = await query.first();
      
      if (!existing) {
        const userRole = new UserRole();
        userRole.set('userId', userId);
        userRole.set('role', role);
        await userRole.save();
      }
    }
  },

  // Get user activity logs
  async getUserActivityLogs(userId?: string, limit = 100): Promise<any[]> {
    const UserActivityLog = Parse.Object.extend('UserActivityLog');
    const query = new Parse.Query(UserActivityLog);
    
    if (userId) {
      query.equalTo('userId', userId);
    }
    
    query.descending('createdAt');
    query.limit(limit);
    
    const results = await query.find();
    return results.map(log => ({
      id: log.id,
      userId: log.get('userId'),
      activityType: log.get('activityType'),
      activityData: log.get('activityData'),
      ipAddress: log.get('ipAddress'),
      userAgent: log.get('userAgent'),
      createdAt: log.get('createdAt'),
    }));
  },

  // Log user activity
  async logActivity(data: {
    userId: string;
    activityType: string;
    activityData?: any;
  }): Promise<void> {
    const UserActivityLog = Parse.Object.extend('UserActivityLog');
    const log = new UserActivityLog();
    
    log.set('userId', data.userId);
    log.set('activityType', data.activityType);
    log.set('activityData', data.activityData);
    
    await log.save();
  },
};
