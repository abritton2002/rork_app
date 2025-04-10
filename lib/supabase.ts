import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Mock Supabase client for demo purposes
// In a real app, you would use the actual Supabase client

class SupabaseMock {
  private static instance: SupabaseMock;
  private storage = AsyncStorage;
  private user: any = null;
  private isAuthenticated = false;

  private constructor() {
    // Initialize and check for existing session
    this.checkSession();
  }

  public static getInstance(): SupabaseMock {
    if (!SupabaseMock.instance) {
      SupabaseMock.instance = new SupabaseMock();
    }
    return SupabaseMock.instance;
  }

  private async checkSession() {
    try {
      const session = await this.storage.getItem('supabase_session');
      if (session) {
        const parsedSession = JSON.parse(session);
        if (new Date(parsedSession.expiresAt) > new Date()) {
          this.user = parsedSession.user;
          this.isAuthenticated = true;
        } else {
          // Session expired
          await this.storage.removeItem('supabase_session');
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  }

  public get auth() {
    return {
      signUp: async ({ email, password }: { email: string; password: string }) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user creation
        const newUser = {
          id: `user_${Date.now()}`,
          email,
          createdAt: new Date().toISOString(),
        };
        
        this.user = newUser;
        this.isAuthenticated = true;
        
        // Store session
        const session = {
          user: newUser,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        };
        
        await this.storage.setItem('supabase_session', JSON.stringify(session));
        
        return { data: { user: newUser }, error: null };
      },
      
      signIn: async ({ email, password }: { email: string; password: string }) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock successful login
        const user = {
          id: `user_${Date.now()}`,
          email,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        };
        
        this.user = user;
        this.isAuthenticated = true;
        
        // Store session
        const session = {
          user,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        };
        
        await this.storage.setItem('supabase_session', JSON.stringify(session));
        
        return { data: { user }, error: null };
      },
      
      signOut: async () => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.user = null;
        this.isAuthenticated = false;
        
        // Remove session
        await this.storage.removeItem('supabase_session');
        
        return { error: null };
      },
      
      getUser: () => {
        return { data: { user: this.user }, error: null };
      },
      
      getSession: () => {
        if (this.isAuthenticated) {
          return { 
            data: { 
              session: {
                user: this.user,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).getTime() / 1000,
              }
            }, 
            error: null 
          };
        }
        return { data: { session: null }, error: null };
      }
    };
  }

  public get from() {
    return (table: string) => ({
      select: (columns: string = '*') => ({
        eq: async (column: string, value: any) => {
          // Simulate database query
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Mock data based on table and query
          if (table === 'profiles' && column === 'user_id') {
            return {
              data: [{
                id: value,
                email: 'user@example.com',
                name: 'Demo User',
                avatar_url: null,
                created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                last_login: new Date().toISOString(),
                preferences: {
                  notifications: true,
                  emailUpdates: false,
                }
              }],
              error: null
            };
          }
          
          if (table === 'connected_services' && column === 'user_id') {
            return {
              data: [
                {
                  id: 'service_1',
                  user_id: value,
                  type: 'news',
                  name: 'News API',
                  is_connected: true,
                  last_synced: new Date().toISOString(),
                  settings: { sources: ['bbc-news', 'cnn', 'the-verge'] }
                },
                {
                  id: 'service_2',
                  user_id: value,
                  type: 'reddit',
                  name: 'Reddit',
                  is_connected: true,
                  last_synced: new Date().toISOString(),
                  settings: { subreddits: ['technology', 'worldnews', 'science'] }
                }
              ],
              error: null
            };
          }
          
          return { data: [], error: null };
        }
      }),
      insert: async (data: any) => {
        // Simulate database insert
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return { data: { ...data, id: `${table}_${Date.now()}` }, error: null };
      },
      update: async (data: any) => {
        // Simulate database update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return { data, error: null };
      },
      delete: async () => {
        // Simulate database delete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return { data: null, error: null };
      }
    });
  }
}

// Export the Supabase client instance
export const supabase = SupabaseMock.getInstance();

// Helper function to check if running on web
export const isWeb = Platform.OS === 'web';