import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, Star, Heart, Share2, ChevronLeft, Minus, Plus, Store } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { ProductCard } from '@/components/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function ProductDetails() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(image_url, is_primary, alt_text),
          product_specifications(spec_key, spec_value),
          stores(name, rating, total_reviews)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      const images = data.product_images?.map((img: any) => img.image_url) || ['/placeholder.svg'];
      const specs = data.product_specifications?.reduce((acc: Record<string, string>, spec: any) => {
        acc[spec.spec_key] = spec.spec_value;
        return acc;
      }, {}) || {};

      return {
        id: data.id,
        name: data.name,
        price: Number(data.price),
        originalPrice: data.discount_price ? Number(data.price) : undefined,
        image: images[0],
        images,
        category: data.brand || 'Electronics',
        brand: data.brand || 'Unknown',
        condition: data.condition,
        rating: Number(data.rating) || 0,
        reviews: data.total_reviews || 0,
        inStock: data.stock_quantity > 0,
        description: data.description,
        specs,
        seller: {
          name: data.stores?.name || 'Unknown Seller',
          rating: Number(data.stores?.rating) || 0,
          totalSales: data.stores?.total_reviews || 0
        }
      };
    },
    enabled: !!id
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ['related-products', product?.category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(image_url, is_primary),
          stores(name, rating)
        `)
        .eq('is_active', true)
        .neq('id', id)
        .limit(4);
      
      if (error) throw error;
      return data?.map(p => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        image: p.product_images?.find((img: any) => img.is_primary)?.image_url || p.product_images?.[0]?.image_url || '/placeholder.svg',
        category: p.brand || 'Electronics',
        brand: p.brand || 'Unknown',
        condition: p.condition,
        rating: Number(p.rating) || 0,
        reviews: p.total_reviews || 0,
        inStock: p.stock_quantity > 0,
        seller: {
          name: p.stores?.name || 'Unknown Seller',
          rating: Number(p.stores?.rating) || 0,
          totalSales: 0
        }
      })) || [];
    },
    enabled: !!product
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <div className="container mx-auto px-4 py-6 space-y-8">
          <Skeleton className="h-10 w-40" />
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      seller: product.seller.name,
    }, quantity);
    toast({
      title: 'Added to cart',
      description: `${quantity}x ${product.name} added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        <Link to="/marketplace">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Marketplace
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted border border-border">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-violet-500' : 'border-border'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">{product.category}</Badge>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-foreground">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviews} reviews)</span>
                </div>
                <Badge className={product.inStock ? 'bg-emerald-500' : 'bg-rose-500'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-foreground">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                    <Badge variant="destructive">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  </>
                )}
              </div>
              <Badge variant="outline" className="capitalize">{product.condition}</Badge>
            </div>

            {product.description && (
              <p className="text-muted-foreground">{product.description}</p>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Seller Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{product.seller.name}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{product.seller.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.seller.totalSales} sales
                </p>
              </CardContent>
            </Card>

            {product.specs && Object.keys(product.specs).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-border last:border-0">
                        <dt className="font-medium text-muted-foreground">{key}</dt>
                        <dd className="text-foreground">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-foreground">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!product.inStock}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold text-foreground">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!product.inStock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
}