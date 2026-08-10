import React, { useContext, useState, useRef } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated
} from 'react-native';

import { ThemeContext } from '@/theme/ThemeContext';

const HashMapVisual = () => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [input, setInput] = useState('');
  const [map, setMap] = useState<Record<number, number>>({});
  const scale = useRef(new Animated.Value(1)).current;

  // ─────────────────────────────────────────────
  // ADD
  // ─────────────────────────────────────────────

  const addElement = () => {
    if (!input.trim()) return;

    const num = Number(input);

    if (Number.isNaN(num)) return;

    setMap(prev => ({
        ...prev,
        [num]: (prev[num] ?? 0) + 1,
    }));
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setInput('');
  };

  // ─────────────────────────────────────────────
  // REMOVE
  // ─────────────────────────────────────────────

  const removeElement = () => {
    if (!input.trim()) return;

    const num = Number(input);

    setMap(prev => {
      if (!prev[num]) return prev;

      const updated = { ...prev };
      updated[num]--;

      if (updated[num] <= 0) {
        delete updated[num];
      }
       Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
      return updated;
    });

    setInput('');
  };

  // ─────────────────────────────────────────────
  // CLEAR
  // ─────────────────────────────────────────────

  const clearMap = () => {
    setMap({});
  };

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────

  return (
    <View style={styles.container}>

      <TextInput
        style={styles.input}
        placeholder="Enter number"
        placeholderTextColor={theme.textTertiary}
        keyboardType="numeric"
        keyboardAppearance="dark"
        value={input}
        onChangeText={setInput}
      />

      <View style={styles.actionsRow}>

        <Pressable
          style={[styles.button, styles.addButton]}
          onPress={addElement}
        >
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.removeButton]}
          onPress={removeElement}
        >
          <Text style={styles.buttonText}>Remove</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.clearButton]}
          onPress={clearMap}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </Pressable>

      </View>

      <ScrollView
        contentContainerStyle={styles.mapContainer}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(map).length === 0 ? (
          <Text style={styles.emptyText}>
            No elements added yet
          </Text>
        ) : (
          Object.entries(map).map(([key, freq]) => (
            <Animated.View key={key} style={[styles.box, { transform: [{ scale }] }]}>
                <Text style={styles.keyText}>
                  {key}
                </Text>
                <View style={styles.divider} />
                <Text style={styles.freqText}>
                  Freq : {freq}
                </Text>
            </Animated.View>
          ))
        )}
      </ScrollView>

    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.background,
    },

    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 14,
      marginBottom: 16,
      fontSize: 16,
      color: theme.text,
      backgroundColor: theme.inputBackground,
    },

    actionsRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 20,
    },

    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },

    addButton: {
      backgroundColor: '#3b82f6',
    },

    removeButton: {
      backgroundColor: '#ef4444',
    },

    clearButton: {
      backgroundColor: '#8b5cf6',
    },

    buttonText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '700',
    },

    mapContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },

    box: {
      width: 110,
      minHeight: 110,
      padding: 10,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16,
      backgroundColor: theme.inputBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },

    keyText: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.text,
    },

    divider: {
      width: '70%',
      height: 1,
      marginVertical: 10,
      backgroundColor: theme.border,
    },

    freqText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },

    emptyText: {
      marginTop: 30,
      fontSize: 16,
      color: theme.text,
      opacity: 0.6,
    },
  });

export default HashMapVisual;