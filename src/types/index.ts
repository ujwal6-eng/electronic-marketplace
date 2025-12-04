export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  brand: string;
  condition: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  description?: string;
  specs?: Record<string, string>;
  seller: {
    name: string;
    rating: number;
    totalSales: number;
  };
}

export interface Technician {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  specializations: string[];
  serviceArea: string;
  hourlyRate: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface ForumCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  post_count?: number;
}