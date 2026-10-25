import React, { useContext, useState } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable } from 'react-native';
import { ThemeContext } from '@/theme/ThemeContext';
const SearchingVisual = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const [value, setValue] = useState<string>('');
    const [target, setTarget] = useState<string>('');
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [array, setArray] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('');
    const [result, setResult] = useState<number | null>(null);
    const AddElement = () => {
        const element = value.trim();
        if (element) {
            setArray(prev => [...prev, element]);
        }
        setValue('')
    }
    const SortArray = () => {
        const sortedArray = [...array].map(Number).sort((a, b) => a - b);
        setArray(sortedArray.map(String));
    };

    const LinearSearch = async (nums: number[], target: number) => {
        setIsSearching(true);
        setMessage('');
        setResult(null);
        for (let i = 0; i < nums.length; i++) {
            if (nums[i] === target) {
                setResult(i);
                setMessage(`Element found at index ${i}`);
                setIsSearching(false);
                return i;
            }
        }
        setMessage('Element not found');
        setResult(null);
        return -1;
    }
    const BinarySearch = async (nums: number[], target: number) => {
        setIsSearching(true);
        setMessage('');
        setResult(null);
        let left = 0;
        let right = nums.length - 1;
        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            if (nums[mid] == target) {
                setResult(mid);
                setIsSearching(true);
                setMessage(`Element found at index ${mid}`);
                return mid;
            } else if (nums[mid] > target) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
            setIsSearching(false);
        }
        setMessage("Element not found: ");
        setResult(null);
        return -1;
    }
    return (
        <View style={styles.container}>
            <View style={styles.gridContainer}>

                <TextInput
                    style={styles.input}
                    placeholder="Enter Array elements:"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="numeric"
                    value={value}
                    onChangeText={setValue}
                />

                <TextInput
                    style={styles.inputRow}
                    placeholder="Enter Target Value:"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="numeric"
                    value={target}
                    onChangeText={setTarget}
                />

                <View style={styles.buttonGrid}>
                    <Pressable style={styles.button} onPress={AddElement}>
                        <Text style={styles.buttonText}>Add Element</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => LinearSearch(array.map(Number), Number(target))}>
                        {isSearching ? (
                            <Text style={styles.buttonText}>Searching...</Text>
                        ) : (
                            <Text style={styles.buttonText}>Linear Search</Text>
                        )}
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => BinarySearch(array.map(Number), Number(target))}>
                        {isSearching ? (
                            <Text style={styles.buttonText}>Searching...</Text>
                        ) : (
                            <Text style={styles.buttonText}>Binary Search</Text>
                        )}
                    </Pressable>
                    <Pressable onPress={() => SortArray()}>
                        <Text>Sort Array</Text>
                    </Pressable>
                    <View>
                        {message ? (
                            <Text style={{ color: theme.textSecondary, marginTop: 8 }}>
                                {message}
                            </Text>
                        ) : null}
                        {result !== null ? (
                            <Text style={{ color: theme.text }}>

                            </Text>
                        ) : null}
                    </View>
                </View>

            </View>
            <View style={styles.arrayContainer}>
                {array.map((item, index) => (
                    <View key={`${item}-${index}`} style={styles.box}>
                        <Text style={styles.boxText}>
                            {item}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}
const getStyles = (theme: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.background,
        },
        title: {
            fontSize: 26,
            fontWeight: 'bold',
            marginBottom: 8,
            color: theme.text,
        },
        input: {
            width: 180,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.card,
            padding: 10,
            borderRadius: 10,
            color: theme.text,
            alignSelf: 'flex-start',
            marginLeft: -4,
            marginBottom: 10,
        },
        inputRow: {
            width: 180,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.card,
            padding: 10,
            borderRadius: 10,
            color: theme.text,
            alignSelf: 'flex-start',
            marginBottom: 10,
        },
        gridContainer: {
            width: '100%',
            alignItems: 'center',
            gap: 10,
        },
        subtitle: {
            fontSize: 16,
            marginBottom: 28,
            color: theme.textSecondary,
        },

        arrayContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: 30,
        },
        box: {
            width: 50,
            height: 50,
            borderRadius: 10,
            margin: 6,
            justifyContent: 'center',
            alignItems: 'center',

            backgroundColor: theme.primary,

            elevation: 4,

            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.2,
            shadowRadius: 3,
        },
        boxText: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 15,
        },

        legendContainer: {
            flexDirection: 'row',
            gap: 18,
            marginBottom: 30,
        },

        legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        legendDot: {
            width: 12,
            height: 12,
            borderRadius: 6,
            marginRight: 6,
        },

        legendText: {
            fontSize: 13,
            fontWeight: '500',
        },

        buttonGrid: {
            width: '100%',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
        },

        buttonContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: -80
        },

        button: {
            backgroundColor: theme.primary,
            paddingVertical: 12,
            paddingHorizontal: 18,
            borderRadius: 10,
            margin: 6,
            minWidth: 140,
            alignItems: 'center',
        },

        buttonDisabled: {
            opacity: 0.5,
        },

        buttonText: {
            color: 'white',
            fontWeight: '600',
        },
    });
};

export default SearchingVisual;
