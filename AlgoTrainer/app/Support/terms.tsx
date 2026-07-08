import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from "react-native";
import { ThemeContext } from "@/theme/ThemeContext";
import { getTermsOfServiceUrl } from "@/lib/appConfig";

const SUPPORT_EMAIL = "Singhapoorv7791@gmail.com";

const SECTIONS = [
  {
    title: "1. The Service",
    body: "AlgoTrainer provides educational content about algorithms and data structures. We may change, suspend, or discontinue features with reasonable notice when practical.",
  },
  {
    title: "2. Accounts",
    body: "You are responsible for maintaining the confidentiality of your credentials and for activity under your account. You must provide accurate registration information. You may delete your account at any time from Profile using Delete account, subject to our Privacy Policy.",
  },
  {
    title: "3. Acceptable Use",
    body: "You agree not to misuse the App—including attempting to disrupt the service, access others' data without authorisation, or use the App in violation of applicable law.",
  },
  {
    title: "4. Intellectual Property",
    body: "The App, branding, and educational materials are owned by us or our licensors. You receive a limited licence to use the App for personal, non-commercial learning unless we agree otherwise in writing.",
  },
  {
    title: "5. Disclaimers",
    body: 'The App is provided "as is" for educational purposes. We do not warrant uninterrupted or error-free operation or that content is complete or suitable for any particular purpose.',
  },
  {
    title: "6. Limitation of Liability",
    body: "To the fullest extent permitted by law, we are not liable for indirect, incidental, special, consequential, or punitive damages, or any loss of profits or data, arising from your use of the App.",
  },
  {
    title: "7. Termination",
    body: "You may stop using the App at any time. We may suspend or terminate access if you violate these Terms or if required for legal or security reasons.",
  },
  {
    title: "8. Contact",
    body: "Questions about these Terms: ",
  },
];

const TermsOfService = () => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const webUrl = getTermsOfServiceUrl();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Terms of Service</Text>
      <Text style={styles.lastUpdated}>Last updated: May 2026</Text>

      <Text style={styles.intro}>
        By creating an account or using AlgoTrainer, you agree to these Terms of
        Service.
      </Text>

      {SECTIONS.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>

          {section.title === "8. Contact" ? (
            <Text style={styles.sectionBody}>
              {section.body}{" "}
              <Text
                style={[
                  styles.sectionBody,
                  styles.emailLink,
                  { color: theme.primary },
                ]}
                onPress={() => void Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
              >
                {SUPPORT_EMAIL}
              </Text>
            </Text>
          ) : (
            <Text style={styles.sectionBody}>{section.body}</Text>
          )}
        </View>
      ))}

      {webUrl ? (
        <Pressable
          style={[styles.linkBtn, { borderColor: theme.primary }]}
          onPress={() => void Linking.openURL(webUrl)}
        >
          <Text style={[styles.linkBtnText, { color: theme.primary }]}>
            Open Terms of Service in browser
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
      fontWeight: "700",
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
      fontWeight: "700",
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
      alignItems: "center",
    },
    linkBtnText: {
      fontSize: 15,
      fontWeight: "600",
    },
  });

export default TermsOfService;
