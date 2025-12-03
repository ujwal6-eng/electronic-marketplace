import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { DollarSign, Package, ShoppingCart, TrendingUp, TrendingDown, Plus, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Local sales data for visualization
const salesData = [
  { date: '2024-01-01', revenue: 2400, orders: 24 },
  { date: '2024-01-02', revenue: 1398, orders: 13 },
  { date: '2024-01-03', revenue: 9800, orders: 98 },
  { date: '2024-01-04', revenue: 3908, orders: 39 },
  { date: '2024-01-05', revenue: 4800, orders: 48 },
  { date: '2024-01-06', revenue: 3800, orders: 38 },
  { date: '2024-01-07', revenue: 4300, orders: 43 },
];

const productPerformance = [
  { id: '1', name: 'iPhone 15 Pro Max', sales: 156, revenue: 186744, trend: 'up' as const },
  { id: '2', name: 'Samsung Galaxy S24', sales: 134, revenue: 147266, trend: 'up' as const },
  { id: '3', name: 'MacBook Pro M3', sales: 89, revenue: 222311, trend: 'stable' as const },
  { id: '4', name: 'Sony WH-1000XM5', sales: 245, revenue: 85555, trend: 'down' as const },
];

export default function SellerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeProducts: 0,
    outOfStock: 0
  });

  useEffect(() => {
    if (user) {
      fetchSellerStats();
    }
  }, [user]);

  const fetchSellerStats = async () => {
    try {
      // Fetch store for current user
      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', user?.id)
        .single();

      if (store) {
        // Fetch products
        const { data: products } = await supabase
          .from('products')
          .select('id, stock_quantity, is_active')
          .eq('store_id', store.id);

        // Fetch orders
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('subtotal, quantity')
          .eq('store_id', store.id);

        const totalRevenue = (orderItems || []).reduce((sum, item) => sum + Number(item.subtotal), 0);
        const totalOrders = (orderItems || []).length;
        const activeProducts = (products || []).filter(p => p.is_active).length;
        const outOfStock = (products || []).filter(p => p.stock_quantity === 0).length;

        setStats({ totalRevenue, totalOrders, activeProducts, outOfStock });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = salesData.reduce((acc, day) => acc + day.revenue, 0);
  const totalOrders = salesData.reduce((acc, day) => acc + day.orders, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
          <p className="text-muted-foreground">Manage your products and track sales</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From all orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Order items sold
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.outOfStock} out of stock</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Per order item
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Daily revenue for the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => `$${value.toLocaleString()}`}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Product Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Your best-selling products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productPerformance.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${product.revenue.toLocaleString()}</p>
                        <div className="flex items-center gap-1 text-sm">
                          {product.trend === 'up' ? (
                            <TrendingUp className="h-3 w-3 text-emerald-500" />
                          ) : product.trend === 'down' ? (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          ) : null}
                          <span className={
                            product.trend === 'up' ? 'text-emerald-500' : 
                            product.trend === 'down' ? 'text-red-500' : 
                            'text-muted-foreground'
                          }>
                            {product.trend}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>Manage your product inventory</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Product management interface coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Fulfillment</CardTitle>
                <CardDescription>Manage and fulfill customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Order fulfillment interface coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}
