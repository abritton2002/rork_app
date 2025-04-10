export type WidgetType = 
  | "weather" 
  | "tasks" 
  | "notes" 
  | "calendar" 
  | "clock" 
  | "quote"
  | "links"
  | "news"
  | "news-search"
  | "social"
  | "reddit"
  | "health"
  | "stocks"
  | "email";

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  position: number;
  size: "small" | "medium" | "large";
  settings?: Record<string, any>;
}

export interface Dashboard {
  id: string;
  name: string;
  widgets: Widget[];
}

export interface UserSettings {
  theme: "light" | "dark";
  defaultDashboard: string;
  connectedServices: ConnectedService[];
}

export interface ConnectedService {
  id: string;
  type: ServiceType;
  name: string;
  isConnected: boolean;
  lastSynced?: string;
  settings?: Record<string, any>;
}

export type ServiceType = 
  | "news" 
  | "twitter" 
  | "facebook" 
  | "instagram" 
  | "reddit" 
  | "fitbit" 
  | "apple_health" 
  | "google_fit"
  | "stocks"
  | "gmail"
  | "outlook";

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: string;
  lastLogin: string;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
  };
}