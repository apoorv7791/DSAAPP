import { supabase } from "@/lib/supabase";
import { ThemeContext } from "@/theme/ThemeContext";
import React, { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Text,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

const ForgotPassword = () => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSubmit = async () => {
    setErrorMsg("");
    if (!email.trim()) {
      setErrorMsg("Please enter your email");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Check your inbox</Text>
        <Text style={styles.subtitle}>
          We sent a password reset link to{"\n"}
          {email.trim()}
        </Text>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Back to Login</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email and we{`'`}ll send you a reset link.
      </Text>

      <TextInput
        placeholder="Enter your email"
        placeholderTextColor={theme.textSecondary}
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <Pressable
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={() => void handleSubmit()}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Text>
      </Pressable>

      <Pressable style={styles.backLink} onPress={() => router.back()}>
        <Text style={styles.backLinkText}>Back to Login</Text>
      </Pressable>
    </ScrollView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 24,
      justifyContent: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 32,
      lineHeight: 22,
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      paddingHorizontal: 16,
      color: theme.text,
      backgroundColor: theme.bgCard,
      marginBottom: 16,
    },
    button: {
      height: 48,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
      marginTop: 8,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textInverse,
    },
    errorText: {
      fontSize: 13,
      color: theme.error,
      marginBottom: 12,
    },
    backLink: {
      marginTop: 20,
      alignItems: "center",
    },
    backLinkText: {
      fontSize: 14,
      color: theme.primary,
    },
  });

export default ForgotPassword;
