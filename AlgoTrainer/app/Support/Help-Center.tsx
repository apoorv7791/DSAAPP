import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/theme/ThemeContext';

const FAQS = [
    {
        q: 'How do I use the visualizers?',
        a: 'Go to the Learn tab, pick a data structure or algorithm, then tap the "Visualize" button. You can interact with the visualizer by inserting, deleting, or searching for values.',
    },
    {
        q: 'What is the difference between DFS and BFS?',
        a: 'DFS (Depth-First Search) explores as far as possible along each branch before backtracking. BFS (Breadth-First Search) explores all nodes at the current depth before moving deeper.',
    },
    {
        q: 'How do I set my daily learning goal?',
        a: 'Go to Settings → Learning → Daily Goal. Pick a time target and tap Save.',
    },
    {
        q: 'Can I use the app offline?',
        a: 'Yes — all visualizers and learning content work offline. Login and progress sync require an internet connection.',
    },
    {
        q: 'How do I change the app theme?',
        a: 'Go to Settings → Preferences → Dark Mode and toggle the switch.',
    },
    {
        q: 'I forgot my password. What do I do?',
        a: 'On the Login screen, use the "Forgot Password" option to receive a reset link on your registered email.',
    },
    {
        q: 'How is the difficulty level used?',
        a: 'The difficulty setting personalises which topics and problems are highlighted for you. You can change it anytime in Settings → Learning → Difficulty Level.',
    },
];

const FAQItem = ({ item, theme }: { item: typeof FAQS[0]; theme: any }) => {
    const [open, setOpen] = useState(false);
    const styles = getStyles(theme);

    return (
        <Pressable style={styles.faqCard} onPress={() => setOpen(!open)}>
            <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{item.q}</Text>
                <Ionicons
                    name={open ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={theme.textSecondary}
                />
            </View>
            {open && (
                <Text style={styles.faqAnswer}>{item.a}</Text>
            )}
        </Pressable>
    );
};

const HelpCenter = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Header */}
            <View style={styles.heroBox}>
                <Ionicons name="help-buoy-outline" size={40} color={theme.primary} />
                <Text style={styles.heroTitle}>Help Center</Text>
                <Text style={styles.heroSub}>
                    Find answers to common questions below.
                </Text>
            </View>

            {/* FAQs */}
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            <View style={styles.faqList}>
                {FAQS.map((item, i) => (
                    <FAQItem key={i} item={item} theme={theme} />
                ))}
            </View>

            {/* Contact */}
            <View style={styles.contactBox}>
                <Ionicons name="mail-outline" size={22} color={theme.primary} />
                <View style={styles.contactText}>
                    <Text style={styles.contactTitle}>Still need help?</Text>
                    <Pressable onPress={() => Linking.openURL('mailto:singhapoorv7791@gmail.com?subject=AlgoTrainer%20Support%20Query')}>
                        <Text style={[styles.contactSub, { color: theme.primary }]}>
                            Reach out at singhapoorv7791@gmail.com
                        </Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
};

const getStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.bg,
        },
        content: {
            padding: 20,
            paddingBottom: 40,
        },
        heroBox: {
            alignItems: 'center',
            paddingVertical: 24,
            marginBottom: 24,
            borderRadius: 16,
            backgroundColor: theme.bgCard,
            borderWidth: 1,
            borderColor: theme.borderLight,
            gap: 8,
        },
        heroTitle: {
            fontSize: 22,
            fontWeight: '700',
            color: theme.text,
        },
        heroSub: {
            fontSize: 14,
            color: theme.textSecondary,
            textAlign: 'center',
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.text,
            marginBottom: 14,
        },
        faqList: {
            gap: 10,
            marginBottom: 28,
        },
        faqCard: {
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.bgCard,
        },
        faqHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
        },
        faqQuestion: {
            flex: 1,
            fontSize: 15,
            fontWeight: '600',
            color: theme.text,
            lineHeight: 20,
        },
        faqAnswer: {
            marginTop: 12,
            fontSize: 14,
            color: theme.textSecondary,
            lineHeight: 21,
        },
        contactBox: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            padding: 16,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.bgCard,
        },
        contactText: {
            gap: 4,
        },
        contactTitle: {
            fontSize: 15,
            fontWeight: '600',
            color: theme.text,
        },
        contactSub: {
            fontSize: 13,
            color: theme.textSecondary,
        },
    });

export default HelpCenter;
