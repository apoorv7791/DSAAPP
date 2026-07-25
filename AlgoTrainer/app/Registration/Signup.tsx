import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ToastAndroid,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { ThemeContext } from "@/theme/ThemeContext";
import { useRouter } from "expo-router";
import { useTranslation } from "@/app/context/LanguageContext";

const Signup = () => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const router = useRouter();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  const handleSignup = async () => {
    if (!email || !password || !username) {
      ToastAndroid.show(t("auth.enterEmailPass"), ToastAndroid.SHORT);
      return;
    }

    try {
      setLoading(true);

      // 1. Create auth user
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (error) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
        return;
      }

      // Profile is auto-created by DB trigger using username from metadata

      ToastAndroid.show(t("auth.signupSuccess"), ToastAndroid.LONG);

      router.replace("/Registration/Login");
    } catch (err: any) {
      ToastAndroid.show(
        err?.message || t("auth.somethingWrong"),
        ToastAndroid.SHORT,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        {t("auth.signupTitle")}
      </Text>

      <TextInput
        placeholder={t("auth.emailPlaceholder")}
        style={[
          styles.input,
          {
            backgroundColor: theme.bgCard,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor={theme.textSecondary}
      />
      <TextInput
        placeholder={t("auth.usernamePlaceholder")}
        style={[
          styles.input,
          {
            backgroundColor: theme.bgCard,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholderTextColor={theme.textSecondary}
      />
      <TextInput
        placeholder={t("auth.passwordPlaceholder")}
        style={[
          styles.input,
          {
            backgroundColor: theme.bgCard,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={theme.textSecondary}
      />

      <Pressable
        style={[
          styles.button,
          { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 },
        ]}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? t("common.loading") : t("auth.signupBtn")}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push("/Registration/Login")}>
        <Text
          style={[
            styles.linkText,
            { color: theme.primary, textAlign: "center", marginTop: 15 },
          ]}
        >
          {t("auth.alreadyHaveAccount")}
        </Text>
      </Pressable>
    </View>
  );
};

const getStyles = (theme: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: "center",
      backgroundColor: theme.bg,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 12,
      marginBottom: 10,
      borderRadius: 8,
    },
    button: {
      backgroundColor: "#000",
      padding: 15,
      borderRadius: 8,
      marginTop: 10,
    },
    buttonText: {
      color: "#fff",
      textAlign: "center",
      fontWeight: "bold",
    },
    linkText: {
      textAlign: "center",
      marginTop: 20,
      fontSize: 16,
    },
  });
};

export default Signup;
