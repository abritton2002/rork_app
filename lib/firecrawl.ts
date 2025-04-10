import { Platform } from 'react-native';
import { 
  NewsItem, 
  SocialPost, 
  RedditPost, 
  HealthData, 
  StockQuote, 
  EmailSummary,
  FirecrawlResponse
} from '@/types/api';

// Mock Firecrawl AI API client for demo purposes
// In a real app, you would use the actual API client

class FirecrawlAPI {
  private static instance: FirecrawlAPI;
  private apiKey: string | undefined = undefined;
  
  private constructor() {}
  
  public static getInstance(): FirecrawlAPI {
    if (!FirecrawlAPI.instance) {
      FirecrawlAPI.instance = new FirecrawlAPI();
    }
    return FirecrawlAPI.instance;
  }
  
  public setApiKey(key: string) {
    this.apiKey = key;
  }
  
  private async mockApiCall<T>(data: T, delay: number = 1000): Promise<FirecrawlResponse<T>> {
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return {
      data,
      status: 200,
      message: "Success",
      timestamp: new Date().toISOString()
    };
  }
  
  // News API
  public async getNews(sources: string[] = [], categories: string[] = [], count: number = 5): Promise<FirecrawlResponse<NewsItem[]>> {
    const mockNews: NewsItem[] = [
      {
        id: "news-1",
        title: "SpaceX Successfully Launches New Satellite Constellation",
        description: "SpaceX has successfully launched 60 more Starlink satellites into orbit, expanding its growing constellation.",
        source: "TechCrunch",
        url: "https://techcrunch.com/spacex-launch",
        imageUrl: "https://images.unsplash.com/photo-1516849677043-ef67c9557e16?q=80&w=2070&auto=format&fit=crop",
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        category: "Technology"
      },
      {
        id: "news-2",
        title: "Global Markets Rally on Economic Recovery Hopes",
        description: "Stock markets around the world surged today as new economic data suggests a faster than expected recovery.",
        source: "Financial Times",
        url: "https://ft.com/markets-rally",
        imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop",
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        category: "Finance"
      },
      {
        id: "news-3",
        title: "New Study Reveals Benefits of Mediterranean Diet",
        description: "Researchers have found additional health benefits associated with following a Mediterranean diet, including improved cognitive function.",
        source: "Health Journal",
        url: "https://healthjournal.com/mediterranean-diet",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        category: "Health"
      },
      {
        id: "news-4",
        title: "Climate Summit Ends with New Global Commitments",
        description: "World leaders have agreed to ambitious new targets for reducing carbon emissions following a week-long climate summit.",
        source: "BBC News",
        url: "https://bbc.com/climate-summit",
        imageUrl: "https://images.unsplash.com/photo-1569950044272-a6273db1e1ed?q=80&w=2070&auto=format&fit=crop",
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        category: "Environment"
      },
      {
        id: "news-5",
        title: "New AI Model Can Predict Protein Structures with Unprecedented Accuracy",
        description: "Scientists have developed a new artificial intelligence system capable of predicting protein structures with remarkable precision.",
        source: "Science Daily",
        url: "https://sciencedaily.com/ai-protein",
        imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2070&auto=format&fit=crop",
        publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        category: "Science"
      }
    ];
    
    return this.mockApiCall(mockNews);
  }
  
  // Social Media API
  public async getSocialPosts(platforms: string[] = [], count: number = 5): Promise<FirecrawlResponse<SocialPost[]>> {
    const mockPosts: SocialPost[] = [
      {
        id: "social-1",
        platform: "twitter",
        content: "Just announced our new product line! Check out the link in bio for more details. #innovation #technology",
        author: {
          name: "Tech Innovations",
          username: "@techinnovate",
          avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop"
        },
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        likes: 1243,
        comments: 89,
        shares: 356,
        mediaUrls: ["https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop"]
      },
      {
        id: "social-2",
        platform: "instagram",
        content: "Beautiful sunset at the beach today! 🌅 #sunset #beach #summer",
        author: {
          name: "Travel Enthusiast",
          username: "@travelbug",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2070&auto=format&fit=crop"
        },
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        likes: 3567,
        comments: 124,
        shares: 45,
        mediaUrls: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"]
      },
      {
        id: "social-3",
        platform: "facebook",
        content: "We're hiring! Join our team of passionate developers and help us build the future of technology.",
        author: {
          name: "Tech Company",
          username: "techcompany",
          avatarUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2073&auto=format&fit=crop"
        },
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        likes: 432,
        comments: 67,
        shares: 89
      }
    ];
    
    return this.mockApiCall(mockPosts);
  }
  
  // Reddit API
  public async getRedditPosts(subreddits: string[] = [], sort: string = "hot", count: number = 5): Promise<FirecrawlResponse<RedditPost[]>> {
    const mockPosts: RedditPost[] = [
      {
        id: "reddit-1",
        title: "I built a tool that automatically summarizes long articles using AI",
        subreddit: "programming",
        author: "coder123",
        content: "After months of work, I'm excited to share my new open-source tool that uses AI to summarize long articles. It works by analyzing the text and extracting the most important points...",
        upvotes: 4567,
        downvotes: 123,
        commentCount: 342,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        url: "https://reddit.com/r/programming/comments/123456",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
      },
      {
        id: "reddit-2",
        title: "This is what the surface of Mars looks like in true color",
        subreddit: "space",
        author: "spacefan",
        content: "NASA recently released these new images from the Perseverance rover showing the Martian surface in true color. The reddish hue comes from iron oxide (rust) in the soil.",
        upvotes: 8901,
        downvotes: 234,
        commentCount: 567,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        url: "https://reddit.com/r/space/comments/234567",
        imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=2069&auto=format&fit=crop"
      },
      {
        id: "reddit-3",
        title: "What's your favorite productivity hack?",
        subreddit: "productivity",
        author: "efficiency_expert",
        content: "I've been trying to optimize my workflow and would love to hear what productivity hacks have made the biggest difference for you. Personally, I've found the Pomodoro technique to be incredibly effective...",
        upvotes: 2345,
        downvotes: 78,
        commentCount: 789,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        url: "https://reddit.com/r/productivity/comments/345678",
        imageUrl: null
      }
    ];
    
    return this.mockApiCall(mockPosts);
  }
  
  // Health API
  public async getHealthData(source: string = "fitbit"): Promise<FirecrawlResponse<HealthData>> {
    const mockHealthData: HealthData = {
      steps: 8743,
      caloriesBurned: 2156,
      activeMinutes: 78,
      heartRate: {
        current: 72,
        average: 68,
        min: 52,
        max: 142
      },
      sleep: {
        duration: 7.5,
        quality: "good",
        deepSleep: 1.8,
        lightSleep: 4.2,
        remSleep: 1.5
      },
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    };
    
    return this.mockApiCall(mockHealthData);
  }
  
  // Stocks API
  public async getStockQuotes(symbols: string[] = ["AAPL", "MSFT", "GOOGL"]): Promise<FirecrawlResponse<StockQuote[]>> {
    const mockStocks: StockQuote[] = [
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        price: 182.63,
        change: 3.24,
        changePercent: 1.81,
        marketCap: 2870000000000,
        volume: 58432100,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: "MSFT",
        name: "Microsoft Corporation",
        price: 338.11,
        change: -1.45,
        changePercent: -0.43,
        marketCap: 2510000000000,
        volume: 21345600,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        price: 131.86,
        change: 2.17,
        changePercent: 1.67,
        marketCap: 1670000000000,
        volume: 19876500,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: "AMZN",
        name: "Amazon.com Inc.",
        price: 178.75,
        change: 4.32,
        changePercent: 2.48,
        marketCap: 1850000000000,
        volume: 32145600,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: "TSLA",
        name: "Tesla, Inc.",
        price: 237.49,
        change: -5.63,
        changePercent: -2.32,
        marketCap: 754000000000,
        volume: 87654300,
        lastUpdated: new Date().toISOString()
      }
    ];
    
    return this.mockApiCall(mockStocks);
  }
  
  // Email API
  public async getEmailSummary(provider: string = "gmail"): Promise<FirecrawlResponse<EmailSummary>> {
    const mockEmailSummary: EmailSummary = {
      unreadCount: 12,
      importantCount: 3,
      recentEmails: [
        {
          id: "email-1",
          sender: "Team Updates",
          subject: "Weekly Project Status Update",
          preview: "Here's a summary of this week's progress on the main project...",
          receivedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
          isRead: false,
          isImportant: true
        },
        {
          id: "email-2",
          sender: "Newsletter",
          subject: "Tech News Digest - Latest Updates",
          preview: "This week in tech: New product launches, industry trends, and more...",
          receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          isImportant: false
        },
        {
          id: "email-3",
          sender: "Calendar",
          subject: "Reminder: Meeting Tomorrow at 10 AM",
          preview: "You have a scheduled meeting with the design team tomorrow at 10:00 AM...",
          receivedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          isImportant: true
        }
      ]
    };
    
    return this.mockApiCall(mockEmailSummary);
  }
}

// Export the Firecrawl API client instance
export const firecrawl = FirecrawlAPI.getInstance();