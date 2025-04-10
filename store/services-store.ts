import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConnectedService, ServiceType } from '@/types/dashboard';
import { supabase } from '@/lib/supabase';

interface ServicesState {
  services: ConnectedService[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchServices: (userId: string) => Promise<void>;
  connectService: (service: Omit<ConnectedService, "id" | "isConnected" | "lastSynced">) => Promise<void>;
  disconnectService: (serviceId: string) => Promise<void>;
  updateServiceSettings: (serviceId: string, settings: Record<string, any>) => Promise<void>;
  clearError: () => void;
}

// Define service type for Supabase response
interface SupabaseService {
  id: string;
  user_id: string;
  type: string;
  name: string;
  is_connected: boolean;
  last_synced: string;
  settings: Record<string, any>;
}

export const useServicesStore = create<ServicesState>()(
  persist(
    (set, get) => ({
      services: [],
      isLoading: false,
      error: null,
      
      fetchServices: async (userId) => {
        try {
          set({ isLoading: true, error: null });
          
          // In a real app, fetch from Supabase
          const { data, error } = await supabase
            .from('connected_services')
            .select()
            .eq('user_id', userId);
            
          if (error) throw new Error(error.toString());
          
          if (data) {
            const services: ConnectedService[] = (data as SupabaseService[]).map(item => ({
              id: item.id,
              type: item.type as ServiceType,
              name: item.name,
              isConnected: item.is_connected,
              lastSynced: item.last_synced,
              settings: item.settings
            }));
            
            set({ services, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (err: any) {
          set({ 
            error: err.toString() || "Failed to fetch connected services",
            isLoading: false 
          });
        }
      },
      
      connectService: async (service) => {
        try {
          set({ isLoading: true, error: null });
          
          const newService: ConnectedService = {
            ...service,
            id: `service_${Date.now()}`,
            isConnected: true,
            lastSynced: new Date().toISOString()
          };
          
          // In a real app, save to Supabase
          // For demo, just update local state
          set(state => ({
            services: [...state.services, newService],
            isLoading: false
          }));
        } catch (err: any) {
          set({ 
            error: err.toString() || "Failed to connect service",
            isLoading: false 
          });
        }
      },
      
      disconnectService: async (serviceId) => {
        try {
          set({ isLoading: true, error: null });
          
          // In a real app, update in Supabase
          // For demo, just update local state
          set(state => ({
            services: state.services.map(service => 
              service.id === serviceId 
                ? { ...service, isConnected: false }
                : service
            ),
            isLoading: false
          }));
        } catch (err: any) {
          set({ 
            error: err.toString() || "Failed to disconnect service",
            isLoading: false 
          });
        }
      },
      
      updateServiceSettings: async (serviceId, settings) => {
        try {
          set({ isLoading: true, error: null });
          
          // In a real app, update in Supabase
          // For demo, just update local state
          set(state => ({
            services: state.services.map(service => 
              service.id === serviceId 
                ? { 
                    ...service, 
                    settings: { ...service.settings, ...settings },
                    lastSynced: new Date().toISOString()
                  }
                : service
            ),
            isLoading: false
          }));
        } catch (err: any) {
          set({ 
            error: err.toString() || "Failed to update service settings",
            isLoading: false 
          });
        }
      },
      
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'services-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);