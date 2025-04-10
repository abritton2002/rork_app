import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { colors } from '@/constants/colors';

interface NotesWidgetProps {
  size: "small" | "medium" | "large";
  settings?: {
    content?: string;
  };
  onUpdate?: (content: string) => void;
}

export const NotesWidget: React.FC<NotesWidgetProps> = ({ 
  size,
  settings = { content: "" },
  onUpdate
}) => {
  const [content, setContent] = useState(settings.content || "");
  
  const handleContentChange = (text: string) => {
    setContent(text);
    if (onUpdate) {
      onUpdate(text);
    }
  };
  
  // Get the appropriate style based on size
  const getNoteInputStyle = () => {
    switch(size) {
      case "small": return styles.noteInputSmall;
      case "medium": return styles.noteInputMedium;
      case "large": return styles.noteInputLarge;
      default: return styles.noteInputMedium;
    }
  };
  
  return (
    <View style={[styles.container, styles[size]]}>
      <Text style={styles.title}>Notes</Text>
      <TextInput
        style={[styles.noteInput, getNoteInputStyle()]}
        value={content}
        onChangeText={handleContentChange}
        placeholder="Write your notes here..."
        placeholderTextColor={colors.textSecondary}
        multiline
        textAlignVertical="top"
      />
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
  noteInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    backgroundColor: colors.background,
  },
  noteInputSmall: {
    height: 80,
  },
  noteInputMedium: {
    height: 150,
  },
  noteInputLarge: {
    height: 230,
  }
});