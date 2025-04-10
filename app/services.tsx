import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Newspaper, 
  Twitter, 
  MessageSquare, 
  Activity,
  TrendingUp,
  Mail,
  Check,
  AlertCircle,
  RefreshCw
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useServicesStore } from '@/store/services-store';
import { useAuthStore } from '@/store/auth-store';
import { ServiceType } from '@/types/dashboard';

export default function ServicesScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { services, isLoading, fetchServices, connectService, disconnectService } = useServicesStore();
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchServices(user.id);
    }
  }, [user]);
  
  const handleRefresh = async () => {
    if (!user) return;
    
    setRefreshing(true);
    await fetchServices(user.id);
    setRefreshing(false);
  };
  
  const handleToggleService = async (serviceType: ServiceType, isConnected: boolean, existingId?: string) => {
    try {
      if (isConnected) {
        if (existingId) {
          await disconnectService(existingId);
        }
      } else {
        // For demo purposes, we'll just connect without actual OAuth
        // In a real app, this would launch the OAuth flow
        
        // Show a loading indicator
        Alert.alert(
          "Connecting Service",
          "This is a demo. In a real app, this would launch the OAuth flow.",
          [
            {
              text: "Connect",
              onPress: () => {
                // Connect the service
                connectService({
                  type: serviceType,
                  name: getServiceName(serviceType),
                  settings: getDefaultSettings(serviceType)
                });
              }
            },
            {
              text: "Cancel",
              style: "cancel"
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update service connection.");
    }
  };
  
  const getServiceName = (type: ServiceType): string => {
    switch (type) {
      case "news": return "News API";
      case "twitter": return "Twitter";
      case "facebook": return "Facebook";
      case "instagram": return "Instagram";
      case "reddit": return "Reddit";
      case "fitbit": return "Fitbit";
      case "apple_health": return "Apple Health";
      case "google_fit": return "Google Fit";
      case "stocks": return "Stock Market";
      case "gmail": return "Gmail";
      case "outlook": return "Outlook";
      default: return type;
    }
  };
  
  const getDefaultSettings = (type: ServiceType): Record<string, any> => {
    switch (type) {
      case "news":
        return { sources: ["bbc-news", "cnn", "the-verge"] };
      case "reddit":
        return { subreddits: ["technology", "worldnews", "science"] };
      case "stocks":
        return { symbols: ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"] };
      default:
        return {};
    }
  };
  
  const getServiceIcon = (type: ServiceType) => {
    switch (type) {
      case "news":
        return <Newspaper size={24} color={colors.primary} />;
      case "twitter":
      case "facebook":
      case "instagram":
        return <Twitter size={24} color={colors.primary} />;
      case "reddit":
        return <MessageSquare size={24} color={colors.primary} />;
      case "fitbit":
      case "apple_health":
      case "google_fit":
        return <Activity size={24} color={colors.primary} />;
      case "stocks":
        return <TrendingUp size={24} color={colors.primary} />;
      case "gmail":
      case "outlook":
        return <Mail size={24} color={colors.primary} />;
      default:
        return null;
    }
  };
  
  // Available services to connect
  const availableServices: { type: ServiceType; name: string }[] = [
    { type: "news", name: "News API" },
    { type: "reddit", name: "Reddit" },
    { type: "twitter", name: "Twitter" },
    { type: "fitbit", name: "Fitbit" },
    { type: "stocks", name: "Stock Market" },
    { type: "gmail", name: "Gmail" }
  ];
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
      <Stack.Screen 
        options={{
          title: "Connected Services",
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw 
                size={20} 
                color={colors.text}
                style={refreshing ? styles.rotating : undefined}
              />
            </TouchableOpacity>
          )
        }}
      />
      
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading services...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <Text style={styles.description}>
            Connect your accounts to display personalized data in your dashboard.
          </Text>
          
          {availableServices.map(service => {
            const existingService = services.find(s => s.type === service.type);
            const isConnected = existingService?.isConnected || false;
            
            return (
              <View key={service.type} style={styles.serviceItem}>
                <View style={styles.serviceInfo}>
                  <View style={styles.serviceIconContainer}>
                    {getServiceIcon(service.type)}
                  </View>
                  <View style={styles.serviceDetails}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <View style={styles.serviceStatus}>
                      {isConnected ? (
                        <>
                          <Check size={14} color={colors.success} />
                          <Text style={[styles.serviceStatusText, styles.connectedText]}>
                            Connected
                          </Text>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={14} color={colors.textSecondary} />
                          <Text style={styles.serviceStatusText}>
                            Not connected
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>
                
                <Switch
                  value={isConnected}
                  onValueChange={(value) => 
                    handleToggleService(service.type, value, existingService?.id)
                  }
                  trackColor={{ false: colors.lightGray, true: `${colors.primary}80` }}
                  thumbColor={isConnected ? colors.primary : "#f4f3f4"}
                />
              </View>
            );
          })}
          
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>About Connected Services</Text>
            <Text style={styles.infoText}>
              Connected services allow your dashboard to display personalized data from your favorite platforms.
              Your data is processed securely using Firecrawl AI.
            </Text>
            <Text style={styles.infoText}>
              You can disconnect a service at any time, which will remove its data from your dashboard.
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
  },
  refreshButton: {
    padding: 8,
  },
  rotating: {
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  serviceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceStatusText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  connectedText: {
    color: colors.success,
  },
  infoSection: {
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 40,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  }
});