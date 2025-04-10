import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  TouchableWithoutFeedback,
  FlatList
} from 'react-native';
import { X, Edit2, Trash2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Dashboard } from '@/types/dashboard';

interface EditDashboardModalProps {
  visible: boolean;
  onClose: () => void;
  dashboards: Dashboard[];
  activeDashboardId: string | null;
  onAddDashboard: (name: string) => void;
  onRenameDashboard: (id: string, name: string) => void;
  onRemoveDashboard: (id: string) => void;
  onSelectDashboard: (id: string) => void;
}

export const EditDashboardModal: React.FC<EditDashboardModalProps> = ({
  visible,
  onClose,
  dashboards,
  activeDashboardId,
  onAddDashboard,
  onRenameDashboard,
  onRemoveDashboard,
  onSelectDashboard
}) => {
  const [newDashboardName, setNewDashboardName] = useState("");
  const [editingDashboard, setEditingDashboard] = useState<{id: string, name: string} | null>(null);
  
  const handleAddDashboard = () => {
    if (newDashboardName.trim()) {
      onAddDashboard(newDashboardName.trim());
      setNewDashboardName("");
    }
  };
  
  const handleSaveEdit = () => {
    if (editingDashboard && editingDashboard.name.trim()) {
      onRenameDashboard(editingDashboard.id, editingDashboard.name.trim());
      setEditingDashboard(null);
    }
  };
  
  const startEditing = (dashboard: Dashboard) => {
    setEditingDashboard({ id: dashboard.id, name: dashboard.name });
  };
  
  const cancelEditing = () => {
    setEditingDashboard(null);
  };
  
  const handleRemoveDashboard = (id: string) => {
    // Prevent removing the last dashboard
    if (dashboards.length <= 1) {
      return;
    }
    onRemoveDashboard(id);
  };
  
  const handleSelectDashboard = (id: string) => {
    onSelectDashboard(id);
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Manage Dashboards</Text>
                <TouchableOpacity onPress={onClose}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.addDashboardContainer}>
                <TextInput
                  style={styles.input}
                  value={newDashboardName}
                  onChangeText={setNewDashboardName}
                  placeholder="New dashboard name"
                  placeholderTextColor={colors.textSecondary}
                />
                <TouchableOpacity 
                  style={[
                    styles.addButton,
                    !newDashboardName.trim() && styles.addButtonDisabled
                  ]}
                  onPress={handleAddDashboard}
                  disabled={!newDashboardName.trim()}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={dashboards}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.dashboardItem}>
                    {editingDashboard && editingDashboard.id === item.id ? (
                      <View style={styles.editContainer}>
                        <TextInput
                          style={styles.editInput}
                          value={editingDashboard.name}
                          onChangeText={(text) => setEditingDashboard({ ...editingDashboard, name: text })}
                          autoFocus
                        />
                        <View style={styles.editActions}>
                          <TouchableOpacity 
                            style={styles.editAction}
                            onPress={handleSaveEdit}
                          >
                            <Text style={styles.saveText}>Save</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={styles.editAction}
                            onPress={cancelEditing}
                          >
                            <Text style={styles.cancelText}>Cancel</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <>
                        <TouchableOpacity 
                          style={[
                            styles.dashboardName,
                            item.id === activeDashboardId && styles.activeDashboard
                          ]}
                          onPress={() => handleSelectDashboard(item.id)}
                        >
                          <Text 
                            style={[
                              styles.dashboardNameText,
                              item.id === activeDashboardId && styles.activeDashboardText
                            ]}
                          >
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                        
                        <View style={styles.dashboardActions}>
                          <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => startEditing(item)}
                          >
                            <Edit2 size={18} color={colors.textSecondary} />
                          </TouchableOpacity>
                          
                          <TouchableOpacity 
                            style={[
                              styles.actionButton,
                              dashboards.length <= 1 && styles.actionButtonDisabled
                            ]}
                            onPress={() => handleRemoveDashboard(item.id)}
                            disabled={dashboards.length <= 1}
                          >
                            <Trash2 
                              size={18} 
                              color={dashboards.length <= 1 ? colors.lightGray : colors.danger} 
                            />
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </View>
                )}
                contentContainerStyle={styles.dashboardList}
              />
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
  addDashboardContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  addButtonDisabled: {
    backgroundColor: colors.lightGray,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  dashboardList: {
    padding: 16,
  },
  dashboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dashboardName: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  activeDashboard: {
    backgroundColor: `${colors.primary}20`,
  },
  dashboardNameText: {
    fontSize: 16,
    color: colors.text,
  },
  activeDashboardText: {
    fontWeight: '600',
    color: colors.primary,
  },
  dashboardActions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    borderRadius: 18,
    backgroundColor: colors.background,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  editContainer: {
    flex: 1,
  },
  editInput: {
    height: 40,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: colors.text,
    marginBottom: 8,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editAction: {
    marginLeft: 12,
  },
  saveText: {
    color: colors.primary,
    fontWeight: '600',
  },
  cancelText: {
    color: colors.textSecondary,
  }
});