import { create } from 'zustand';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  intent: 'new' | 'used' | 'certified' | 'mod-lab' | 'trade-in' | 'service';
  product_id?: string;
  city: string;
  created_at: string;
  message?: string;
}

export interface ServiceTicket {
  id: string;
  name: string;
  phone: string;
  scooter_details: string;
  issue: string;
  preferred_date: string;
  city: string;
  status: 'pending' | 'confirmed' | 'completed';
  created_at: string;
}

export interface TradeInRequest {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  batteryCondition: string;
  location: string;
  phone: string;
  estimatedValue: { min: number; max: number };
  created_at: string;
}

interface AppState {
  leads: Lead[];
  serviceTickets: ServiceTicket[];
  tradeInRequests: TradeInRequest[];
  addLead: (lead: Omit<Lead, 'id' | 'created_at'>) => void;
  addServiceTicket: (ticket: Omit<ServiceTicket, 'id' | 'created_at' | 'status'>) => void;
  addTradeInRequest: (request: Omit<TradeInRequest, 'id' | 'created_at'>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  leads: [],
  serviceTickets: [],
  tradeInRequests: [],
  
  addLead: (lead) => set((state) => ({
    leads: [...state.leads, {
      ...lead,
      id: `lead-${Date.now()}`,
      created_at: new Date().toISOString(),
    }],
  })),
  
  addServiceTicket: (ticket) => set((state) => ({
    serviceTickets: [...state.serviceTickets, {
      ...ticket,
      id: `ticket-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString(),
    }],
  })),
  
  addTradeInRequest: (request) => set((state) => ({
    tradeInRequests: [...state.tradeInRequests, {
      ...request,
      id: `trade-${Date.now()}`,
      created_at: new Date().toISOString(),
    }],
  })),
}));
