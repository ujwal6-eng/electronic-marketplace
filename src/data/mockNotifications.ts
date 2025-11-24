export interface Notification {
  id: string;
  type: 'order' | 'service' | 'forum' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionUrl?: string;
}

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order Shipped',
    message: 'Your order #ORD-2024-002 has been shipped',
    date: '2024-01-20T10:30:00',
    read: false,
    actionUrl: '/orders'
  },
  {
    id: '2',
    type: 'service',
    title: 'Service Booking Confirmed',
    message: 'Your iPhone repair is scheduled for Jan 25',
    date: '2024-01-19T15:45:00',
    read: false,
    actionUrl: '/services'
  },
  {
    id: '3',
    type: 'forum',
    title: 'New Reply',
    message: 'Someone replied to your forum post',
    date: '2024-01-18T09:20:00',
    read: true,
    actionUrl: '/forum'
  },
  {
    id: '4',
    type: 'system',
    title: 'Welcome to Electro!',
    message: 'Thank you for joining our community',
    date: '2024-01-15T08:00:00',
    read: true
  }
];
