import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';

const About = () => {
    const { theme } = React.useContext(ThemeContext);
    const styles = getStyles(theme);

    const data = [
        {
            id: '1',
            title: 'About App',
            subtitle: 'A friendly way to learn algorithms and data structures.',
            description: 'This app helps you learn DSA in a simple and visual way. Follow guided lessons, explore examples, and strengthen your problem solving skills with interactive content.',
        },
        {
            id: '2',
            title: 'Features',
            items: ['Visual learning', 'Code examples', 'Beginner friendly', 'Interactive exercises'],
        },
        {
            id: '3',
            title: 'Built by Apoorv Singh',
            subtitle: 'A student with a passion for coding.',
            description: 'Created by a learner who wanted a more engaging way to study algorithms. The app is designed to be accessible, motivating, and easy to follow.',
        },
    ];

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            {item.subtitle ? <Text style={styles.sectionSubtitle}>{item.subtitle}</Text> : null}
            {item.description ? <Text style={styles.sectionText}>{item.description}</Text> : null}
            {item.items ? (
                <View style={styles.pillContainer}>
                    {item.items.map((feature: string, index: number) => (
                        <View key={index} style={styles.featurePill}>
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>
            ) : null}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            />
        </View>
    );
};

const getStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.bg,
        },
        contentContainer: {
            padding: 20,
            paddingBottom: 32,
        },
        card: {
            backgroundColor: theme.bgCard,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.borderLight,
            padding: 20,
            marginBottom: 16,
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.08,
            shadowRadius: 20,
            elevation: 4,
        },
        sectionTitle: {
            fontSize: 22,
            fontWeight: '700',
            color: theme.primary,
            marginBottom: 8,
        },
        sectionSubtitle: {
            fontSize: 14,
            color: theme.textSecondary,
            marginBottom: 14,
            lineHeight: 20,
        },
        sectionText: {
            fontSize: 16,
            color: theme.text,
            lineHeight: 24,
        },
        pillContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 14,
            gap: 10,
        },
        featurePill: {
            backgroundColor: theme.bgSecondary,
            borderRadius: 999,
            paddingVertical: 10,
            paddingHorizontal: 14,
            marginBottom: 10,
        },
        featureText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.text,
        },
    });

export default About;
