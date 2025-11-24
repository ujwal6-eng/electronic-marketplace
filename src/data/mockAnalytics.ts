export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface UserStats {
  total: number;
  active: number;
  new: number;
  growth: number;
}

export const mockSalesData: SalesData[] = [
  { date: '2024-01-01', revenue: 12500, orders: 45 },
  { date: '2024-01-02', revenue: 15200, orders: 52 },
  { date: '2024-01-03', revenue: 13800, orders: 48 },
  { date: '2024-01-04', revenue: 16500, orders: 58 },
  { date: '2024-01-05', revenue: 18200, orders: 63 },
  { date: '2024-01-06', revenue: 14900, orders: 51 },
  { date: '2024-01-07', revenue: 17600, orders: 60 }
];

export const mockUserStats: UserStats = {
  total: 15420,
  active: 8932,
  new: 342,
  growth: 12.5
};

export interface ProductPerformance {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  trend: 'up' | 'down' | 'stable';
}

export const mockProductPerformance: ProductPerformance[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    sales: 124,
    revenue: 161198,
    trend: 'up'
  },
  {
    id: '2',
    name: 'MacBook Pro 16"',
    sales: 89,
    revenue: 222499,
    trend: 'up'
  },
  {
    id: '3',
    name: 'Samsung Galaxy S24',
    sales: 156,
    revenue: 93594,
    trend: 'stable'
  }
];
