import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { CheckCircle, Circle, Plus, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface TasksWidgetProps {
  size: "small" | "medium" | "large";
  settings?: {
    tasks?: Task[];
  };
  onUpdate?: (tasks: Task[]) => void;
}

export const TasksWidget: React.FC<TasksWidgetProps> = ({ 
  size,
  settings = { tasks: [] },
  onUpdate
}) => {
  const [tasks, setTasks] = useState<Task[]>(settings.tasks || []);
  const [newTaskText, setNewTaskText] = useState("");
  
  const addTask = () => {
    if (!newTaskText.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setNewTaskText("");
    
    if (onUpdate) {
      onUpdate(updatedTasks);
    }
  };
  
  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    
    setTasks(updatedTasks);
    
    if (onUpdate) {
      onUpdate(updatedTasks);
    }
  };
  
  const removeTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    
    if (onUpdate) {
      onUpdate(updatedTasks);
    }
  };
  
  const maxVisibleTasks = size === "small" ? 2 : (size === "medium" ? 4 : 6);
  const visibleTasks = tasks.slice(0, maxVisibleTasks);
  
  const renderTask = ({ item: task }: { item: Task }) => (
    <View key={task.id} style={styles.taskItem}>
      <TouchableOpacity 
        style={styles.taskCheckbox}
        onPress={() => toggleTask(task.id)}
      >
        {task.completed ? (
          <CheckCircle size={20} color={colors.success} />
        ) : (
          <Circle size={20} color={colors.textSecondary} />
        )}
      </TouchableOpacity>
      
      <Text 
        style={[
          styles.taskText, 
          task.completed && styles.taskTextCompleted
        ]}
        numberOfLines={1}
      >
        {task.text}
      </Text>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => removeTask(task.id)}
      >
        <X size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, styles[size]]}>
      <Text style={styles.title}>Tasks</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTaskText}
          onChangeText={setNewTaskText}
          placeholder="Add a task..."
          placeholderTextColor={colors.textSecondary}
          onSubmitEditing={addTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Plus size={20} color={colors.cardBackground} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.taskList}>
        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>No tasks yet</Text>
        ) : (
          <>
            <FlatList
              data={visibleTasks}
              renderItem={renderTask}
              keyExtractor={task => task.id}
              scrollEnabled={false}
              ListFooterComponent={
                tasks.length > maxVisibleTasks ? (
                  <Text style={styles.moreText}>
                    +{tasks.length - maxVisibleTasks} more tasks
                  </Text>
                ) : null
              }
            />
          </>
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
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
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
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  taskCheckbox: {
    marginRight: 8,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 16,
  },
  moreText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 8,
    fontSize: 12,
  }
});