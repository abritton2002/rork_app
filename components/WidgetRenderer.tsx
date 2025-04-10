import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Widget } from '@/types/dashboard';
import { ClockWidget } from './widgets/ClockWidget';
import { WeatherWidget } from './widgets/WeatherWidget';
import { TasksWidget } from './widgets/TasksWidget';
import { NotesWidget } from './widgets/NotesWidget';
import { QuoteWidget } from './widgets/QuoteWidget';
import { LinksWidget } from './widgets/LinksWidget';
import { NewsWidget } from './widgets/NewsWidget';
import { SocialWidget } from './widgets/SocialWidget';
import { RedditWidget } from './widgets/RedditWidget';
import { HealthWidget } from './widgets/HealthWidget';
import { StocksWidget } from './widgets/StocksWidget';
import { EmailWidget } from './widgets/EmailWidget';
import { NewsSearchWidget } from './widgets/NewsSearchWidget';
import { useDashboardStore } from '@/store/dashboard-store';
import { colors } from '@/constants/colors';

interface WidgetRendererProps {
  widget: Widget;
  dashboardId: string;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ 
  widget,
  dashboardId
}) => {
  const updateWidget = useDashboardStore(state => state.updateWidget);
  
  const handleWidgetUpdate = (updates: any) => {
    updateWidget(dashboardId, widget.id, { 
      settings: { ...widget.settings, ...updates } 
    });
  };
  
  const renderWidget = () => {
    switch (widget.type) {
      case 'clock':
        return <ClockWidget size={widget.size} />;
        
      case 'weather':
        return (
          <WeatherWidget 
            size={widget.size} 
            settings={widget.settings}
          />
        );
        
      case 'tasks':
        return (
          <TasksWidget 
            size={widget.size} 
            settings={widget.settings}
            onUpdate={(tasks) => handleWidgetUpdate({ tasks })}
          />
        );
        
      case 'notes':
        return (
          <NotesWidget 
            size={widget.size} 
            settings={widget.settings}
            onUpdate={(content) => handleWidgetUpdate({ content })}
          />
        );
        
      case 'quote':
        return <QuoteWidget size={widget.size} />;
        
      case 'links':
        return (
          <LinksWidget 
            size={widget.size} 
            settings={widget.settings}
          />
        );
        
      case 'news':
        return (
          <NewsWidget 
            size={widget.size} 
            settings={widget.settings}
          />
        );
        
      case 'news-search':
        return (
          <NewsSearchWidget
            size={widget.size}
            settings={widget.settings}
            onUpdate={(updates) => handleWidgetUpdate(updates)}
          />
        );
        
      case 'social':
        return (
          <SocialWidget 
            size={widget.size} 
            settings={widget.settings}
          />
        );
        
      case 'reddit':
        return (
          <RedditWidget 
            size={widget.size} 
            settings={widget.settings}
          />
        );
        
      case 'health':
        return (
          <HealthWidget 
            size={widget.size} 
            settings={widget.settings}
          />
        );
        
      case 'stocks':
        return (
          <StocksWidget 
            size={widget.size} 
            settings={widget.settings}
          />
        );
        
      case 'email':
        return (
          <EmailWidget 
            size={widget.size} 
            settings={widget.settings}
          />
        );
        
      default:
        return (
          <View style={[styles.container, styles[widget.size]]}>
            <Text style={styles.errorText}>Unknown widget type: {widget.type}</Text>
          </View>
        );
    }
  };
  
  return (
    <View style={styles.widgetWrapper}>
      {renderWidget()}
    </View>
  );
};

const styles = StyleSheet.create({
  widgetWrapper: {
    marginBottom: 16,
    width: '100%',
  },
  container: {
    padding: 16,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  errorText: {
    color: colors.danger,
    textAlign: 'center',
  }
});