import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import { 
  X, 
  Clock, 
  CloudSun, 
  ListChecks, 
  FileText, 
  Quote, 
  Link,
  Newspaper,
  Twitter,
  MessageSquare,
  Activity,
  TrendingUp,
  Mail
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { WidgetType } from '@/types/dashboard';

interface AddWidgetModalProps {
  visible: boolean;
  onClose: () => void;
  onAddWidget: (type: WidgetType, size: "small" | "medium" | "large") => void;
}

interface WidgetOption {
  type: WidgetType;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: "basic" | "external";
}

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({
  visible,
  onClose,
  onAddWidget
}) => {
  const [selectedWidget, setSelectedWidget] = useState<WidgetType | null>(null);
  const [selectedSize, setSelectedSize] = useState<"small" | "medium" | "large">("medium");
  const [activeCategory, setActiveCategory] = useState<"basic" | "external">("basic");
  
  const widgetOptions: WidgetOption[] = [
    // Basic widgets
    {
      type: 'clock',
      title: 'Clock',
      description: 'Display current time and date',
      icon: <Clock size={24} color={colors.primary} />,
      category: "basic"
    },
    {
      type: 'weather',
      title: 'Weather',
      description: 'Show current weather conditions',
      icon: <CloudSun size={24} color={colors.primary} />,
      category: "basic"
    },
    {
      type: 'tasks',
      title: 'Tasks',
      description: 'Manage your to-do list',
      icon: <ListChecks size={24} color={colors.primary} />,
      category: "basic"
    },
    {
      type: 'notes',
      title: 'Notes',
      description: 'Quick notes and reminders',
      icon: <FileText size={24} color={colors.primary} />,
      category: "basic"
    },
    {
      type: 'quote',
      title: 'Quote',
      description: 'Inspirational quotes',
      icon: <Quote size={24} color={colors.primary} />,
      category: "basic"
    },
    {
      type: 'links',
      title: 'Quick Links',
      description: 'Access your favorite websites',
      icon: <Link size={24} color={colors.primary} />,
      category: "basic"
    },
    
    // External service widgets
    {
      type: 'news',
      title: 'News',
      description: 'Latest news from your favorite sources',
      icon: <Newspaper size={24} color={colors.primary} />,
      category: "external"
    },
    {
      type: 'social',
      title: 'Social Media',
      description: 'Updates from your social accounts',
      icon: <Twitter size={24} color={colors.primary} />,
      category: "external"
    },
    {
      type: 'reddit',
      title: 'Reddit',
      description: 'Posts from your favorite subreddits',
      icon: <MessageSquare size={24} color={colors.primary} />,
      category: "external"
    },
    {
      type: 'health',
      title: 'Health',
      description: 'Track your fitness and health data',
      icon: <Activity size={24} color={colors.primary} />,
      category: "external"
    },
    {
      type: 'stocks',
      title: 'Stocks',
      description: 'Monitor your stock portfolio',
      icon: <TrendingUp size={24} color={colors.primary} />,
      category: "external"
    },
    {
      type: 'email',
      title: 'Email',
      description: 'Check your inbox at a glance',
      icon: <Mail size={24} color={colors.primary} />,
      category: "external"
    }
  ];
  
  const filteredWidgets = widgetOptions.filter(widget => widget.category === activeCategory);
  
  const handleAddWidget = () => {
    if (selectedWidget) {
      onAddWidget(selectedWidget, selectedSize);
      resetAndClose();
    }
  };
  
  const resetAndClose = () => {
    setSelectedWidget(null);
    setSelectedSize("medium");
    setActiveCategory("basic");
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={resetAndClose}
    >
      <TouchableWithoutFeedback onPress={resetAndClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Widget</Text>
                <TouchableOpacity onPress={resetAndClose}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              {!selectedWidget ? (
                <>
                  <View style={styles.categoryTabs}>
                    <TouchableOpacity
                      style={[
                        styles.categoryTab,
                        activeCategory === "basic" && styles.activeTab
                      ]}
                      onPress={() => setActiveCategory("basic")}
                    >
                      <Text 
                        style={[
                          styles.categoryTabText,
                          activeCategory === "basic" && styles.activeTabText
                        ]}
                      >
                        Basic
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.categoryTab,
                        activeCategory === "external" && styles.activeTab
                      ]}
                      onPress={() => setActiveCategory("external")}
                    >
                      <Text 
                        style={[
                          styles.categoryTabText,
                          activeCategory === "external" && styles.activeTabText
                        ]}
                      >
                        External Services
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <ScrollView style={styles.widgetList}>
                    {filteredWidgets.map(option => (
                      <TouchableOpacity
                        key={option.type}
                        style={styles.widgetOption}
                        onPress={() => setSelectedWidget(option.type)}
                      >
                        <View style={styles.widgetIconContainer}>
                          {option.icon}
                        </View>
                        <View style={styles.widgetInfo}>
                          <Text style={styles.widgetTitle}>{option.title}</Text>
                          <Text style={styles.widgetDescription}>{option.description}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </>
              ) : (
                <View style={styles.sizeSelector}>
                  <Text style={styles.sizeTitle}>Select Widget Size</Text>
                  
                  <View style={styles.sizeOptions}>
                    <TouchableOpacity
                      style={[
                        styles.sizeOption,
                        selectedSize === "small" && styles.sizeOptionSelected
                      ]}
                      onPress={() => setSelectedSize("small")}
                    >
                      <View style={styles.sizePreview}>
                        <View style={styles.sizePreviewSmall} />
                      </View>
                      <Text style={styles.sizeText}>Small</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.sizeOption,
                        selectedSize === "medium" && styles.sizeOptionSelected
                      ]}
                      onPress={() => setSelectedSize("medium")}
                    >
                      <View style={styles.sizePreview}>
                        <View style={styles.sizePreviewMedium} />
                      </View>
                      <Text style={styles.sizeText}>Medium</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.sizeOption,
                        selectedSize === "large" && styles.sizeOptionSelected
                      ]}
                      onPress={() => setSelectedSize("large")}
                    >
                      <View style={styles.sizePreview}>
                        <View style={styles.sizePreviewLarge} />
                      </View>
                      <Text style={styles.sizeText}>Large</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={handleAddWidget}
                  >
                    <Text style={styles.addButtonText}>Add Widget</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  categoryTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  categoryTabText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  widgetList: {
    padding: 16,
  },
  widgetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  widgetIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    marginRight: 16,
  },
  widgetInfo: {
    flex: 1,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  widgetDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sizeSelector: {
    padding: 16,
  },
  sizeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  sizeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  sizeOption: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sizeOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  sizePreview: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  sizePreviewSmall: {
    width: 40,
    height: 20,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  sizePreviewMedium: {
    width: 50,
    height: 30,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  sizePreviewLarge: {
    width: 60,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  sizeText: {
    fontSize: 14,
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});