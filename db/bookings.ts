export interface Booking {
  booking_id: string;
  user_id: string;
  provider_id: string;
  service_type: string;
  status: 'PENDING' | 'CONFIRMED' | 'EN_ROUTE' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED';
  slot_datetime: string;
  location: { area: string; lat: number; lng: number };
  price_breakdown: { base: number; distance_fee: number; surge: number; total: number };
  agent_reasoning_log: any[];
  created_at: string;
  updated_at: string;
  notifications_sent: string[];
}

// In-memory array to mock database for the hackathon
export const mockBookings: Booking[] = [];
