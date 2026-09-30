import React, { useContext, useState } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable } from 'react-native';
import { ThemeContext } from '@/theme/ThemeContext';
const SearchingVisual = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const [value, setValue] = useState<string>('');
    const [target, setTarget] = useState<string>('');

    const [array, setArray] = useState<string[]>([]);
    const AddElement = () => {
        const element = value.trim();
        if (element) {
            setArray(prev => [...prev, element]);
        }
        setValue('')
    }

    const getArray = () => {
        return value.split(',').map(Number);
    };
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter Array elements:"
                placeholderTextColor={theme.textSecondary}
                keyboardType={'numeric'}
                value={value}
                onChangeText={setValue}
            />
            <TextInput
                style={styles.inputRow}
                placeholder="Enter Target Value:"
                placeholderTextColor={theme.textSecondary}
                keyboardType={'numeric'}
                value={target}
                onChangeText={setTarget}
            />

            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={AddElement} >
                    <Text style={styles.buttonText}> Add Element </Text>
                </Pressable>
            </View>
            {/* Boxes*/}
            <View style={styles.arrayContainer}>
                {array.map((item, index) => (
                    <View key={`${item}-${index}`}
                        style={styles.box}
                    >
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
            marginTop: -580,
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
