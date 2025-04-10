import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/dashboard';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  error: string | null;
  
  // Actions
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  loadUser: () => Promise<void>;
}

// Define profile type for Supabase response
interface SupabaseProfile {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
  last_login: string;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null,
      
      signUp: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await supabase.auth.signUp({ email, password });
          
          if (error) throw new Error(error.toString());
          
          if (data.user) {
            // Create a user profile
            const profile: UserProfile = {
              id: data.user.id,
              email: data.user.email!,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              preferences: {
                notifications: true,
                emailUpdates: false,
              }
            };
            
            set({ 
              isAuthenticated: true,
              user: profile,
              isLoading: false 
            });
          } else {
            set({ isLoading: false });
          }
        } catch (err: any) {
          set({ 
            error: err.toString() || "An error occurred during sign up",
            isLoading: false 
          });
        }
      },
      
      signIn: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await supabase.auth.signIn({ email, password });
          
          if (error) throw new Error(error.toString());
          
          if (data.user) {
            // Get user profile
            const { data: profileData } = await supabase
              .from('profiles')
              .select()
              .eq('user_id', data.user.id);
              
            const profile = profileData?.[0] as SupabaseProfile | undefined;
            
            if (profile) {
              const userProfile: UserProfile = {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                avatar: profile.avatar_url,
                createdAt: profile.created_at,
                lastLogin: new Date().toISOString(),
                preferences: profile.preferences
              };
              
              set({ 
                isAuthenticated: true,
                user: userProfile,
                isLoading: false 
              });
            } else {
              // Create a basic profile if none exists
              const newProfile: UserProfile = {
                id: data.user.id,
                email: data.user.email!,
                createdAt: data.user.createdAt || new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                preferences: {
                  notifications: true,
                  emailUpdates: false,
                }
              };
              
              set({ 
                isAuthenticated: true,
                user: newProfile,
                isLoading: false 
              });
            }
          } else {
            set({ isLoading: false });
          }
        } catch (err: any) {
          set({ 
            error: err.toString() || "An error occurred during sign in",
            isLoading: false 
          });
        }
      },
      
      signOut: async () => {
        try {
          set({ isLoading: true });
          
          const { error } = await supabase.auth.signOut();
          
          if (error) throw new Error(error.toString());
          
          set({ 
            isAuthenticated: false,
            user: null,
            isLoading: false 
          });
        } catch (err: any) {
          set({ 
            error: err.toString() || "An error occurred during sign out",
            isLoading: false 
          });
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      loadUser: async () => {
        try {
          set({ isLoading: true });
          
          const { data, error } = await supabase.auth.getSession();
          
          if (error) throw new Error(error.toString());
          
          if (data.session) {
            const { data: userData } = await supabase.auth.getUser();
            
            if (userData.user) {
              // Get user profile
              const { data: profileData } = await supabase
                .from('profiles')
                .select()
                .eq('user_id', userData.user.id);
                
              const profile = profileData?.[0] as SupabaseProfile | undefined;
              
              if (profile) {
                const userProfile: UserProfile = {
                  id: profile.id,
                  email: profile.email,
                  name: profile.name,
                  avatar: profile.avatar_url,
                  createdAt: profile.created_at,
                  lastLogin: new Date().toISOString(),
                  preferences: profile.preferences
                };
                
                set({ 
                  isAuthenticated: true,
                  user: userProfile,
                  isLoading: false 
                });
              } else {
                // Create a basic profile if none exists
                const newProfile: UserProfile = {
                  id: userData.user.id,
                  email: userData.user.email!,
                  createdAt: userData.user.createdAt || new Date().toISOString(),
                  lastLogin: new Date().toISOString(),
                  preferences: {
                    notifications: true,
                    emailUpdates: false,
                  }
                };
                
                set({ 
                  isAuthenticated: true,
                  user: newProfile,
                  isLoading: false 
                });
              }
            } else {
              set({ isLoading: false });
            }
          } else {
            set({ isLoading: false });
          }
        } catch (err: any) {
          set({ 
            error: err.toString() || "An error occurred while loading user data",
            isLoading: false 
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user
      })
    }
  )
);