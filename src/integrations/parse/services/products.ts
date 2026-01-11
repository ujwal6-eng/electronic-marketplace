// Product Service - Parse Operations
import Parse from '../client';
import type { Product, ProductImage, ProductCategory } from '../types';

// Helper to convert Parse Object to typed object
const parseObjectToProduct = (obj: Parse.Object, includeRelations = false): Product => {
  const product: Product = {
    id: obj.id,
    storeId: obj.get('storeId'),
    categoryId: obj.get('categoryId'),
    name: obj.get('name'),
    slug: obj.get('slug'),
    description: obj.get('description'),
    sku: obj.get('sku'),
    brand: obj.get('brand'),
    model: obj.get('model'),
    price: obj.get('price'),
    discountPrice: obj.get('discountPrice'),
    condition: obj.get('condition') || 'new',
    stockQuantity: obj.get('stockQuantity') || 0,
    rating: obj.get('rating') || 0,
    totalReviews: obj.get('totalReviews') || 0,
    isActive: obj.get('isActive') !== false,
    createdAt: obj.get('createdAt'),
    updatedAt: obj.get('updatedAt'),
  };

  if (includeRelations) {
    const store = obj.get('store');
    if (store) {
      product.store = {
        id: store.id,
        ownerId: store.get('ownerId'),
        name: store.get('name'),
        slug: store.get('slug'),
        rating: store.get('rating') || 0,
        totalReviews: store.get('totalReviews') || 0,
        verified: store.get('verified') || false,
        createdAt: store.get('createdAt'),
        updatedAt: store.get('updatedAt'),
      };
    }
    const images = obj.get('images');
    if (images) {
      product.images = images.map((img: Parse.Object) => ({
        id: img.id,
        productId: img.get('productId'),
        imageUrl: img.get('imageUrl'),
        altText: img.get('altText'),
        displayOrder: img.get('displayOrder') || 0,
        isPrimary: img.get('isPrimary') || false,
        createdAt: img.get('createdAt'),
      }));
    }
  }

  return product;
};

export const productService = {
  // Get all active products
  async getActiveProducts(limit = 50): Promise<Product[]> {
    const Product = Parse.Object.extend('Product');
    const query = new Parse.Query(Product);
    query.equalTo('isActive', true);
    query.limit(limit);
    query.descending('createdAt');
    
    const results = await query.find();
    
    // Fetch images for each product
    const products = await Promise.all(results.map(async (p) => {
      const product = parseObjectToProduct(p);
      product.images = await this.getProductImages(p.id);
      return product;
    }));
    
    return products;
  },

  // Get featured products
  async getFeaturedProducts(limit = 6): Promise<Product[]> {
    return this.getActiveProducts(limit);
  },

  // Get product by ID
  async getProductById(productId: string): Promise<Product | null> {
    const Product = Parse.Object.extend('Product');
    const query = new Parse.Query(Product);
    
    try {
      const result = await query.get(productId);
      const product = parseObjectToProduct(result);
      product.images = await this.getProductImages(productId);
      
      // Fetch store info
      const Store = Parse.Object.extend('Store');
      const storeQuery = new Parse.Query(Store);
      const store = await storeQuery.get(product.storeId);
      if (store) {
        product.store = {
          id: store.id,
          ownerId: store.get('ownerId'),
          name: store.get('name'),
          slug: store.get('slug'),
          description: store.get('description'),
          logoUrl: store.get('logoUrl'),
          bannerUrl: store.get('bannerUrl'),
          rating: store.get('rating') || 0,
          totalReviews: store.get('totalReviews') || 0,
          verified: store.get('verified') || false,
          createdAt: store.get('createdAt'),
          updatedAt: store.get('updatedAt'),
        };
      }
      
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Get product images
  async getProductImages(productId: string): Promise<ProductImage[]> {
    const ProductImage = Parse.Object.extend('ProductImage');
    const query = new Parse.Query(ProductImage);
    query.equalTo('productId', productId);
    query.ascending('displayOrder');
    
    const results = await query.find();
    return results.map(img => ({
      id: img.id,
      productId: img.get('productId'),
      imageUrl: img.get('imageUrl'),
      altText: img.get('altText'),
      displayOrder: img.get('displayOrder') || 0,
      isPrimary: img.get('isPrimary') || false,
      createdAt: img.get('createdAt'),
    }));
  },

  // Get products by store
  async getProductsByStore(storeId: string): Promise<Product[]> {
    const Product = Parse.Object.extend('Product');
    const query = new Parse.Query(Product);
    query.equalTo('storeId', storeId);
    query.descending('createdAt');
    
    const results = await query.find();
    const products = await Promise.all(results.map(async (p) => {
      const product = parseObjectToProduct(p);
      product.images = await this.getProductImages(p.id);
      return product;
    }));
    
    return products;
  },

  // Create product
  async createProduct(productData: Partial<Product>): Promise<Product> {
    const Product = Parse.Object.extend('Product');
    const product = new Product();
    
    product.set('storeId', productData.storeId);
    product.set('categoryId', productData.categoryId);
    product.set('name', productData.name);
    product.set('slug', productData.name?.toLowerCase().replace(/\s+/g, '-'));
    product.set('description', productData.description);
    product.set('sku', productData.sku);
    product.set('brand', productData.brand);
    product.set('model', productData.model);
    product.set('price', productData.price);
    product.set('discountPrice', productData.discountPrice);
    product.set('condition', productData.condition || 'new');
    product.set('stockQuantity', productData.stockQuantity || 0);
    product.set('rating', 0);
    product.set('totalReviews', 0);
    product.set('isActive', true);
    
    const saved = await product.save();
    return parseObjectToProduct(saved);
  },

  // Update product
  async updateProduct(productId: string, updates: Partial<Product>): Promise<Product> {
    const Product = Parse.Object.extend('Product');
    const query = new Parse.Query(Product);
    const product = await query.get(productId);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        product.set(key, value);
      }
    });
    
    const saved = await product.save();
    return parseObjectToProduct(saved);
  },

  // Delete product
  async deleteProduct(productId: string): Promise<void> {
    const Product = Parse.Object.extend('Product');
    const query = new Parse.Query(Product);
    const product = await query.get(productId);
    await product.destroy();
  },

  // Add product image
  async addProductImage(productId: string, imageUrl: string, isPrimary = false): Promise<ProductImage> {
    const ProductImage = Parse.Object.extend('ProductImage');
    const image = new ProductImage();
    
    // Get current max display order
    const query = new Parse.Query(ProductImage);
    query.equalTo('productId', productId);
    query.descending('displayOrder');
    const existing = await query.first();
    const nextOrder = existing ? (existing.get('displayOrder') || 0) + 1 : 0;
    
    image.set('productId', productId);
    image.set('imageUrl', imageUrl);
    image.set('displayOrder', nextOrder);
    image.set('isPrimary', isPrimary);
    
    const saved = await image.save();
    return {
      id: saved.id,
      productId: saved.get('productId'),
      imageUrl: saved.get('imageUrl'),
      altText: saved.get('altText'),
      displayOrder: saved.get('displayOrder'),
      isPrimary: saved.get('isPrimary'),
      createdAt: saved.get('createdAt'),
    };
  },

  // Delete product image
  async deleteProductImage(imageId: string): Promise<void> {
    const ProductImage = Parse.Object.extend('ProductImage');
    const query = new Parse.Query(ProductImage);
    const image = await query.get(imageId);
    await image.destroy();
  },

  // Get product categories
  async getCategories(): Promise<ProductCategory[]> {
    const ProductCategory = Parse.Object.extend('ProductCategory');
    const query = new Parse.Query(ProductCategory);
    query.ascending('name');
    
    const results = await query.find();
    return results.map(cat => ({
      id: cat.id,
      parentId: cat.get('parentId'),
      name: cat.get('name'),
      slug: cat.get('slug'),
      description: cat.get('description'),
      imageUrl: cat.get('imageUrl'),
      createdAt: cat.get('createdAt'),
      updatedAt: cat.get('updatedAt'),
    }));
  },

  // Search products
  async searchProducts(searchTerm: string, filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    brand?: string;
  }): Promise<Product[]> {
    const Product = Parse.Object.extend('Product');
    const query = new Parse.Query(Product);
    
    query.equalTo('isActive', true);
    
    if (searchTerm) {
      query.contains('name', searchTerm);
    }
    
    if (filters?.category) {
      query.equalTo('categoryId', filters.category);
    }
    
    if (filters?.minPrice !== undefined) {
      query.greaterThanOrEqualTo('price', filters.minPrice);
    }
    
    if (filters?.maxPrice !== undefined) {
      query.lessThanOrEqualTo('price', filters.maxPrice);
    }
    
    if (filters?.condition) {
      query.equalTo('condition', filters.condition);
    }
    
    if (filters?.brand) {
      query.equalTo('brand', filters.brand);
    }
    
    const results = await query.find();
    const products = await Promise.all(results.map(async (p) => {
      const product = parseObjectToProduct(p);
      product.images = await this.getProductImages(p.id);
      return product;
    }));
    
    return products;
  },

  // Get platform stats
  async getPlatformStats(): Promise<{ products: number; technicians: number; users: number }> {
    const [productsCount, techniciansCount, usersCount] = await Promise.all([
      new Parse.Query(Parse.Object.extend('Product')).count(),
      new Parse.Query(Parse.Object.extend('TechnicianProfile')).count(),
      new Parse.Query(Parse.Object.extend('Profile')).count(),
    ]);
    
    return {
      products: productsCount,
      technicians: techniciansCount,
      users: usersCount,
    };
  },
};
