// Service Booking Service - Parse Operations
import Parse from '../client';
import type { ServiceBooking, ServiceCategory, TechnicianProfile } from '../types';

const parseObjectToBooking = (obj: Parse.Object): ServiceBooking => ({
  id: obj.id,
  userId: obj.get('userId'),
  technicianId: obj.get('technicianId'),
  categoryId: obj.get('categoryId'),
  deviceType: obj.get('deviceType'),
  deviceBrand: obj.get('deviceBrand'),
  deviceModel: obj.get('deviceModel'),
  issueDescription: obj.get('issueDescription'),
  serviceLocation: obj.get('serviceLocation'),
  status: obj.get('status') || 'pending',
  scheduledDate: obj.get('scheduledDate'),
  completedDate: obj.get('completedDate'),
  estimatedCost: obj.get('estimatedCost'),
  finalCost: obj.get('finalCost'),
  notes: obj.get('notes'),
  createdAt: obj.get('createdAt'),
  updatedAt: obj.get('updatedAt'),
});

const parseObjectToTechnician = (obj: Parse.Object): TechnicianProfile => ({
  id: obj.id,
  userId: obj.get('userId'),
  bio: obj.get('bio'),
  certifications: obj.get('certifications'),
  serviceArea: obj.get('serviceArea'),
  experienceYears: obj.get('experienceYears') || 0,
  hourlyRate: obj.get('hourlyRate'),
  rating: obj.get('rating') || 0,
  totalReviews: obj.get('totalReviews') || 0,
  totalJobs: obj.get('totalJobs') || 0,
  verified: obj.get('verified') || 'pending',
  available: obj.get('available') !== false,
  createdAt: obj.get('createdAt'),
  updatedAt: obj.get('updatedAt'),
});

export const serviceBookingService = {
  // Get service categories
  async getServiceCategories(): Promise<ServiceCategory[]> {
    const ServiceCategory = Parse.Object.extend('ServiceCategory');
    const query = new Parse.Query(ServiceCategory);
    query.ascending('name');
    
    const results = await query.find();
    return results.map(cat => ({
      id: cat.id,
      name: cat.get('name'),
      slug: cat.get('slug'),
      description: cat.get('description'),
      icon: cat.get('icon'),
      createdAt: cat.get('createdAt'),
    }));
  },

  // Get available technicians
  async getAvailableTechnicians(): Promise<TechnicianProfile[]> {
    const TechnicianProfile = Parse.Object.extend('TechnicianProfile');
    const query = new Parse.Query(TechnicianProfile);
    query.equalTo('available', true);
    query.equalTo('verified', 'verified');
    
    const results = await query.find();
    return results.map(parseObjectToTechnician);
  },

  // Get technician by ID
  async getTechnicianById(technicianId: string): Promise<TechnicianProfile | null> {
    const TechnicianProfile = Parse.Object.extend('TechnicianProfile');
    const query = new Parse.Query(TechnicianProfile);
    
    try {
      const result = await query.get(technicianId);
      return parseObjectToTechnician(result);
    } catch (error) {
      return null;
    }
  },

  // Get technician by user ID
  async getTechnicianByUserId(userId: string): Promise<TechnicianProfile | null> {
    const TechnicianProfile = Parse.Object.extend('TechnicianProfile');
    const query = new Parse.Query(TechnicianProfile);
    query.equalTo('userId', userId);
    
    const result = await query.first();
    return result ? parseObjectToTechnician(result) : null;
  },

  // Create booking
  async createBooking(bookingData: Partial<ServiceBooking>): Promise<ServiceBooking> {
    const ServiceBooking = Parse.Object.extend('ServiceBooking');
    const booking = new ServiceBooking();
    
    booking.set('userId', bookingData.userId);
    booking.set('technicianId', bookingData.technicianId);
    booking.set('categoryId', bookingData.categoryId);
    booking.set('deviceType', bookingData.deviceType);
    booking.set('deviceBrand', bookingData.deviceBrand);
    booking.set('deviceModel', bookingData.deviceModel);
    booking.set('issueDescription', bookingData.issueDescription);
    booking.set('serviceLocation', bookingData.serviceLocation);
    booking.set('status', 'pending');
    booking.set('scheduledDate', bookingData.scheduledDate);
    booking.set('estimatedCost', bookingData.estimatedCost);
    
    const saved = await booking.save();
    return parseObjectToBooking(saved);
  },

  // Get user bookings
  async getUserBookings(userId: string): Promise<ServiceBooking[]> {
    const ServiceBooking = Parse.Object.extend('ServiceBooking');
    const query = new Parse.Query(ServiceBooking);
    query.equalTo('userId', userId);
    query.descending('createdAt');
    
    const results = await query.find();
    return results.map(parseObjectToBooking);
  },

  // Get technician bookings
  async getTechnicianBookings(technicianId: string): Promise<ServiceBooking[]> {
    const ServiceBooking = Parse.Object.extend('ServiceBooking');
    const query = new Parse.Query(ServiceBooking);
    query.equalTo('technicianId', technicianId);
    query.descending('scheduledDate');
    
    const results = await query.find();
    return results.map(parseObjectToBooking);
  },

  // Update booking status
  async updateBookingStatus(bookingId: string, status: ServiceBooking['status']): Promise<ServiceBooking> {
    const ServiceBooking = Parse.Object.extend('ServiceBooking');
    const query = new Parse.Query(ServiceBooking);
    const booking = await query.get(bookingId);
    
    booking.set('status', status);
    if (status === 'completed') {
      booking.set('completedDate', new Date());
    }
    
    const saved = await booking.save();
    return parseObjectToBooking(saved);
  },

  // Get technician stats
  async getTechnicianStats(technicianId: string): Promise<{
    totalJobs: number;
    completedJobs: number;
    pendingJobs: number;
    totalEarnings: number;
    averageRating: number;
  }> {
    const bookings = await this.getTechnicianBookings(technicianId);
    const completedBookings = bookings.filter(b => b.status === 'completed');
    
    return {
      totalJobs: bookings.length,
      completedJobs: completedBookings.length,
      pendingJobs: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
      totalEarnings: completedBookings.reduce((sum, b) => sum + (b.finalCost || b.estimatedCost || 0), 0),
      averageRating: 0, // Would need to fetch from reviews
    };
  },

  // Update technician profile
  async updateTechnicianProfile(technicianId: string, updates: Partial<TechnicianProfile>): Promise<TechnicianProfile> {
    const TechnicianProfile = Parse.Object.extend('TechnicianProfile');
    const query = new Parse.Query(TechnicianProfile);
    const profile = await query.get(technicianId);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        profile.set(key, value);
      }
    });
    
    const saved = await profile.save();
    return parseObjectToTechnician(saved);
  },
};
