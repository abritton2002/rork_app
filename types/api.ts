export interface FirecrawlResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  category?: string;
}

export interface SocialPost {
  id: string;
  platform: "twitter" | "facebook" | "instagram";
  content: string;
  author: {
    name: string;
    username: string;
    avatarUrl?: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  mediaUrls?: string[];
}

export interface RedditPost {
  id: string;
  title: string;
  subreddit: string;
  author: string;
  content: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  createdAt: string;
  url: string;
  imageUrl?: string;
}

export interface HealthData {
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
  heartRate?: {
    current?: number;
    average?: number;
    min?: number;
    max?: number;
  };
  sleep?: {
    duration: number;
    quality: "poor" | "fair" | "good" | "excellent";
    deepSleep?: number;
    lightSleep?: number;
    remSleep?: number;
  };
  lastUpdated: string;
}

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: number;
  volume?: number;
  lastUpdated: string;
}

export interface EmailSummary {
  unreadCount: number;
  importantCount: number;
  recentEmails: {
    id: string;
    sender: string;
    subject: string;
    preview: string;
    receivedAt: string;
    isRead: boolean;
    isImportant: boolean;
  }[];
}