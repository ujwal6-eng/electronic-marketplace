export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 1299.99,
    shippingAddress: '123 Main St, New York, NY 10001',
    trackingNumber: 'TRK123456789',
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'iPhone 15 Pro Max',
        productImage: 'https://images.unsplash.com/photo-1696446702403-051638215112?w=300',
        quantity: 1,
        price: 1299.99
      }
    ]
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-01-20',
    status: 'shipped',
    total: 2499.98,
    shippingAddress: '123 Main St, New York, NY 10001',
    trackingNumber: 'TRK987654321',
    estimatedDelivery: '2024-01-25',
    items: [
      {
        id: '2',
        productId: '2',
        productName: 'MacBook Pro 16"',
        productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300',
        quantity: 1,
        price: 2499.98
      }
    ]
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    date: '2024-01-22',
    status: 'processing',
    total: 599.99,
    shippingAddress: '123 Main St, New York, NY 10001',
    items: [
      {
        id: '3',
        productId: '3',
        productName: 'Samsung Galaxy S24',
        productImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300',
        quantity: 1,
        price: 599.99
      }
    ]
  }
];

export interface Transaction {
  id: string;
  date: string;
  type: 'purchase' | 'refund' | 'payout';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  orderId?: string;
  paymentMethod: string;
}

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-01-15',
    type: 'purchase',
    amount: -1299.99,
    status: 'completed',
    description: 'Order #ORD-2024-001',
    orderId: '1',
    paymentMethod: 'Visa ending in 4242'
  },
  {
    id: '2',
    date: '2024-01-20',
    type: 'purchase',
    amount: -2499.98,
    status: 'completed',
    description: 'Order #ORD-2024-002',
    orderId: '2',
    paymentMethod: 'Visa ending in 4242'
  },
  {
    id: '3',
    date: '2024-01-22',
    type: 'purchase',
    amount: -599.99,
    status: 'pending',
    description: 'Order #ORD-2024-003',
    orderId: '3',
    paymentMethod: 'Visa ending in 4242'
  }
];
