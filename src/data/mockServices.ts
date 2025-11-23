export interface Technician {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  specializations: string[];
  serviceArea: string;
  hourlyRate: number;
  availability: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  bio: string;
  yearsOfExperience: number;
  certifications: string[];
}

export interface ServiceBooking {
  id: string;
  category: string;
  device: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  technician: Technician;
  location: string;
  issue: string;
}

export const mockTechnicians: Technician[] = [
  {
    id: '1',
    name: 'John Martinez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    rating: 4.9,
    reviews: 234,
    specializations: ['iPhone Repair', 'Samsung Repair', 'Screen Replacement'],
    serviceArea: 'Downtown, Midtown',
    hourlyRate: 75,
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    location: {
      lat: 40.7589,
      lng: -73.9851,
      address: '123 Tech St, New York, NY 10001'
    },
    bio: 'Certified technician with 8+ years of experience in mobile device repair.',
    yearsOfExperience: 8,
    certifications: ['Apple Certified', 'Samsung Certified', 'CompTIA A+']
  },
  {
    id: '2',
    name: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    rating: 4.8,
    reviews: 189,
    specializations: ['Laptop Repair', 'MacBook Repair', 'Data Recovery'],
    serviceArea: 'Upper East Side, Midtown',
    hourlyRate: 85,
    availability: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
    location: {
      lat: 40.7614,
      lng: -73.9776,
      address: '456 Repair Ave, New York, NY 10022'
    },
    bio: 'Specialized in laptop repairs and data recovery with 6 years of experience.',
    yearsOfExperience: 6,
    certifications: ['Apple Certified Mac Technician', 'Microsoft Certified']
  },
  {
    id: '3',
    name: 'Mike Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    rating: 4.7,
    reviews: 156,
    specializations: ['Home Appliances', 'HVAC', 'Refrigerator Repair'],
    serviceArea: 'Brooklyn, Queens',
    hourlyRate: 65,
    availability: ['Tuesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    location: {
      lat: 40.6782,
      lng: -73.9442,
      address: '789 Brooklyn St, Brooklyn, NY 11201'
    },
    bio: 'Expert in home appliance repair with focus on energy efficiency.',
    yearsOfExperience: 10,
    certifications: ['EPA Universal Certification', 'HVAC Licensed']
  }
];

export const mockBookings: ServiceBooking[] = [
  {
    id: '1',
    category: 'Phones',
    device: 'iPhone 14 Pro',
    date: '2024-01-15',
    time: '10:00 AM',
    status: 'confirmed',
    technician: mockTechnicians[0],
    location: 'Home Service',
    issue: 'Cracked screen replacement'
  },
  {
    id: '2',
    category: 'Laptops',
    device: 'MacBook Pro 16"',
    date: '2024-01-18',
    time: '2:00 PM',
    status: 'pending',
    technician: mockTechnicians[1],
    location: 'Shop Service',
    issue: 'Battery replacement and cleaning'
  }
];

export const serviceCategories = [
  {
    id: 'phones',
    name: 'Phones',
    icon: 'Smartphone',
    description: 'Mobile device repair and maintenance',
    services: ['Screen Replacement', 'Battery Replacement', 'Water Damage', 'Software Issues'],
    avgPrice: 75
  },
  {
    id: 'laptops',
    name: 'Laptops',
    icon: 'Laptop',
    description: 'Computer repair and upgrades',
    services: ['Hardware Upgrade', 'Virus Removal', 'Data Recovery', 'Screen Replacement'],
    avgPrice: 120
  },
  {
    id: 'appliances',
    name: 'Appliances',
    icon: 'Refrigerator',
    description: 'Home appliance repair services',
    services: ['Refrigerator', 'Washing Machine', 'Dryer', 'Dishwasher', 'HVAC'],
    avgPrice: 150
  }
];
