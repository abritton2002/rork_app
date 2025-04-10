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
import { RefreshCw, ArrowUp, ArrowDown, MessageCircle, ExternalLink } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { firecrawl } from '@/lib/firecrawl';
import { RedditPost } from '@/types/api';

interface RedditWidgetProps {
  size: "small" | "medium" | "large";
  settings?: {
    subreddits?: string[];
    sort?: string;
    refreshInterval?: number;
  };
}

export const RedditWidget: React.FC<RedditWidgetProps> = ({ 
  size,
  settings = { 
    subreddits: ["technology", "worldnews", "science"],
    sort: "hot",
    refreshInterval: 30
  }
}) => {
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await firecrawl.getRedditPosts(
        settings.subreddits,
        settings.sort,
        size === "small" ? 2 : (size === "medium" ? 3 : 5)
      );
      
      setPosts(response.data);
    } catch (err: any) {
      setError("Failed to load Reddit posts");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchPosts();
    
    // Set up refresh interval
    const interval = setInterval(() => {
      fetchPosts();
    }, (settings.refreshInterval || 30) * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [settings.subreddits, settings.sort, settings.refreshInterval]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };
  
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  const openRedditPost = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };
  
  // Determine how many posts to show based on widget size
  const getMaxPosts = () => {
    switch(size) {
      case "small": return 1;
      case "medium": return 2;
      case "large": return 3;
      default: return 2;
    }
  };
  
  // Limit the number of posts shown based on widget size
  const visiblePosts = posts.slice(0, getMaxPosts());
  
  const renderPostItem = ({ item }: { item: RedditPost }) => (
    <TouchableOpacity 
      style={styles.postItem}
      onPress={() => openRedditPost(item.url)}
    >
      <View style={styles.postHeader}>
        <Text style={styles.subreddit} numberOfLines={1}>r/{item.subreddit}</Text>
        <Text style={styles.postAuthor} numberOfLines={1}>u/{item.author}</Text>
      </View>
      
      <Text style={styles.postTitle} numberOfLines={2}>{item.title}</Text>
      
      {item.imageUrl && size !== "small" && (
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.postImage}
          resizeMode="cover"
        />
      )}
      
      {size === "large" && item.content && (
        <Text style={styles.postContent} numberOfLines={2}>
          {item.content}
        </Text>
      )}
      
      <View style={styles.postStats}>
        <View style={styles.voteContainer}>
          <ArrowUp size={14} color={colors.success} />
          <Text style={styles.voteText}>{formatNumber(item.upvotes)}</Text>
        </View>
        
        <View style={styles.voteContainer}>
          <ArrowDown size={14} color={colors.danger} />
          <Text style={styles.voteText}>{formatNumber(item.downvotes)}</Text>
        </View>
        
        <View style={styles.commentContainer}>
          <MessageCircle size={14} color={colors.textSecondary} />
          <Text style={styles.commentText}>{formatNumber(item.commentCount)}</Text>
        </View>
        
        <ExternalLink size={14} color={colors.primary} />
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchPosts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, styles[size]]}>
      <View style={styles.header}>
        <Text style={styles.title}>Reddit</Text>
        <TouchableOpacity onPress={handleRefresh} disabled={refreshing}>
          <RefreshCw 
            size={18} 
            color={colors.textSecondary}
            style={refreshing ? styles.rotating : undefined}
          />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={visiblePosts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.postsList}
        scrollEnabled={size === "large"}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No posts available</Text>
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
    height: 180,
  },
  medium: {
    height: 280,
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
  postsList: {
    flexGrow: 1,
  },
  postItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subreddit: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    flex: 1,
    marginRight: 8,
  },
  postAuthor: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  postImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  postContent: {
    fontSize: 13,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 18,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  voteText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    minWidth: 20,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    flex: 1,
  },
  commentText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
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