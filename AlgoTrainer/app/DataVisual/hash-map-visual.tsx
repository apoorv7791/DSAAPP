import React, { useContext, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    TextInput,
    View,
    Text,
    ScrollView,
} from 'react-native';

import { ThemeContext } from '@/theme/ThemeContext';

const HashMapVisual = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    // input field
    const [input, setInput] = useState('');

    // hashmap => number : frequency
    const [map, setMap] = useState<Record<number, number>>({});

    // ADD / INCREMENT
    const addElement = () => {
        if (!input.trim()) return;

        const num = Number(input);

        // prevent invalid numbers
        if (isNaN(num)) return;

        setMap(prev => ({
            ...prev,

            // if exists => +1
            // else => start from 1
            [num]: (prev[num] || 0) + 1,
        }));

        setInput('');
    };

    // REMOVE / DECREMENT
    const removeElement = () => {
        if (!input.trim()) return;

        const num = Number(input);

        setMap(prev => {
            // key doesn't exist
            if (!prev[num]) return prev;

            const updated = { ...prev };

            updated[num]--;

            // remove completely if freq <= 0
            if (updated[num] <= 0) {
                delete updated[num];
            }

            return updated;
        });

        setInput('');
    };

    // RESET HASHMAP
    const clearMap = () => {
        setMap({});
    };

    return (
        <View style={styles.container}>

            {/* INPUT */}
            <TextInput
                style={styles.input}
                placeholder="Enter number"
                placeholderTextColor={theme.textTertiary}
                keyboardType="numeric"
                keyboardAppearance="dark"
                value={input}
                onChangeText={setInput}
            />

            {/* BUTTONS */}
            <View style={styles.actionsRow}>

                <Pressable
                    style={[styles.button, styles.addButton]}
                    onPress={addElement}
                >
                    <Text style={styles.buttonText}>
                        Add
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.button, styles.removeButton]}
                    onPress={removeElement}
                >
                    <Text style={styles.buttonText}>
                        Remove
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.button, styles.clearButton]}
                    onPress={clearMap}
                >
                    <Text style={styles.buttonText}>
                        Clear
                    </Text>
                </Pressable>

            </View>

            {/* VISUALIZATION */}
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
                        <View key={key} style={styles.box}>

                            <Text style={styles.keyText}>
                                {key}
                            </Text>

                            <View style={styles.divider} />

                            <Text style={styles.freqText}>
                                Freq: {freq}
                            </Text>

                        </View>
                    ))
                )}
            </ScrollView>

        </View>
    );
};

const getStyles = (theme: any) => {
    return StyleSheet.create({

        container: {
            flex: 1,
            padding: 16,
            backgroundColor: theme.background,
        },

        heading: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.text,
            marginBottom: 20,
        },

        input: {
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 12,
            padding: 14,
            color: theme.text,
            backgroundColor: theme.inputBackground,
            marginBottom: 16,
            fontSize: 16,
        },

        actionsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
            marginBottom: 20,
        },

        button: {
            flex: 1,
            paddingVertical: 12,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
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
            color: 'white',
            fontWeight: '700',
            fontSize: 15,
        },

        mapContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
        },

        box: {
            width: 110,
            minHeight: 110,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 16,
            backgroundColor: theme.inputBackground,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
        },

        keyText: {
            fontSize: 28,
            fontWeight: '700',
            color: theme.text,
        },

        divider: {
            width: '70%',
            height: 1,
            backgroundColor: theme.border,
            marginVertical: 10,
        },

        freqText: {
            fontSize: 16,
            color: theme.text,
            fontWeight: '600',
        },

        emptyText: {
            color: theme.text,
            opacity: 0.6,
            marginTop: 30,
            fontSize: 16,
        },
    });
};

export default HashMapVisual;