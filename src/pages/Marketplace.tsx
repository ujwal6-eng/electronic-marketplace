import { useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { ProductCard } from '@/components/ProductCard';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, Grid3x3, List, X } from 'lucide-react';
import { mockProducts, categories } from '@/data/mockProducts';
import { useSearchParams } from 'react-router-dom';

export default function Marketplace() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const brands = [...new Set(mockProducts.map(p => p.brand))];
  const conditions = ['new', 'used', 'refurbished'];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesCondition = selectedConditions.length === 0 || selectedConditions.includes(product.condition);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    
    return matchesSearch && matchesPrice && matchesBrand && matchesCondition && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'newest': return 0;
      default: return b.reviews - a.reviews;
    }
  });

  const toggleFilter = (value: string, current: string[], setter: (val: string[]) => void) => {
    setter(current.includes(value) ? current.filter(v => v !== value) : [...current, value]);
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedConditions([]);
    setSelectedCategories([]);
    setPriceRange([0, 3000]);
  };

  const activeFiltersCount = selectedBrands.length + selectedConditions.length + selectedCategories.length;

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3 text-foreground">Categories</h3>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedCategories.includes(cat.id)}
                onCheckedChange={() => toggleFilter(cat.id, selectedCategories, setSelectedCategories)}
              />
              <span className="text-sm text-foreground">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-foreground">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={3000}
          step={50}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-foreground">Brand</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map(brand => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleFilter(brand, selectedBrands, setSelectedBrands)}
              />
              <span className="text-sm text-foreground">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-foreground">Condition</h3>
        <div className="space-y-2">
          {conditions.map(condition => (
            <label key={condition} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedConditions.includes(condition)}
                onCheckedChange={() => toggleFilter(condition, selectedConditions, setSelectedConditions)}
              />
              <span className="text-sm text-foreground capitalize">{condition}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <SearchBar />

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1">{activeFiltersCount}</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>

            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                <X className="w-4 h-4" />
                Clear all
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1 border border-border rounded-md p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {sortedProducts.length} products found
        </div>

        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'flex flex-col gap-4'
        }>
          {sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found. Try adjusting your filters.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
