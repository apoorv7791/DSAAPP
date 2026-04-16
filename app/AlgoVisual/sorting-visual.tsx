import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';

const SortingVisual = () => {
    const { theme } = React.useContext(ThemeContext);
    const styles = getStyles(theme);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sorting Visualization</Text>
            <Text style={styles.subtitle}>Coming soon...</Text>
        </View>
    );
};
const getStyles = (theme: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
            color: theme.text,
        },
        subtitle: {
            fontSize: 16,
            color: theme.textSecondary,
        },
    });
}



export default SortingVisual;