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
import { RefreshCw, Heart, MessageCircle, Share2, Twitter, Facebook, Instagram } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { firecrawl } from '@/lib/firecrawl';
import { SocialPost } from '@/types/api';

interface SocialWidgetProps {
  size: "small" | "medium" | "large";
  settings?: {
    platforms?: string[];
    refreshInterval?: number;
  };
}

export const SocialWidget: React.FC<SocialWidgetProps> = ({ 
  size,
  settings = { 
    platforms: ["twitter", "facebook", "instagram"],
    refreshInterval: 15
  }
}) => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await firecrawl.getSocialPosts(
        settings.platforms,
        size === "small" ? 2 : (size === "medium" ? 3 : 5)
      );
      
      setPosts(response.data);
    } catch (err: any) {
      setError("Failed to load social posts");
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
    }, (settings.refreshInterval || 15) * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [settings.platforms, settings.refreshInterval]);
  
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
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter size={16} color="#1DA1F2" />;
      case 'facebook':
        return <Facebook size={16} color="#4267B2" />;
      case 'instagram':
        return <Instagram size={16} color="#E1306C" />;
      default:
        return null;
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
  
  const renderPostItem = ({ item }: { item: SocialPost }) => (
    <View style={styles.postItem}>
      <View style={styles.postHeader}>
        <View style={styles.authorContainer}>
          {item.author.avatarUrl ? (
            <Image 
              source={{ uri: item.author.avatarUrl }} 
              style={styles.authorAvatar}
            />
          ) : (
            <View style={[styles.authorAvatarPlaceholder, { backgroundColor: getPlatformColor(item.platform) }]}>
              <Text style={styles.authorInitial}>
                {item.author.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.authorInfo}>
            <Text style={styles.authorName} numberOfLines={1}>{item.author.name}</Text>
            <Text style={styles.authorUsername} numberOfLines={1}>{item.author.username}</Text>
          </View>
        </View>
        {getPlatformIcon(item.platform)}
      </View>
      
      <Text style={styles.postContent} numberOfLines={size === "small" ? 2 : 3}>{item.content}</Text>
      
      {item.mediaUrls && item.mediaUrls.length > 0 && size !== "small" && (
        <Image 
          source={{ uri: item.mediaUrls[0] }} 
          style={styles.postMedia}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.postStats}>
        <View style={styles.statItem}>
          <Heart size={14} color={colors.textSecondary} />
          <Text style={styles.statText}>{formatNumber(item.likes)}</Text>
        </View>
        <View style={styles.statItem}>
          <MessageCircle size={14} color={colors.textSecondary} />
          <Text style={styles.statText}>{formatNumber(item.comments)}</Text>
        </View>
        <View style={styles.statItem}>
          <Share2 size={14} color={colors.textSecondary} />
          <Text style={styles.statText}>{formatNumber(item.shares)}</Text>
        </View>
      </View>
    </View>
  );
  
  // Get a color based on platform for avatar placeholder
  const getPlatformColor = (platform: string): string => {
    switch (platform) {
      case 'twitter':
        return '#1DA1F2';
      case 'facebook':
        return '#4267B2';
      case 'instagram':
        return '#E1306C';
      default:
        return colors.primary;
    }
  };
  
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
        <Text style={styles.title}>Social Feed</Text>
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
    marginBottom: 8,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: colors.lightGray,
  },
  authorAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInitial: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  authorUsername: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  postContent: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  postMedia: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
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