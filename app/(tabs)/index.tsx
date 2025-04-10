import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Plus, LayoutGrid } from 'lucide-react-native';
import { useDashboardStore } from '@/store/dashboard-store';
import { WidgetRenderer } from '@/components/WidgetRenderer';
import { AddWidgetModal } from '@/components/AddWidgetModal';
import { EditDashboardModal } from '@/components/EditDashboardModal';
import { colors } from '@/constants/colors';
import { WidgetType } from '@/types/dashboard';

export default function DashboardScreen() {
  const { 
    dashboards, 
    activeDashboardId, 
    addWidget, 
    addDashboard, 
    removeDashboard, 
    renameDashboard, 
    setActiveDashboard 
  } = useDashboardStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [addWidgetModalVisible, setAddWidgetModalVisible] = useState(false);
  const [editDashboardModalVisible, setEditDashboardModalVisible] = useState(false);
  
  const activeDashboard = dashboards.find(d => d.id === activeDashboardId) || dashboards[0];
  
  // Sort widgets by position
  const sortedWidgets = [...(activeDashboard?.widgets || [])].sort((a, b) => a.position - b.position);
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  const handleAddWidget = (type: WidgetType, size: "small" | "medium" | "large") => {
    if (activeDashboard) {
      addWidget(activeDashboard.id, {
        type,
        title: type.charAt(0).toUpperCase() + type.slice(1),
        size
      });
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen 
        options={{
          headerTitle: activeDashboard?.name || "Dashboard",
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => setEditDashboardModalVisible(true)}
              >
                <LayoutGrid size={22} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => setAddWidgetModalVisible(true)}
              >
                <Plus size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {sortedWidgets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No widgets yet</Text>
            <Text style={styles.emptyStateDescription}>
              Tap the + button to add your first widget
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => setAddWidgetModalVisible(true)}
            >
              <Plus size={20} color="white" />
              <Text style={styles.emptyStateButtonText}>Add Widget</Text>
            </TouchableOpacity>
          </View>
        ) : (
          sortedWidgets.map(widget => (
            <WidgetRenderer 
              key={widget.id} 
              widget={widget} 
              dashboardId={activeDashboard.id} 
            />
          ))
        )}
      </ScrollView>
      
      <AddWidgetModal 
        visible={addWidgetModalVisible}
        onClose={() => setAddWidgetModalVisible(false)}
        onAddWidget={handleAddWidget}
      />
      
      <EditDashboardModal 
        visible={editDashboardModalVisible}
        onClose={() => setEditDashboardModalVisible(false)}
        dashboards={dashboards}
        activeDashboardId={activeDashboardId}
        onAddDashboard={addDashboard}
        onRenameDashboard={renameDashboard}
        onRemoveDashboard={removeDashboard}
        onSelectDashboard={setActiveDashboard}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  }
});