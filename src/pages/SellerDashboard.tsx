import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { DollarSign, Package, ShoppingCart, TrendingUp, Plus, Loader2, Store } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

interface ProductPerformance {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<{ id: string; name: string } | null>(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeProducts: 0,
    outOfStock: 0
  });
  const [products, setProducts] = useState<Array<{
    id: string;
    name: string;
    price: number;
    stock_quantity: number;
    is_active: boolean;
  }>>([]);
  const [topProducts, setTopProducts] = useState<ProductPerformance[]>([]);
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);

  useEffect(() => {
    if (user) {
      fetchSellerData();
    }
  }, [user]);

  const fetchSellerData = async () => {
    try {
      // Fetch store for current user
      const { data: storeData } = await supabase
        .from('stores')
        .select('id, name')
        .eq('owner_id', user?.id)
        .maybeSingle();

      if (storeData) {
        setStore(storeData);

        // Fetch products
        const { data: productsData } = await supabase
          .from('products')
          .select('id, name, price, stock_quantity, is_active')
          .eq('store_id', storeData.id);

        setProducts(productsData || []);

        // Fetch order items with order details
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('id, subtotal, quantity, product_id, created_at')
          .eq('store_id', storeData.id);

        const totalRevenue = (orderItems || []).reduce((sum, item) => sum + Number(item.subtotal), 0);
        const totalOrders = (orderItems || []).length;
        const activeProducts = (productsData || []).filter(p => p.is_active).length;
        const outOfStock = (productsData || []).filter(p => p.stock_quantity === 0).length;

        setStats({ totalRevenue, totalOrders, activeProducts, outOfStock });

        // Calculate top performing products
        if (orderItems && orderItems.length > 0 && productsData) {
          const productSales: Record<string, { sales: number; revenue: number }> = {};
          
          orderItems.forEach(item => {
            if (!productSales[item.product_id]) {
              productSales[item.product_id] = { sales: 0, revenue: 0 };
            }
            productSales[item.product_id].sales += item.quantity;
            productSales[item.product_id].revenue += Number(item.subtotal);
          });

          const topProductsList: ProductPerformance[] = Object.entries(productSales)
            .map(([productId, data]) => {
              const product = productsData.find(p => p.id === productId);
              return {
                id: productId,
                name: product?.name || 'Unknown Product',
                sales: data.sales,
                revenue: data.revenue
              };
            })
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

          setTopProducts(topProductsList);

          // Calculate daily sales for the past 7 days
          const dailySales: Record<string, { revenue: number; orders: number }> = {};
          const today = new Date();
          
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dailySales[dateStr] = { revenue: 0, orders: 0 };
          }

          orderItems.forEach(item => {
            const dateStr = new Date(item.created_at).toISOString().split('T')[0];
            if (dailySales[dateStr]) {
              dailySales[dateStr].revenue += Number(item.subtotal);
              dailySales[dateStr].orders += 1;
            }
          });

          const salesDataList: SalesDataPoint[] = Object.entries(dailySales).map(([date, data]) => ({
            date,
            revenue: data.revenue,
            orders: data.orders
          }));

          setSalesData(salesDataList);
        }
      }
    } catch (error) {
      console.error('Error fetching seller data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6 pb-24">
          <Card className="max-w-md mx-auto mt-12">
            <CardHeader className="text-center">
              <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <CardTitle>No Store Found</CardTitle>
              <CardDescription>
                You haven't created a store yet. Create your store to start selling.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Store
              </Button>
            </CardContent>
          </Card>
        </main>
        <BottomNav />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
          <p className="text-muted-foreground">Manage your store: {store.name}</p>
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
                {salesData.length > 0 ? (
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
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No sales data yet. Start selling to see your analytics!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Your best-selling products</CardDescription>
              </CardHeader>
              <CardContent>
                {topProducts.length > 0 ? (
                  <div className="space-y-4">
                    {topProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${product.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No product sales yet. Your top performers will appear here.</p>
                  </div>
                )}
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
                {products.length > 0 ? (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Stock: {product.stock_quantity} • ${Number(product.price).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded ${product.is_active ? 'bg-emerald-500/20 text-emerald-600' : 'bg-red-500/20 text-red-600'}`}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No products yet. Add your first product to start selling!</p>
                  </div>
                )}
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
                  No pending orders. Your orders will appear here when customers purchase.
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
