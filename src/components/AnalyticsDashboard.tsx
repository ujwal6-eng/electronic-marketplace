import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Eye } from 'lucide-react';

const revenueData = [
  { name: 'Jan', revenue: 4000, orders: 240 },
  { name: 'Feb', revenue: 3000, orders: 198 },
  { name: 'Mar', revenue: 5000, orders: 300 },
  { name: 'Apr', revenue: 4500, orders: 275 },
  { name: 'May', revenue: 6000, orders: 350 },
  { name: 'Jun', revenue: 5500, orders: 320 },
  { name: 'Jul', revenue: 7000, orders: 400 },
];

const userActivityData = [
  { name: 'Mon', visitors: 1200, pageViews: 4500 },
  { name: 'Tue', visitors: 1400, pageViews: 5200 },
  { name: 'Wed', visitors: 1100, pageViews: 4100 },
  { name: 'Thu', visitors: 1600, pageViews: 5800 },
  { name: 'Fri', visitors: 1800, pageViews: 6500 },
  { name: 'Sat', visitors: 2200, pageViews: 8000 },
  { name: 'Sun', visitors: 1900, pageViews: 7200 },
];

const categoryData = [
  { name: 'Phones', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Laptops', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'Audio', value: 20, color: 'hsl(var(--chart-3))' },
  { name: 'Accessories', value: 15, color: 'hsl(var(--chart-4))' },
  { name: 'Gaming', value: 5, color: 'hsl(var(--chart-5))' },
];

const conversionFunnelData = [
  { stage: 'Visitors', count: 10000 },
  { stage: 'Product Views', count: 6500 },
  { stage: 'Add to Cart', count: 2800 },
  { stage: 'Checkout', count: 1200 },
  { stage: 'Purchase', count: 800 },
];

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, icon }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className={`flex items-center text-xs ${change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
        {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
        {Math.abs(change)}% from last period
      </div>
    </CardContent>
  </Card>
);

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue" 
          value="$124,500" 
          change={12.5}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard 
          title="Total Orders" 
          value="2,340" 
          change={8.2}
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard 
          title="Active Users" 
          value="12,540" 
          change={15.3}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard 
          title="Page Views" 
          value="89,200" 
          change={-2.4}
          icon={<Eye className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">User Activity</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="funnel">Conversion</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue and order trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary) / 0.2)" 
                    name="Revenue ($)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Weekly visitors and page views</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Visitors"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pageViews" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    name="Page Views"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Distribution of sales across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Best selling products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'iPhone 15 Pro', sales: 245, revenue: '$293,755' },
                    { name: 'MacBook Pro M3', sales: 156, revenue: '$389,844' },
                    { name: 'AirPods Pro 2', sales: 423, revenue: '$105,327' },
                    { name: 'Samsung S24 Ultra', sales: 189, revenue: '$226,611' },
                    { name: 'iPad Pro 12.9"', sales: 98, revenue: '$127,302' },
                  ].map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                      </div>
                      <span className="font-semibold text-primary">{product.revenue}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnel">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>User journey from visit to purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={conversionFunnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-muted-foreground" />
                  <YAxis type="category" dataKey="stage" className="text-muted-foreground" width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Visit → View</p>
                  <p className="text-lg font-semibold text-primary">65%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">View → Cart</p>
                  <p className="text-lg font-semibold text-primary">43%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cart → Checkout</p>
                  <p className="text-lg font-semibold text-primary">43%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Checkout → Purchase</p>
                  <p className="text-lg font-semibold text-primary">67%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
