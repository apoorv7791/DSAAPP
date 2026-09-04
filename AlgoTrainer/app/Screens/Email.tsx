import React, { useState, useContext } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { ThemeContext } from "@/theme/ThemeContext";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/toast";

const Email = () => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!newEmail.trim()) {
      showToast("Please enter a new email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      showToast("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ email: newEmail });

      if (error) {
        showToast(error.message);
      } else {
        showToast("Confirmation sent to new email ✉️");
        setNewEmail("");
      }
    } catch (err: any) {
      showToast(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Update Email</Text>
      <Text style={styles.subheading}>
        Enter your new email address. A confirmation link will be sent to verify
        it.
      </Text>

      <Text style={styles.label}>New Email Address</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter new email"
        placeholderTextColor={theme.textTertiary}
        value={newEmail}
        onChangeText={setNewEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Pressable
        style={[styles.saveBtn, loading && { opacity: 0.6 }]}
        onPress={handleUpdate}
        disabled={loading}
      >
        <Text style={styles.saveBtnText}>
          {loading ? "Updating..." : "Update Email"}
        </Text>
      </Pressable>
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
      marginBottom: 8,
    },
    subheading: {
      fontSize: 15,
      color: theme.textSecondary,
      marginBottom: 28,
      lineHeight: 22,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1.5,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 14,
      fontSize: 15,
      color: theme.text,
      backgroundColor: theme.bgCard,
      marginBottom: 24,
    },
    saveBtn: {
      backgroundColor: theme.primary,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
    },
    saveBtnText: {
      color: theme.textInverse,
      fontSize: 16,
      fontWeight: "700",
    },
  });

export default Email;
