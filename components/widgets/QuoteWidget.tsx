import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RefreshCw } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface QuoteWidgetProps {
  size: "small" | "medium" | "large";
}

// Mock quotes for demo purposes
const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein"
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius"
  }
];

export const QuoteWidget: React.FC<QuoteWidgetProps> = ({ size }) => {
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);
  const [loading, setLoading] = useState(true);
  
  const fetchQuote = () => {
    setLoading(true);
    
    // In a real app, we would fetch from a quotes API
    // For now, we'll use mock data with a delay to simulate API call
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
      setLoading(false);
    }, 500);
  };
  
  useEffect(() => {
    fetchQuote();
  }, []);
  
  return (
    <View style={[styles.container, styles[size]]}>
      <View style={styles.header}>
        <Text style={styles.title}>Quote of the Day</Text>
        <TouchableOpacity onPress={fetchQuote} disabled={loading}>
          <RefreshCw 
            size={18} 
            color={colors.textSecondary}
            style={loading ? styles.rotating : undefined}
          />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>"{quote?.text}"</Text>
          <Text style={styles.quoteAuthor}>— {quote?.author}</Text>
        </View>
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
    height: 120,
  },
  medium: {
    height: 180,
  },
  large: {
    height: 240,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  quoteAuthor: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  rotating: {
    opacity: 0.7,
  }
});