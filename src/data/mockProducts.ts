export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  brand: string;
  condition: 'new' | 'used' | 'refurbished';
  rating: number;
  reviews: number;
  inStock: boolean;
  seller: {
    name: string;
    rating: number;
    totalSales: number;
  };
  specs?: Record<string, string>;
  description?: string;
}

export const categories = [
  { id: 'smartphones', name: 'Smartphones', icon: 'Smartphone' },
  { id: 'laptops', name: 'Laptops', icon: 'Laptop' },
  { id: 'tablets', name: 'Tablets', icon: 'Tablet' },
  { id: 'accessories', name: 'Accessories', icon: 'Headphones' },
  { id: 'wearables', name: 'Wearables', icon: 'Watch' },
  { id: 'gaming', name: 'Gaming', icon: 'Gamepad2' },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 1199,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1696446702738-ad1208aa4572?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1696446702738-ad1208aa4572?w=800&q=80',
      'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=800&q=80',
    ],
    category: 'smartphones',
    brand: 'Apple',
    condition: 'new',
    rating: 4.8,
    reviews: 234,
    inStock: true,
    seller: { name: 'TechStore Pro', rating: 4.9, totalSales: 1240 },
    specs: {
      'Screen Size': '6.7"',
      'Processor': 'A17 Pro',
      'RAM': '8GB',
      'Storage': '256GB',
      'Camera': '48MP Triple',
    },
    description: 'The latest iPhone with titanium design and powerful A17 Pro chip.',
  },
  {
    id: '2',
    name: 'MacBook Pro 16"',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
    category: 'laptops',
    brand: 'Apple',
    condition: 'new',
    rating: 4.9,
    reviews: 189,
    inStock: true,
    seller: { name: 'ElectroHub', rating: 4.8, totalSales: 890 },
    specs: {
      'Screen': '16.2" Retina',
      'Processor': 'M3 Pro',
      'RAM': '18GB',
      'Storage': '512GB SSD',
    },
  },
  {
    id: '3',
    name: 'Samsung Galaxy S24 Ultra',
    price: 1099,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80',
    category: 'smartphones',
    brand: 'Samsung',
    condition: 'new',
    rating: 4.7,
    reviews: 156,
    inStock: true,
    seller: { name: 'GadgetWorld', rating: 4.7, totalSales: 650 },
  },
  {
    id: '4',
    name: 'AirPods Pro (2nd Gen)',
    price: 249,
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500&q=80',
    category: 'accessories',
    brand: 'Apple',
    condition: 'new',
    rating: 4.6,
    reviews: 423,
    inStock: true,
    seller: { name: 'TechStore Pro', rating: 4.9, totalSales: 1240 },
  },
  {
    id: '5',
    name: 'Dell XPS 15',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80',
    category: 'laptops',
    brand: 'Dell',
    condition: 'refurbished',
    rating: 4.5,
    reviews: 78,
    inStock: true,
    seller: { name: 'RefurbTech', rating: 4.6, totalSales: 340 },
  },
  {
    id: '6',
    name: 'iPad Pro 12.9"',
    price: 1099,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80',
    category: 'tablets',
    brand: 'Apple',
    condition: 'new',
    rating: 4.8,
    reviews: 201,
    inStock: true,
    seller: { name: 'ElectroHub', rating: 4.8, totalSales: 890 },
  },
  {
    id: '7',
    name: 'Sony WH-1000XM5',
    price: 399,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80',
    category: 'accessories',
    brand: 'Sony',
    condition: 'new',
    rating: 4.9,
    reviews: 512,
    inStock: true,
    seller: { name: 'AudioMax', rating: 4.9, totalSales: 780 },
  },
  {
    id: '8',
    name: 'Apple Watch Series 9',
    price: 429,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80',
    category: 'wearables',
    brand: 'Apple',
    condition: 'new',
    rating: 4.7,
    reviews: 289,
    inStock: true,
    seller: { name: 'TechStore Pro', rating: 4.9, totalSales: 1240 },
  },
];
