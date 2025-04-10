import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  FlatList
} from 'react-native';
import { RefreshCw, Mail, Star, Circle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { firecrawl } from '@/lib/firecrawl';
import { EmailSummary } from '@/types/api';

interface EmailWidgetProps {
  size: "small" | "medium" | "large";
  settings?: {
    provider?: string;
    refreshInterval?: number;
  };
}

export const EmailWidget: React.FC<EmailWidgetProps> = ({ 
  size,
  settings = { 
    provider: "gmail",
    refreshInterval: 10
  }
}) => {
  const [emailData, setEmailData] = useState<EmailSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const fetchEmails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await firecrawl.getEmailSummary(settings.provider);
      
      setEmailData(response.data);
    } catch (err: any) {
      setError("Failed to load emails");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchEmails();
    
    // Set up refresh interval
    const interval = setInterval(() => {
      fetchEmails();
    }, (settings.refreshInterval || 10) * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [settings.provider, settings.refreshInterval]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchEmails();
  };
  
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffMins < 24 * 60) {
      return `${Math.floor(diffMins / 60)}h ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  const renderEmailItem = ({ item }: { item: any }) => (
    <View style={styles.emailItem}>
      <View style={styles.emailStatus}>
        {!item.isRead ? (
          <Circle size={10} fill={colors.primary} color={colors.primary} />
        ) : (
          <View style={styles.readCircle} />
        )}
      </View>
      
      <View style={styles.emailContent}>
        <Text style={styles.emailSender}>{item.sender}</Text>
        <Text 
          style={[styles.emailSubject, !item.isRead && styles.unreadText]} 
          numberOfLines={1}
        >
          {item.subject}
        </Text>
        {size !== "small" && (
          <Text style={styles.emailPreview} numberOfLines={1}>
            {item.preview}
          </Text>
        )}
      </View>
      
      <View style={styles.emailMeta}>
        <Text style={styles.emailTime}>{formatTime(item.receivedAt)}</Text>
        {item.isImportant && (
          <Star size={14} color={colors.warning} fill={colors.warning} />
        )}
      </View>
    </View>
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchEmails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  if (!emailData) {
    return (
      <View style={[styles.container, styles[size], styles.centered]}>
        <Text style={styles.emptyText}>No email data available</Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, styles[size]]}>
      <View style={styles.header}>
        <Text style={styles.title}>Email</Text>
        <TouchableOpacity onPress={handleRefresh} disabled={refreshing}>
          <RefreshCw 
            size={18} 
            color={colors.textSecondary}
            style={refreshing ? styles.rotating : undefined}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <View style={styles.summaryIconContainer}>
            <Mail size={16} color={colors.primary} />
          </View>
          <Text style={styles.summaryText}>
            <Text style={styles.summaryCount}>{emailData.unreadCount}</Text> unread
          </Text>
        </View>
        
        <View style={styles.summaryItem}>
          <View style={styles.summaryIconContainer}>
            <Star size={16} color={colors.warning} />
          </View>
          <Text style={styles.summaryText}>
            <Text style={styles.summaryCount}>{emailData.importantCount}</Text> important
          </Text>
        </View>
      </View>
      
      <FlatList
        data={emailData.recentEmails}
        renderItem={renderEmailItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.emailsList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No recent emails</Text>
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
  summary: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  summaryIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  summaryText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryCount: {
    fontWeight: 'bold',
    color: colors.text,
  },
  emailsList: {
    flexGrow: 1,
  },
  emailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  emailStatus: {
    width: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  readCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  emailContent: {
    flex: 1,
    marginRight: 8,
  },
  emailSender: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  emailSubject: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  unreadText: {
    fontWeight: '600',
    color: colors.text,
  },
  emailPreview: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emailMeta: {
    alignItems: 'flex-end',
  },
  emailTime: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
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