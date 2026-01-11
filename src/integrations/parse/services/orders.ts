// Order Service - Parse Operations
import Parse from '../client';
import type { Order, OrderItem, ShippingAddress } from '../types';

const parseObjectToOrder = (obj: Parse.Object): Order => ({
  id: obj.id,
  userId: obj.get('userId'),
  shippingAddressId: obj.get('shippingAddressId'),
  status: obj.get('status') || 'pending',
  subtotal: obj.get('subtotal') || 0,
  shippingCost: obj.get('shippingCost') || 0,
  tax: obj.get('tax') || 0,
  total: obj.get('total') || 0,
  paymentStatus: obj.get('paymentStatus') || 'pending',
  notes: obj.get('notes'),
  createdAt: obj.get('createdAt'),
  updatedAt: obj.get('updatedAt'),
});

const parseObjectToOrderItem = (obj: Parse.Object): OrderItem => ({
  id: obj.id,
  orderId: obj.get('orderId'),
  productId: obj.get('productId'),
  storeId: obj.get('storeId'),
  quantity: obj.get('quantity'),
  price: obj.get('price'),
  subtotal: obj.get('subtotal'),
  createdAt: obj.get('createdAt'),
});

export const orderService = {
  // Get orders by user
  async getOrdersByUser(userId: string): Promise<Order[]> {
    const Order = Parse.Object.extend('Order');
    const query = new Parse.Query(Order);
    query.equalTo('userId', userId);
    query.descending('createdAt');
    
    const results = await query.find();
    const orders = await Promise.all(results.map(async (o) => {
      const order = parseObjectToOrder(o);
      order.items = await this.getOrderItems(o.id);
      return order;
    }));
    
    return orders;
  },

  // Get order by ID
  async getOrderById(orderId: string): Promise<Order | null> {
    const Order = Parse.Object.extend('Order');
    const query = new Parse.Query(Order);
    
    try {
      const result = await query.get(orderId);
      const order = parseObjectToOrder(result);
      order.items = await this.getOrderItems(orderId);
      
      // Fetch shipping address if exists
      if (order.shippingAddressId) {
        order.shippingAddress = await this.getShippingAddress(order.shippingAddressId);
      }
      
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  },

  // Get order items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const OrderItem = Parse.Object.extend('OrderItem');
    const query = new Parse.Query(OrderItem);
    query.equalTo('orderId', orderId);
    
    const results = await query.find();
    return results.map(parseObjectToOrderItem);
  },

  // Get shipping address
  async getShippingAddress(addressId: string): Promise<ShippingAddress | null> {
    const ShippingAddress = Parse.Object.extend('ShippingAddress');
    const query = new Parse.Query(ShippingAddress);
    
    try {
      const result = await query.get(addressId);
      return {
        id: result.id,
        userId: result.get('userId'),
        fullName: result.get('fullName'),
        phone: result.get('phone'),
        addressLine1: result.get('addressLine1'),
        addressLine2: result.get('addressLine2'),
        city: result.get('city'),
        state: result.get('state'),
        postalCode: result.get('postalCode'),
        country: result.get('country'),
        isDefault: result.get('isDefault'),
        createdAt: result.get('createdAt'),
        updatedAt: result.get('updatedAt'),
      };
    } catch (error) {
      return null;
    }
  },

  // Create order
  async createOrder(orderData: {
    userId: string;
    items: { productId: string; storeId: string; quantity: number; price: number }[];
    shippingAddressId?: string;
    notes?: string;
  }): Promise<Order> {
    // Calculate totals
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shippingCost + tax;

    // Create order
    const Order = Parse.Object.extend('Order');
    const order = new Order();
    
    order.set('userId', orderData.userId);
    order.set('shippingAddressId', orderData.shippingAddressId);
    order.set('status', 'pending');
    order.set('subtotal', subtotal);
    order.set('shippingCost', shippingCost);
    order.set('tax', tax);
    order.set('total', total);
    order.set('paymentStatus', 'pending');
    order.set('notes', orderData.notes);
    
    const savedOrder = await order.save();

    // Create order items
    const OrderItem = Parse.Object.extend('OrderItem');
    await Promise.all(orderData.items.map(async (item) => {
      const orderItem = new OrderItem();
      orderItem.set('orderId', savedOrder.id);
      orderItem.set('productId', item.productId);
      orderItem.set('storeId', item.storeId);
      orderItem.set('quantity', item.quantity);
      orderItem.set('price', item.price);
      orderItem.set('subtotal', item.price * item.quantity);
      await orderItem.save();
    }));

    return parseObjectToOrder(savedOrder);
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    const Order = Parse.Object.extend('Order');
    const query = new Parse.Query(Order);
    const order = await query.get(orderId);
    
    order.set('status', status);
    const saved = await order.save();
    
    return parseObjectToOrder(saved);
  },

  // Get all orders (admin)
  async getAllOrders(): Promise<Order[]> {
    const Order = Parse.Object.extend('Order');
    const query = new Parse.Query(Order);
    query.descending('createdAt');
    
    const results = await query.find();
    return results.map(parseObjectToOrder);
  },

  // Get orders by store
  async getOrdersByStore(storeId: string): Promise<Order[]> {
    // First get order items for this store
    const OrderItem = Parse.Object.extend('OrderItem');
    const itemQuery = new Parse.Query(OrderItem);
    itemQuery.equalTo('storeId', storeId);
    
    const items = await itemQuery.find();
    const orderIds = [...new Set(items.map(i => i.get('orderId')))];
    
    if (orderIds.length === 0) return [];
    
    // Get those orders
    const Order = Parse.Object.extend('Order');
    const orderQuery = new Parse.Query(Order);
    orderQuery.containedIn('objectId', orderIds);
    orderQuery.descending('createdAt');
    
    const results = await orderQuery.find();
    return results.map(parseObjectToOrder);
  },

  // Create shipping address
  async createShippingAddress(addressData: Partial<ShippingAddress>): Promise<ShippingAddress> {
    const ShippingAddress = Parse.Object.extend('ShippingAddress');
    const address = new ShippingAddress();
    
    address.set('userId', addressData.userId);
    address.set('fullName', addressData.fullName);
    address.set('phone', addressData.phone);
    address.set('addressLine1', addressData.addressLine1);
    address.set('addressLine2', addressData.addressLine2);
    address.set('city', addressData.city);
    address.set('state', addressData.state);
    address.set('postalCode', addressData.postalCode);
    address.set('country', addressData.country || 'US');
    address.set('isDefault', addressData.isDefault || false);
    
    const saved = await address.save();
    
    return {
      id: saved.id,
      userId: saved.get('userId'),
      fullName: saved.get('fullName'),
      phone: saved.get('phone'),
      addressLine1: saved.get('addressLine1'),
      addressLine2: saved.get('addressLine2'),
      city: saved.get('city'),
      state: saved.get('state'),
      postalCode: saved.get('postalCode'),
      country: saved.get('country'),
      isDefault: saved.get('isDefault'),
      createdAt: saved.get('createdAt'),
      updatedAt: saved.get('updatedAt'),
    };
  },

  // Get user shipping addresses
  async getUserShippingAddresses(userId: string): Promise<ShippingAddress[]> {
    const ShippingAddress = Parse.Object.extend('ShippingAddress');
    const query = new Parse.Query(ShippingAddress);
    query.equalTo('userId', userId);
    
    const results = await query.find();
    return results.map(addr => ({
      id: addr.id,
      userId: addr.get('userId'),
      fullName: addr.get('fullName'),
      phone: addr.get('phone'),
      addressLine1: addr.get('addressLine1'),
      addressLine2: addr.get('addressLine2'),
      city: addr.get('city'),
      state: addr.get('state'),
      postalCode: addr.get('postalCode'),
      country: addr.get('country'),
      isDefault: addr.get('isDefault'),
      createdAt: addr.get('createdAt'),
      updatedAt: addr.get('updatedAt'),
    }));
  },

  // Get seller stats
  async getSellerStats(storeId: string): Promise<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
  }> {
    const orders = await this.getOrdersByStore(storeId);
    
    return {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
      pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'processing').length,
      completedOrders: orders.filter(o => o.status === 'delivered').length,
    };
  },
};
