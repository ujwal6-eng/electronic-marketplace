// Store Service - Parse Operations
import Parse from '../client';
import type { Store } from '../types';

const parseObjectToStore = (obj: Parse.Object): Store => ({
  id: obj.id,
  ownerId: obj.get('ownerId'),
  name: obj.get('name'),
  slug: obj.get('slug'),
  description: obj.get('description'),
  logoUrl: obj.get('logoUrl'),
  bannerUrl: obj.get('bannerUrl'),
  rating: obj.get('rating') || 0,
  totalReviews: obj.get('totalReviews') || 0,
  verified: obj.get('verified') || false,
  createdAt: obj.get('createdAt'),
  updatedAt: obj.get('updatedAt'),
});

export const storeService = {
  // Get store by owner ID
  async getStoreByOwner(ownerId: string): Promise<Store | null> {
    const Store = Parse.Object.extend('Store');
    const query = new Parse.Query(Store);
    query.equalTo('ownerId', ownerId);
    
    const result = await query.first();
    return result ? parseObjectToStore(result) : null;
  },

  // Get store by ID
  async getStoreById(storeId: string): Promise<Store | null> {
    const Store = Parse.Object.extend('Store');
    const query = new Parse.Query(Store);
    
    try {
      const result = await query.get(storeId);
      return parseObjectToStore(result);
    } catch (error) {
      console.error('Error fetching store:', error);
      return null;
    }
  },

  // Get all stores
  async getAllStores(): Promise<Store[]> {
    const Store = Parse.Object.extend('Store');
    const query = new Parse.Query(Store);
    query.descending('createdAt');
    
    const results = await query.find();
    return results.map(parseObjectToStore);
  },

  // Create store
  async createStore(storeData: Partial<Store>): Promise<Store> {
    const Store = Parse.Object.extend('Store');
    const store = new Store();
    
    store.set('ownerId', storeData.ownerId);
    store.set('name', storeData.name);
    store.set('slug', storeData.name?.toLowerCase().replace(/\s+/g, '-'));
    store.set('description', storeData.description);
    store.set('logoUrl', storeData.logoUrl);
    store.set('bannerUrl', storeData.bannerUrl);
    store.set('rating', 0);
    store.set('totalReviews', 0);
    store.set('verified', false);
    
    const saved = await store.save();
    return parseObjectToStore(saved);
  },

  // Update store
  async updateStore(storeId: string, updates: Partial<Store>): Promise<Store> {
    const Store = Parse.Object.extend('Store');
    const query = new Parse.Query(Store);
    const store = await query.get(storeId);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        store.set(key, value);
      }
    });
    
    const saved = await store.save();
    return parseObjectToStore(saved);
  },

  // Delete store
  async deleteStore(storeId: string): Promise<void> {
    const Store = Parse.Object.extend('Store');
    const query = new Parse.Query(Store);
    const store = await query.get(storeId);
    await store.destroy();
  },
};
