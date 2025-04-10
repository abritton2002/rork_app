import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Cloud, CloudRain, Sun, Snowflake } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Platform } from 'react-native';
import * as Location from 'expo-location';

interface WeatherWidgetProps {
  size: "small" | "medium" | "large";
  settings?: {
    location?: string;
    unit?: "celsius" | "fahrenheit";
  };
}

// Mock weather data for demo purposes
const mockWeatherData = {
  temp: 22,
  condition: "sunny",
  location: "San Francisco",
  humidity: 65,
  wind: 12,
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ 
  size,
  settings = { location: "auto", unit: "celsius" }
}) => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        
        // In a real app, we would fetch from a weather API
        // For now, we'll use mock data with a delay to simulate API call
        
        // If location is set to auto, we would get the user's location
        if (settings.location === "auto" && Platform.OS !== "web") {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            setError("Permission to access location was denied");
            setLoading(false);
            return;
          }
        }
        
        // Simulate API delay
        setTimeout(() => {
          setWeather(mockWeatherData);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        setError("Failed to fetch weather data");
        setLoading(false);
      }
    };
    
    fetchWeather();
  }, [settings.location]);
  
  const getWeatherIcon = () => {
    if (!weather) return null;
    
    switch (weather.condition) {
      case "sunny":
        return <Sun size={32} color={colors.warning} />;
      case "cloudy":
        return <Cloud size={32} color={colors.lightGray} />;
      case "rainy":
        return <CloudRain size={32} color={colors.info} />;
      case "snowy":
        return <Snowflake size={32} color={colors.info} />;
      default:
        return <Sun size={32} color={colors.warning} />;
    }
  };
  
  const formatTemperature = (temp: number) => {
    if (settings.unit === "fahrenheit") {
      return `${Math.round((temp * 9/5) + 32)}°F`;
    }
    return `${temp}°C`;
  };
  
  if (loading) {
    return (
      <View style={[styles.container, styles[size], styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={[styles.container, styles[size], styles.centered]}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }
  
  if (!weather) {
    return (
      <View style={[styles.container, styles[size], styles.centered]}>
        <Text>No weather data available</Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, styles[size]]}>
      <View style={styles.header}>
        <Text style={styles.location}>{weather.location}</Text>
      </View>
      
      <View style={styles.content}>
        {getWeatherIcon()}
        <Text style={styles.temperature}>{formatTemperature(weather.temp)}</Text>
      </View>
      
      {size !== "small" && (
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Humidity</Text>
            <Text style={styles.detailValue}>{weather.humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Wind</Text>
            <Text style={styles.detailValue}>{weather.wind} km/h</Text>
          </View>
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
    height: 100,
  },
  medium: {
    height: 150,
  },
  large: {
    height: 200,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  temperature: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
  }
});