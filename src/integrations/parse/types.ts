// Parse Types - Equivalent to Supabase types
// These define the structure of your Parse Classes (MongoDB collections)

export type AppRole = 'buyer' | 'seller' | 'technician' | 'admin';
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type ProductCondition = 'new' | 'used' | 'refurbished';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';

// User Profile
export interface Profile {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User Roles
export interface UserRole {
  id: string;
  userId: string;
  role: AppRole;
  createdAt: Date;
}

// Store
export interface Store {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  rating: number;
  totalReviews: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Product
export interface Product {
  id: string;
  storeId: string;
  categoryId?: string;
  name: string;
  slug: string;
  description?: string;
  sku?: string;
  brand?: string;
  model?: string;
  price: number;
  discountPrice?: number;
  condition: ProductCondition;
  stockQuantity: number;
  rating: number;
  totalReviews: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  store?: Store;
  images?: ProductImage[];
}

// Product Image
export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string;
  displayOrder: number;
  isPrimary: boolean;
  createdAt: Date;
}

// Product Category
export interface ProductCategory {
  id: string;
  parentId?: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Order
export interface Order {
  id: string;
  userId: string;
  shippingAddressId?: string;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  items?: OrderItem[];
  shippingAddress?: ShippingAddress;
}

// Order Item
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  storeId: string;
  quantity: number;
  price: number;
  subtotal: number;
  createdAt: Date;
  // Relations
  product?: Product;
}

// Shipping Address
export interface ShippingAddress {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Service Category
export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  createdAt: Date;
}

// Technician Profile
export interface TechnicianProfile {
  id: string;
  userId: string;
  bio?: string;
  certifications?: string[];
  serviceArea?: string;
  experienceYears: number;
  hourlyRate?: number;
  rating: number;
  totalReviews: number;
  totalJobs: number;
  verified: VerificationStatus;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  profile?: Profile;
}

// Service Booking
export interface ServiceBooking {
  id: string;
  userId: string;
  technicianId: string;
  categoryId: string;
  deviceType: string;
  deviceBrand?: string;
  deviceModel?: string;
  issueDescription: string;
  serviceLocation: string;
  status: BookingStatus;
  scheduledDate: Date;
  completedDate?: Date;
  estimatedCost?: number;
  finalCost?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  technician?: TechnicianProfile;
  category?: ServiceCategory;
}

// Forum Category
export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  postCount: number;
  displayOrder: number;
  createdAt: Date;
}

// Forum Post
export interface ForumPost {
  id: string;
  categoryId: string;
  authorId: string;
  title: string;
  content: string;
  voteCount: number;
  replyCount: number;
  viewCount: number;
  isPinned: boolean;
  isAnswered: boolean;
  bestAnswerId?: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  author?: Profile;
  category?: ForumCategory;
}

// Forum Reply
export interface ForumReply {
  id: string;
  postId: string;
  authorId: string;
  parentReplyId?: string;
  content: string;
  voteCount: number;
  isBestAnswer: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  author?: Profile;
}

// Product Review
export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  content?: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  user?: Profile;
}

// User Statistics
export interface UserStatistics {
  id: string;
  userId: string;
  totalOrders: number;
  totalReviews: number;
  totalForumPosts: number;
  totalServicesBooked: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

// Flagged Content
export interface FlaggedContent {
  id: string;
  reporterId: string;
  postId?: string;
  replyId?: string;
  productId?: string;
  reason: string;
  status: 'pending' | 'approved' | 'removed';
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
}

// Transaction
export interface Transaction {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  createdAt: Date;
}
