import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Product } from '@/data/mockProducts';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      seller: product.seller.name,
    }, 1);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div className="group relative bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
          {product.originalPrice && (
            <Badge className="absolute top-2 left-2 bg-rose-500 text-white">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
        
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-violet-500 transition-colors">
              {product.name}
            </h3>
          </div>
          
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <Badge variant="secondary" className="text-xs">
            {product.condition}
          </Badge>

          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full mt-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};
