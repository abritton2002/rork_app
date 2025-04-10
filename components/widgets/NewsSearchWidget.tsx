import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Search, RefreshCw } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface SearchResult {
  title: string;
  description: string;
  url: string;
}

interface NewsSearchWidgetProps {
  size: "small" | "medium" | "large";
  settings?: {
    query?: string;
    refreshInterval?: number;
  };
  onUpdate?: (settings: any) => void;
}

export const NewsSearchWidget: React.FC<NewsSearchWidgetProps> = ({
  size,
  settings = {},
  onUpdate
}) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(settings.query || "");
  
  const fetchResults = async () => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Use Firecrawl's search capability
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          limit: 10,
          scrapeOptions: {
            formats: ['markdown'],
            onlyMainContent: true
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await response.json();
      
      // Transform the results to match our interface
      const transformedResults = data.results.map((result: any) => ({
        title: result.title || 'Untitled',
        description: result.description || result.snippet || 'No description available',
        url: result.url
      }));
      
      setResults(transformedResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch results');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (searchQuery.trim()) {
      fetchResults();
    }
    
    const interval = settings.refreshInterval || 300000; // 5 minutes default
    const timer = setInterval(fetchResults, interval);
    
    return () => clearInterval(timer);
  }, [searchQuery]);
  
  const handleSearch = () => {
    if (onUpdate) {
      onUpdate({ query: searchQuery });
    }
    fetchResults();
  };
  
  const maxVisibleResults = size === "small" ? 2 : (size === "medium" ? 3 : 4);
  
  const renderItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => {
        // Handle link opening with your preferred method
        // For example, using Linking from react-native
        // Linking.openURL(item.url);
      }}
    >
      <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.resultDescription} numberOfLines={2}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.container, styles[size]]}>
      <Text style={styles.title}>News Search</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Enter search query..."
          placeholderTextColor={colors.textSecondary}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Search size={20} color={colors.cardBackground} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : results.length === 0 ? (
          <Text style={styles.emptyText}>
            {searchQuery.trim() ? 'No results found' : 'Enter a search query to begin'}
          </Text>
        ) : (
          <>
            <FlatList
              data={results.slice(0, maxVisibleResults)}
              renderItem={renderItem}
              keyExtractor={(item) => item.url}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
            {results.length > maxVisibleResults && (
              <Text style={styles.moreText}>
                +{results.length - maxVisibleResults} more results
              </Text>
            )}
          </>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={fetchResults}
      >
        <RefreshCw size={16} color={colors.textSecondary} />
      </TouchableOpacity>
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
    height: 280,
  },
  large: {
    height: 360,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    color: colors.text,
  },
  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  resultItem: {
    paddingVertical: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    marginTop: 16,
  },
  moreText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 8,
    fontSize: 12,
  },
  refreshButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  }
}); 