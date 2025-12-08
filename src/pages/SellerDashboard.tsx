import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { DollarSign, Package, ShoppingCart, TrendingUp, Plus, Loader2, Store, Pencil, Trash2, Upload, X, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';

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

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  condition: 'new' | 'used' | 'refurbished';
  brand: string | null;
  images?: { id: string; image_url: string; is_primary: boolean }[];
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [storeDialogOpen, setStoreDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [store, setStore] = useState<{ id: string; name: string } | null>(null);
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  
  // Product form state
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productCondition, setProductCondition] = useState<'new' | 'used' | 'refurbished'>('new');
  const [productBrand, setProductBrand] = useState('');
  const [productImages, setProductImages] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  // Edit product state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeProducts: 0,
    outOfStock: 0
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [topProducts, setTopProducts] = useState<ProductPerformance[]>([]);
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);

  useEffect(() => {
    if (user) {
      fetchSellerData();
    }
  }, [user]);

  const fetchSellerData = async () => {
    try {
      const { data: storeData } = await supabase
        .from('stores')
        .select('id, name')
        .eq('owner_id', user?.id)
        .maybeSingle();

      if (storeData) {
        setStore(storeData);

        const { data: productsData } = await supabase
          .from('products')
          .select('id, name, description, price, stock_quantity, is_active, condition, brand')
          .eq('store_id', storeData.id);

        // Fetch images for each product
        const productsWithImages: Product[] = [];
        for (const product of productsData || []) {
          const { data: imagesData } = await supabase
            .from('product_images')
            .select('id, image_url, is_primary')
            .eq('product_id', product.id)
            .order('is_primary', { ascending: false });
          
          productsWithImages.push({
            ...product,
            condition: product.condition as 'new' | 'used' | 'refurbished',
            images: imagesData || []
          });
        }

        setProducts(productsWithImages);

        const { data: orderItems } = await supabase
          .from('order_items')
          .select('id, subtotal, quantity, product_id, created_at')
          .eq('store_id', storeData.id);

        const totalRevenue = (orderItems || []).reduce((sum, item) => sum + Number(item.subtotal), 0);
        const totalOrders = (orderItems || []).length;
        const activeProducts = (productsData || []).filter(p => p.is_active).length;
        const outOfStock = (productsData || []).filter(p => p.stock_quantity === 0).length;

        setStats({ totalRevenue, totalOrders, activeProducts, outOfStock });

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

  const handleCreateStore = async () => {
    if (!storeName.trim()) {
      toast.error('Please enter a store name');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to create a store');
      return;
    }

    setCreating(true);
    try {
      const slug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const { data, error } = await supabase
        .from('stores')
        .insert({
          name: storeName,
          slug: slug + '-' + Date.now(),
          description: storeDescription || null,
          owner_id: user.id
        })
        .select('id, name')
        .single();

      if (error) throw error;

      setStore(data);
      setStoreDialogOpen(false);
      setStoreName('');
      setStoreDescription('');
      toast.success('Store created successfully!');
    } catch (error: any) {
      console.error('Error creating store:', error);
      toast.error(error.message || 'Failed to create store');
    } finally {
      setCreating(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setProductImages(prev => [...prev, ...acceptedFiles].slice(0, 5)); // Max 5 images
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removeImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadProductImages = async (productId: string): Promise<void> => {
    if (productImages.length === 0) return;

    setUploadingImages(true);
    try {
      for (let i = 0; i < productImages.length; i++) {
        const file = productImages[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${productId}/${Date.now()}-${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);

        await supabase.from('product_images').insert({
          product_id: productId,
          image_url: urlData.publicUrl,
          is_primary: i === 0
        });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!productName.trim()) {
      toast.error('Please enter a product name');
      return;
    }
    if (!productPrice || Number(productPrice) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    if (!store) {
      toast.error('Store not found');
      return;
    }

    setCreatingProduct(true);
    try {
      const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
      
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productName,
          slug,
          description: productDescription || null,
          price: Number(productPrice),
          stock_quantity: Number(productStock) || 0,
          condition: productCondition,
          brand: productBrand || null,
          store_id: store.id,
          is_active: true
        })
        .select('id, name, description, price, stock_quantity, is_active, condition, brand')
        .single();

      if (error) throw error;

      // Upload images if any
      if (productImages.length > 0) {
        await uploadProductImages(data.id);
      }

      // Fetch the product with images
      const { data: imagesData } = await supabase
        .from('product_images')
        .select('id, image_url, is_primary')
        .eq('product_id', data.id);

      const newProduct: Product = {
        ...data,
        condition: data.condition as 'new' | 'used' | 'refurbished',
        images: imagesData || []
      };

      setProducts(prev => [...prev, newProduct]);
      setStats(prev => ({ ...prev, activeProducts: prev.activeProducts + 1 }));
      setProductDialogOpen(false);
      resetProductForm();
      toast.success('Product added successfully!');
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(error.message || 'Failed to add product');
    } finally {
      setCreatingProduct(false);
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;
    if (!productName.trim()) {
      toast.error('Please enter a product name');
      return;
    }
    if (!productPrice || Number(productPrice) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setCreatingProduct(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: productName,
          description: productDescription || null,
          price: Number(productPrice),
          stock_quantity: Number(productStock) || 0,
          condition: productCondition,
          brand: productBrand || null
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      // Upload new images if any
      if (productImages.length > 0) {
        await uploadProductImages(editingProduct.id);
      }

      // Fetch updated product with images
      const { data: imagesData } = await supabase
        .from('product_images')
        .select('id, image_url, is_primary')
        .eq('product_id', editingProduct.id);

      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? {
              ...p,
              name: productName,
              description: productDescription || null,
              price: Number(productPrice),
              stock_quantity: Number(productStock) || 0,
              condition: productCondition,
              brand: productBrand || null,
              images: imagesData || []
            }
          : p
      ));
      setEditDialogOpen(false);
      setEditingProduct(null);
      resetProductForm();
      toast.success('Product updated successfully!');
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Failed to update product');
    } finally {
      setCreatingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setDeletingProductId(productId);
    try {
      // Delete product images from storage
      const { data: images } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', productId);

      if (images && images.length > 0) {
        for (const img of images) {
          const path = img.image_url.split('/products/')[1];
          if (path) {
            await supabase.storage.from('products').remove([path]);
          }
        }
        await supabase.from('product_images').delete().eq('product_id', productId);
      }

      // Delete product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== productId));
      setStats(prev => ({ ...prev, activeProducts: prev.activeProducts - 1 }));
      toast.success('Product deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleDeleteProductImage = async (imageId: string, imageUrl: string, productId: string) => {
    try {
      const path = imageUrl.split('/products/')[1];
      if (path) {
        await supabase.storage.from('products').remove([path]);
      }
      
      await supabase.from('product_images').delete().eq('id', imageId);
      
      setProducts(prev => prev.map(p => 
        p.id === productId 
          ? { ...p, images: p.images?.filter(img => img.id !== imageId) }
          : p
      ));
      
      if (editingProduct?.id === productId) {
        setEditingProduct(prev => prev ? {
          ...prev,
          images: prev.images?.filter(img => img.id !== imageId)
        } : null);
      }
      
      toast.success('Image deleted');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductDescription(product.description || '');
    setProductPrice(String(product.price));
    setProductStock(String(product.stock_quantity));
    setProductCondition(product.condition);
    setProductBrand(product.brand || '');
    setProductImages([]);
    setEditDialogOpen(true);
  };

  const resetProductForm = () => {
    setProductName('');
    setProductDescription('');
    setProductPrice('');
    setProductStock('');
    setProductCondition('new');
    setProductBrand('');
    setProductImages([]);
    setEditingProduct(null);
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
              <Dialog open={storeDialogOpen} onOpenChange={setStoreDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Store
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Your Store</DialogTitle>
                    <DialogDescription>
                      Enter the details for your new store. You can update these later.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="storeName">Store Name *</Label>
                      <Input
                        id="storeName"
                        placeholder="Enter your store name"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storeDescription">Description (optional)</Label>
                      <Textarea
                        id="storeDescription"
                        placeholder="Describe your store..."
                        value={storeDescription}
                        onChange={(e) => setStoreDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleCreateStore}
                      disabled={creating}
                    >
                      {creating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Store'
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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

        {/* Low Stock Alerts */}
        {(() => {
          const LOW_STOCK_THRESHOLD = 10;
          const lowStockProducts = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= LOW_STOCK_THRESHOLD);
          const outOfStockProducts = products.filter(p => p.stock_quantity === 0);
          
          if (lowStockProducts.length === 0 && outOfStockProducts.length === 0) return null;
          
          return (
            <div className="space-y-3 mb-6">
              {outOfStockProducts.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Out of Stock Alert</AlertTitle>
                  <AlertDescription>
                    {outOfStockProducts.length} product{outOfStockProducts.length > 1 ? 's are' : ' is'} out of stock: {' '}
                    <span className="font-medium">
                      {outOfStockProducts.map(p => p.name).join(', ')}
                    </span>
                  </AlertDescription>
                </Alert>
              )}
              {lowStockProducts.length > 0 && (
                <Alert className="border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <AlertTitle>Low Stock Warning</AlertTitle>
                  <AlertDescription>
                    {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's have' : ' has'} low stock (≤{LOW_STOCK_THRESHOLD} units): {' '}
                    <span className="font-medium">
                      {lowStockProducts.map(p => `${p.name} (${p.stock_quantity})`).join(', ')}
                    </span>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          );
        })()}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">From all orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">Order items sold</p>
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
              <p className="text-xs text-muted-foreground mt-1">Per order item</p>
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
                  <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>
                          Enter the details for your new product.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
                        <div className="space-y-2">
                          <Label htmlFor="productName">Product Name *</Label>
                          <Input
                            id="productName"
                            placeholder="Enter product name"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="productDescription">Description</Label>
                          <Textarea
                            id="productDescription"
                            placeholder="Describe your product..."
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="productPrice">Price ($) *</Label>
                            <Input
                              id="productPrice"
                              type="number"
                              placeholder="0.00"
                              value={productPrice}
                              onChange={(e) => setProductPrice(e.target.value)}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="productStock">Stock Quantity</Label>
                            <Input
                              id="productStock"
                              type="number"
                              placeholder="0"
                              value={productStock}
                              onChange={(e) => setProductStock(e.target.value)}
                              min="0"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="productBrand">Brand</Label>
                          <Input
                            id="productBrand"
                            placeholder="Enter brand name"
                            value={productBrand}
                            onChange={(e) => setProductBrand(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="productCondition">Condition</Label>
                          <Select value={productCondition} onValueChange={(v: 'new' | 'used' | 'refurbished') => setProductCondition(v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="used">Used</SelectItem>
                              <SelectItem value="refurbished">Refurbished</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Image Upload */}
                        <div className="space-y-2">
                          <Label>Product Images (max 5)</Label>
                          <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                              isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                            }`}
                          >
                            <input {...getInputProps()} />
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {isDragActive ? 'Drop images here' : 'Drag & drop images or click to select'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP up to 5MB</p>
                          </div>
                          {productImages.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {productImages.map((file, index) => (
                                <div key={index} className="relative w-16 h-16">
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index}`}
                                    className="w-full h-full object-cover rounded"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          className="w-full" 
                          onClick={handleCreateProduct}
                          disabled={creatingProduct || uploadingImages}
                        >
                          {creatingProduct || uploadingImages ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              {uploadingImages ? 'Uploading...' : 'Adding...'}
                            </>
                          ) : (
                            'Add Product'
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {products.length > 0 ? (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        {/* Product Image */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0].image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Stock: {product.stock_quantity} • ${Number(product.price).toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded ${product.is_active ? 'bg-emerald-500/20 text-emerald-600' : 'bg-red-500/20 text-red-600'}`}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={deletingProductId === product.id}
                                >
                                  {deletingProductId === product.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    'Delete'
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) resetProductForm();
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details for this product.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="editProductName">Product Name *</Label>
              <Input
                id="editProductName"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editProductDescription">Description</Label>
              <Textarea
                id="editProductDescription"
                placeholder="Describe your product..."
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editProductPrice">Price ($) *</Label>
                <Input
                  id="editProductPrice"
                  type="number"
                  placeholder="0.00"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editProductStock">Stock Quantity</Label>
                <Input
                  id="editProductStock"
                  type="number"
                  placeholder="0"
                  value={productStock}
                  onChange={(e) => setProductStock(e.target.value)}
                  min="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editProductBrand">Brand</Label>
              <Input
                id="editProductBrand"
                placeholder="Enter brand name"
                value={productBrand}
                onChange={(e) => setProductBrand(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editProductCondition">Condition</Label>
              <Select value={productCondition} onValueChange={(v: 'new' | 'used' | 'refurbished') => setProductCondition(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="refurbished">Refurbished</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Existing Images */}
            {editingProduct?.images && editingProduct.images.length > 0 && (
              <div className="space-y-2">
                <Label>Existing Images</Label>
                <div className="flex flex-wrap gap-2">
                  {editingProduct.images.map((img) => (
                    <div key={img.id} className="relative w-16 h-16">
                      <img
                        src={img.image_url}
                        alt="Product"
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteProductImage(img.id, img.image_url, editingProduct.id)}
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {img.is_primary && (
                        <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-[10px] text-center">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Add More Images */}
            <div className="space-y-2">
              <Label>Add More Images</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive ? 'Drop images here' : 'Drag & drop images or click to select'}
                </p>
              </div>
              {productImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {productImages.map((file, index) => (
                    <div key={index} className="relative w-16 h-16">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleEditProduct}
              disabled={creatingProduct || uploadingImages}
            >
              {creatingProduct || uploadingImages ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {uploadingImages ? 'Uploading...' : 'Updating...'}
                </>
              ) : (
                'Update Product'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
      <Footer />
    </div>
  );
}
