import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  FlatList
} from 'react-native';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { firecrawl } from '@/lib/firecrawl';
import { StockQuote } from '@/types/api';

interface StocksWidgetProps {
  size: "small" | "medium" | "large";
  settings?: {
    symbols?: string[];
    refreshInterval?: number;
  };
}

export const StocksWidget: React.FC<StocksWidgetProps> = ({ 
  size,
  settings = { 
    symbols: ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"],
    refreshInterval: 15
  }
}) => {
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const fetchStocks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await firecrawl.getStockQuotes(settings.symbols);
      
      setStocks(response.data);
    } catch (err: any) {
      setError("Failed to load stock data");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchStocks();
    
    // Set up refresh interval
    const interval = setInterval(() => {
      fetchStocks();
    }, (settings.refreshInterval || 15) * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [settings.symbols, settings.refreshInterval]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchStocks();
  };
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const formatMarketCap = (value: number | undefined): string => {
    if (!value) return '--';
    
    if (value >= 1000000000000) {
      return `${(value / 1000000000000).toFixed(2)}T`;
    }
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(2)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    }
    return value.toString();
  };
  
  // Determine how many stocks to show based on widget size
  const getMaxStocks = () => {
    switch(size) {
      case "small": return 2;
      case "medium": return 3;
      case "large": return 5;
      default: return 3;
    }
  };
  
  // Limit the number of stocks shown based on widget size
  const visibleStocks = stocks.slice(0, getMaxStocks());
  
  const renderStockItem = ({ item }: { item: StockQuote }) => (
    <View style={styles.stockItem}>
      <View style={styles.stockInfo}>
        <Text style={styles.stockSymbol}>{item.symbol}</Text>
        <Text style={styles.stockName} numberOfLines={1}>{item.name}</Text>
      </View>
      
      <View style={styles.stockPrice}>
        <Text style={styles.priceValue}>{formatCurrency(item.price)}</Text>
        <View style={styles.priceChange}>
          {item.change >= 0 ? (
            <TrendingUp size={14} color={colors.success} />
          ) : (
            <TrendingDown size={14} color={colors.danger} />
          )}
          <Text 
            style={[
              styles.changeText,
              { color: item.change >= 0 ? colors.success : colors.danger }
            ]}
          >
            {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
          </Text>
        </View>
      </View>
      
      {size === "large" && (
        <View style={styles.stockDetails}>
          <Text style={styles.detailLabel}>Market Cap</Text>
          <Text style={styles.detailValue}>{formatMarketCap(item.marketCap)}</Text>
        </View>
      )}
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchStocks}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, styles[size]]}>
      <View style={styles.header}>
        <Text style={styles.title}>Stocks</Text>
        <TouchableOpacity onPress={handleRefresh} disabled={refreshing}>
          <RefreshCw 
            size={18} 
            color={colors.textSecondary}
            style={refreshing ? styles.rotating : undefined}
          />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={visibleStocks}
        renderItem={renderStockItem}
        keyExtractor={(item) => item.symbol}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.stocksList}
        scrollEnabled={size === "large"}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No stock data available</Text>
        }
      />
      
      <Text style={styles.lastUpdated}>
        Last updated: {stocks.length > 0 ? new Date(stocks[0].lastUpdated).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : '--'}
      </Text>
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
  stocksList: {
    flexGrow: 1,
  },
  stockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stockInfo: {
    flex: 1,
    marginRight: 12,
  },
  stockSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  stockName: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  stockPrice: {
    alignItems: 'flex-end',
    marginLeft: 8,
    minWidth: 100,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  priceChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  stockDetails: {
    width: 80,
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  detailLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  lastUpdated: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
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