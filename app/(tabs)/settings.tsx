import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { 
  Sun, 
  Moon, 
  Trash2, 
  HelpCircle, 
  Info, 
  Mail, 
  Github,
  ExternalLink,
  User,
  LogOut,
  Plug,
  Shield
} from 'lucide-react-native';
import { useDashboardStore } from '@/store/dashboard-store';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';
import * as Linking from 'expo-linking';

export default function SettingsScreen() {
  const router = useRouter();
  const { userSettings, updateUserSettings } = useDashboardStore();
  const { isAuthenticated, user, signOut } = useAuthStore();
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  const handleThemeToggle = (value: boolean) => {
    // In a real app, we would implement dark mode
    // For this demo, we'll just show an alert
    Alert.alert(
      "Feature Not Available",
      "Dark mode is not implemented in this demo.",
      [{ text: "OK" }]
    );
  };
  
  const handleResetApp = () => {
    Alert.alert(
      "Reset App",
      "This will delete all your dashboards and settings. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            // In a real app, we would implement a reset function
            Alert.alert("App Reset", "This is a demo. App reset not implemented.");
          }
        }
      ]
    );
  };
  
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      // In a real app, we would navigate to the login screen
      Alert.alert("Signed Out", "You have been signed out successfully.");
      setIsSigningOut(false);
    } catch (error) {
      setIsSigningOut(false);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };
  
  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen 
        options={{
          title: "Settings",
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        {isAuthenticated && user && (
          <View style={styles.profileSection}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitial}>
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name || "User"}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
            </View>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                {userSettings.theme === "light" ? (
                  <Sun size={20} color={colors.primary} />
                ) : (
                  <Moon size={20} color={colors.primary} />
                )}
              </View>
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={userSettings.theme === "dark"}
              onValueChange={handleThemeToggle}
              trackColor={{ false: colors.lightGray, true: `${colors.primary}80` }}
              thumbColor={userSettings.theme === "dark" ? colors.primary : "#f4f3f4"}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Services</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push("/services")}
          >
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Plug size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingText}>Manage Services</Text>
            </View>
            <ExternalLink size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert("Privacy Settings", "Manage how your data is used and shared.")}
          >
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Shield size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingText}>Privacy Settings</Text>
            </View>
            <ExternalLink size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push("/profile")}
          >
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <User size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingText}>Edit Profile</Text>
            </View>
            <ExternalLink size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          
          {isAuthenticated && (
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleSignOut}
              disabled={isSigningOut}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.settingIconContainer, styles.dangerIcon]}>
                  <LogOut size={20} color={colors.danger} />
                </View>
                <Text style={styles.settingText}>Sign Out</Text>
              </View>
              <ExternalLink size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleResetApp}
          >
            <View style={styles.settingInfo}>
              <View style={[styles.settingIconContainer, styles.dangerIcon]}>
                <Trash2 size={20} color={colors.danger} />
              </View>
              <Text style={styles.settingText}>Reset App</Text>
            </View>
            <ExternalLink size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert("Help & Support", "This is a demo app. No actual support available.")}
          >
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <HelpCircle size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingText}>Help & Support</Text>
            </View>
            <ExternalLink size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert("About", "Personal Dashboard App\nVersion 1.0.0\n\nA customizable dashboard for all your daily information powered by Firecrawl AI and Supabase.")}
          >
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Info size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingText}>About This App</Text>
            </View>
            <ExternalLink size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => openLink("mailto:support@example.com")}
          >
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Mail size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingText}>Contact Us</Text>
            </View>
            <ExternalLink size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => openLink("https://github.com")}
          >
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Github size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingText}>GitHub Repository</Text>
            </View>
            <ExternalLink size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Personal Dashboard App</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
          <Text style={styles.footerPoweredBy}>Powered by Firecrawl AI</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dangerIcon: {
    backgroundColor: `${colors.danger}15`,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
  },
  footer: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  footerPoweredBy: {
    fontSize: 12,
    color: colors.primary,
  }
});