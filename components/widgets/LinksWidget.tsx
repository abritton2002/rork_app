import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { ExternalLink } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface Link {
  id: string;
  title: string;
  url: string;
}

interface LinksWidgetProps {
  size: "small" | "medium" | "large";
  settings?: {
    links?: Link[];
  };
}

// Default links for demo
const defaultLinks: Link[] = [
  { id: '1', title: 'Google', url: 'https://google.com' },
  { id: '2', title: 'GitHub', url: 'https://github.com' },
  { id: '3', title: 'Stack Overflow', url: 'https://stackoverflow.com' },
];

export const LinksWidget: React.FC<LinksWidgetProps> = ({ 
  size,
  settings = { links: defaultLinks }
}) => {
  const links = settings.links || defaultLinks;
  
  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };
  
  return (
    <View style={[styles.container, styles[size]]}>
      <Text style={styles.title}>Quick Links</Text>
      
      <ScrollView style={styles.linksList}>
        {links.map(link => (
          <TouchableOpacity
            key={link.id}
            style={styles.linkItem}
            onPress={() => openLink(link.url)}
          >
            <Text style={styles.linkTitle} numberOfLines={1}>{link.title}</Text>
            <ExternalLink size={16} color={colors.primary} />
          </TouchableOpacity>
        ))}
        
        {links.length === 0 && (
          <Text style={styles.emptyText}>No links added</Text>
        )}
      </ScrollView>
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
    height: 150,
  },
  medium: {
    height: 220,
  },
  large: {
    height: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.text,
  },
  linksList: {
    flex: 1,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  linkTitle: {
    fontSize: 16,
    color: colors.primary,
    flex: 1,
    marginRight: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 16,
  }
});