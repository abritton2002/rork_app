import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  FlatList,
  Linking
} from 'react-native';
import { ExternalLink, RefreshCw } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { firecrawl } from '@/lib/firecrawl';
import { NewsItem } from '@/types/api';

interface NewsWidgetProps {
  size: "small" | "medium" | "large";
  settings?: {
    sources?: string[];
    categories?: string[];
    refreshInterval?: number;
  };
}

export const NewsWidget: React.FC<NewsWidgetProps> = ({ 
  size,
  settings = { 
    sources: [], 
    categories: [],
    refreshInterval: 30
  }
}) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await firecrawl.getNews(
        settings.sources,
        settings.categories,
        size === "small" ? 3 : (size === "medium" ? 4 : 5)
      );
      
      setNews(response.data);
    } catch (err: any) {
      setError("Failed to load news");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchNews();
    
    // Set up refresh interval
    const interval = setInterval(() => {
      fetchNews();
    }, (settings.refreshInterval || 30) * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [settings.sources, settings.categories, settings.refreshInterval]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };
  
  const openArticle = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };
  
  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity 
      style={styles.newsItem}
      onPress={() => openArticle(item.url)}
    >
      {item.imageUrl && (
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.newsImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.newsContent}>
        <Text style={styles.newsSource}>{item.source}</Text>
        <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
        {size !== "small" && (
          <Text style={styles.newsDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <View style={styles.newsFooter}>
          <Text style={styles.newsTime}>
            {new Date(item.publishedAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
          <ExternalLink size={14} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
  
  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles[size], styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={[styles.container, styles[size], styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchNews}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, styles[size]]}>
      <View style={styles.header}>
        <Text style={styles.title}>Latest News</Text>
        <TouchableOpacity onPress={handleRefresh} disabled={refreshing}>
          <RefreshCw 
            size={18} 
            color={colors.textSecondary}
            style={refreshing ? styles.rotating : undefined}
          />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={news}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.newsList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No news available</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  small: {
    height: 200,
  },
  medium: {
    height: 300,
  },
  large: {
    height: 400,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  newsList: {
    flexGrow: 1,
  },
  newsItem: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
  },
  newsImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  newsContent: {
    flex: 1,
  },
  newsSource: {
    fontSize: 12,
    color: colors.primary,
    marginBottom: 4,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    lineHeight: 18,
  },
  newsDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    lineHeight: 16,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsTime: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 16,
  },
  errorText: {
    color: colors.danger,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  rotating: {
    opacity: 0.7,
  }
});