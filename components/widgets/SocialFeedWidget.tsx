import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native';
import { Twitter, Facebook, Instagram, RefreshCw } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface SocialPost {
  id: string;
  platform: 'twitter' | 'facebook' | 'instagram';
  author: string;
  content: string;
  likes: number;
  timestamp: string;
  imageUrl?: string;
}

interface SocialFeedWidgetProps {
  size: "small" | "medium" | "large";
  settings?: {
    platforms?: ('twitter' | 'facebook' | 'instagram')[];
    refreshInterval?: number;
    maxPosts?: number;
  };
}

export const SocialFeedWidget: React.FC<SocialFeedWidgetProps> = ({
  size,
  settings = {
    platforms: ['twitter', 'facebook', 'instagram'],
    maxPosts: 5
  }
}) => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call with dummy data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dummyPosts: SocialPost[] = [
        {
          id: '1',
          platform: 'twitter',
          author: '@techuser',
          content: 'Just discovered an amazing new feature in the latest iOS update! 🚀 #Apple #Tech',
          likes: 245,
          timestamp: '2h ago'
        },
        {
          id: '2',
          platform: 'instagram',
          author: 'photography_lover',
          content: 'Beautiful sunset at the beach today 🌅',
          likes: 1532,
          timestamp: '4h ago',
          imageUrl: 'https://picsum.photos/300/200'
        },
        {
          id: '3',
          platform: 'facebook',
          author: 'John Smith',
          content: 'Had a great time at the tech conference today! Met so many inspiring people.',
          likes: 89,
          timestamp: '6h ago'
        },
        {
          id: '4',
          platform: 'twitter',
          author: '@devlife',
          content: 'Working on a new project using React Native. The possibilities are endless! 💻',
          likes: 178,
          timestamp: '8h ago'
        },
        {
          id: '5',
          platform: 'instagram',
          author: 'techie_gram',
          content: 'My workspace setup for 2024 💪',
          likes: 892,
          timestamp: '12h ago',
          imageUrl: 'https://picsum.photos/300/200'
        }
      ];

      // Filter posts based on selected platforms
      const filteredPosts = dummyPosts.filter(post => 
        settings.platforms?.includes(post.platform)
      );

      setPosts(filteredPosts.slice(0, settings.maxPosts));
    } catch (err) {
      setError('Failed to fetch social media posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    
    const interval = settings.refreshInterval || 300000; // 5 minutes default
    const timer = setInterval(fetchPosts, interval);
    
    return () => clearInterval(timer);
  }, [settings.platforms, settings.maxPosts]);

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

  const renderPost = ({ item }: { item: SocialPost }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.authorContainer}>
          {getPlatformIcon(item.platform)}
          <Text style={styles.author}>{item.author}</Text>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      
      <Text style={styles.content} numberOfLines={3}>
        {item.content}
      </Text>
      
      {item.imageUrl && (
        <Image 
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      
      <Text style={styles.likes}>{item.likes} likes</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles[size]]}>
        <Text style={styles.title}>Social Feed</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles[size]]}>
        <Text style={styles.title}>Social Feed</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles[size]]}>
      <View style={styles.header}>
        <Text style={styles.title}>Social Feed</Text>
        <TouchableOpacity onPress={fetchPosts}>
          <RefreshCw size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {posts.length === 0 ? (
        <Text style={styles.emptyText}>No posts to display</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
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
    height: 280,
  },
  medium: {
    height: 400,
  },
  large: {
    height: 500,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    marginTop: 16,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  postContainer: {
    marginBottom: 12,
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
  },
  author: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  content: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  likes: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  }
}); 