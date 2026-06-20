import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Linking,
} from 'react-native';
import { ThemeContext } from '@/theme/ThemeContext';
import { getPrivacyPolicyUrl } from '@/lib/appConfig';

const SECTIONS = [
    {
        title: '1. Information We Collect',
        body: 'We collect only the information you provide when creating an account (email address and password). We do not collect any personal data beyond what is necessary to provide the service.',
    },
    {
        title: '2. How We Use Your Information',
        body: 'Your email is used solely for account authentication and to send important service-related communications. We do not sell, trade, or share your personal information with third parties.',
    },
    {
        title: '3. Data Storage',
        body: 'Your account data is securely stored using Supabase, which complies with industry-standard security practices. Passwords are hashed and never stored in plain text.',
    },
    {
        title: '4. Learning Data',
        body: 'Progress data such as completed topics and daily goals is stored locally on your device and optionally synced to your account. This data is used only to personalise your learning experience.',
    },
    {
        title: '5. Third-Party Services',
        body: 'We use Supabase for authentication and data storage. Their privacy policy applies to data processed through their platform. We do not use advertising networks or analytics trackers in this version of the app.',
    },
    {
        title: '6. Your Rights',
        body: 'You may delete your account and associated cloud data at any time from Profile → Delete account. You can also request deletion by contacting us at support@algotrainer.app. We will process requests within a reasonable time, typically within 30 days.',
    },
    {
        title: '7. Children\'s Privacy',
        body: 'AlgoTrainer is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us.',
    },
    {
        title: '8. Changes to This Policy',
        body: 'We may update this Privacy Policy from time to time. We will notify you of significant changes via the app or email. Continued use of the app after changes constitutes acceptance.',
    },
    {
        title: '9. Contact',
        body: 'If you have any questions about this Privacy Policy, please contact us at support@algotrainer.app.',
    },
];

const PrivacyPolicy = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const webUrl = getPrivacyPolicyUrl();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.heading}>Privacy Policy</Text>
            <Text style={styles.lastUpdated}>Last updated: May 2026</Text>

            <Text style={styles.intro}>
                AlgoTrainer ("we", "our", or "us") is committed to protecting your privacy.
                This policy explains what information we collect and how we use it.
            </Text>

            {SECTIONS.map((section) => (
                <View key={section.title} style={styles.section}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <Text style={styles.sectionBody}>{section.body}</Text>
                </View>
            ))}

            {webUrl ? (
                <Pressable
                    style={[styles.linkBtn, { borderColor: theme.primary }]}
                    onPress={() => void Linking.openURL(webUrl)}
                >
                    <Text style={[styles.linkBtnText, { color: theme.primary }]}>
                        Open privacy policy in browser
                    </Text>
                </Pressable>
            ) : null}
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
        heading: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.text,
            marginBottom: 4,
        },
        lastUpdated: {
            fontSize: 13,
            color: theme.textTertiary,
            marginBottom: 20,
        },
        intro: {
            fontSize: 15,
            color: theme.textSecondary,
            lineHeight: 23,
            marginBottom: 24,
            padding: 16,
            borderRadius: 12,
            backgroundColor: theme.bgCard,
            borderWidth: 1,
            borderColor: theme.borderLight,
        },
        section: {
            marginBottom: 20,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.primary,
            marginBottom: 8,
        },
        sectionBody: {
            fontSize: 14,
            color: theme.text,
            lineHeight: 22,
        },
        linkBtn: {
            marginTop: 8,
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 12,
            borderWidth: 1.5,
            alignItems: 'center',
        },
        linkBtnText: {
            fontSize: 15,
            fontWeight: '600',
        },
    });

export default PrivacyPolicy;
