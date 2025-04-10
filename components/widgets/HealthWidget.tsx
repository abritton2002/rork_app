import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Heart, Activity, Moon, Footprints } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface HealthData {
  steps: number;
  heartRate: number;
  sleepHours: number;
  activeMinutes: number;
  date: string;
}

interface HealthWidgetProps {
  size: "small" | "medium" | "large";
  settings?: {
    refreshInterval?: number;
    metrics?: string[];
  };
}

export const HealthWidget: React.FC<HealthWidgetProps> = ({
  size,
  settings = {}
}) => {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call with dummy data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dummyData: HealthData = {
        steps: Math.floor(Math.random() * 5000) + 5000, // 5000-10000 steps
        heartRate: Math.floor(Math.random() * 30) + 60, // 60-90 bpm
        sleepHours: Math.floor(Math.random() * 3) + 6, // 6-9 hours
        activeMinutes: Math.floor(Math.random() * 60) + 30, // 30-90 minutes
        date: new Date().toLocaleDateString()
      };

      setData(dummyData);
    } catch (err) {
      setError('Failed to fetch health data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
    
    const interval = settings.refreshInterval || 300000; // 5 minutes default
    const timer = setInterval(fetchHealthData, interval);
    
    return () => clearInterval(timer);
  }, []);

  const renderMetric = (
    icon: React.ReactNode,
    value: string | number,
    label: string
  ) => (
    <View style={styles.metricContainer}>
      <View style={styles.metricIcon}>{icon}</View>
      <View>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles[size]]}>
        <Text style={styles.title}>Health Overview</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles[size]]}>
        <Text style={styles.title}>Health Overview</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles[size]]}>
      <Text style={styles.title}>Health Overview</Text>
      <Text style={styles.date}>{data?.date}</Text>
      
      <View style={styles.metricsGrid}>
        {renderMetric(
          <Footprints size={24} color={colors.primary} />,
          data?.steps.toLocaleString() || '0',
          'Steps'
        )}
        {renderMetric(
          <Heart size={24} color={colors.danger} />,
          `${data?.heartRate || 0} bpm`,
          'Heart Rate'
        )}
        {renderMetric(
          <Moon size={24} color={colors.info} />,
          `${data?.sleepHours || 0}h`,
          'Sleep'
        )}
        {renderMetric(
          <Activity size={24} color={colors.success} />,
          `${data?.activeMinutes || 0}m`,
          'Active'
        )}
      </View>
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
    marginBottom: 4,
    color: colors.text,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  metricContainer: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  metricIcon: {
    marginRight: 12,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});