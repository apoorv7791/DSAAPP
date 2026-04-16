import React from 'react';
import { StyleSheet, View, Text, FlatList, ListRenderItem } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';
import { createTypography } from '../theme/Typography';
import { spacingUtils } from '../theme/Spacing';
import Card from '../components/Card/Card';

// INTERFACE TO DEFINE THE MODULE OBJECT
type Module = {
    id: string,
    title: string,
    description: string,
    category?: 'algorithms' | 'dataStructures' | 'practice' | 'visual';
    icon?: string;
}

// HOMESCREEN COMPONENT 
const HomeScreen = () => {
    const { theme } = React.useContext(ThemeContext);
    const typography = createTypography(theme);

    // MODULES ARRAY
    const modules: Module[] = [
        {
            id: "1",
            title: "Welcome to AlgoTrainer",
            description:
                "Master Data Structures and Algorithms through interactive learning, visual examples, and hands-on practice.",
            category: 'algorithms',
            icon: 'rocket'
        },
        {
            id: "2",
            title: "What You'll Learn",
            description:
                "Arrays, Linked Lists, Trees, Graphs, Hashing, Sorting, Searching, and Advanced Algorithmic Techniques.",
            category: 'dataStructures',
            icon: 'book'
        },
        {
            id: "3",
            title: "Interactive Learning",
            description:
                "Visual algorithm explanations, step-by-step tutorials, and real-time code execution to enhance understanding.",
            category: 'visual',
            icon: 'eye'
        },
        {
            id: "4",
            title: "Practice Problems",
            description: "Curated problem sets with varying difficulty levels, instant feedback, and detailed solution explanations.",
            category: 'practice',
            icon: 'code'
        },
        {
            id: "5",
            title: "Track Your Progress",
            description: "Monitor your learning journey with detailed analytics, achievement badges, and personalized recommendations.",
            category: 'practice',
            icon: 'trending-up'
        }
    ];
    // THIS RENDERITEM FUNCTION IS RENDERING THE ARRAY OBJECTS AS CARDS
    const renderItem: ListRenderItem<Module> = ({ item }) => {
        const getCategoryColor = () => {
            switch (item.category) {
                case 'algorithms': return theme.algorithms;
                case 'dataStructures': return theme.dataStructures;
                case 'practice': return theme.practice;
                case 'visual': return theme.visual;
                default: return theme.primary;
            }
        };

        const getGradient = () => {
            const baseColor = getCategoryColor();
            return [baseColor, theme.primary];
        };

        return (
            <Card
                theme={theme}
                variant={item.id === "1" ? "gradient" : "elevated"}
                gradient={item.id === "1" ? theme.primaryGradient : undefined}
                style={spacingUtils.my.md}
            >
                <View style={styles.cardHeader}>
                    <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor() }]} />
                    <Text style={[typography.h4, { color: item.id === "1" ? theme.textInverse : theme.text }]}>
                        {item.title}
                    </Text>
                </View>
                <Text style={[typography.bodyMedium, { color: item.id === "1" ? theme.textInverse : theme.textSecondary, marginTop: 8 }]}>
                    {item.description}
                </Text>
            </Card>
        )
    }
    // THIS FUNCTION IS THE MAIN RENDER FUNCTION FOR THE HOME SCREEN
    return (
        <View style={[styles.container, { backgroundColor: theme.bg }]}>
            <View style={[spacingUtils.px.lg, spacingUtils.py.lg]}>
                <Text style={[typography.h1, { color: theme.text }]}>
                    Welcome to AlgoTrainer
                </Text>
                <Text style={[typography.bodyMedium, { color: theme.textSecondary, marginTop: 8 }]}>
                    Start your journey to mastering Data Structures and Algorithms
                </Text>
            </View>
            <FlatList<Module>
                data={modules}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[spacingUtils.px.lg, spacingUtils.py.xl]}
            />
        </View>
    );
}
// STYLESHEET PROPS 
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    categoryIndicator: {
        width: 4,
        height: 24,
        borderRadius: 2,
    },
})

export default HomeScreen;
