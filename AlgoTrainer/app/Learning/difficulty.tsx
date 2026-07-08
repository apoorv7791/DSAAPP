import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "@/theme/ThemeContext";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/toast";

const LEVELS = [
  {
    value: "beginner",
    label: "Beginner",
    icon: "leaf-outline" as const,
    desc: "New to DSA. Start with arrays, stacks, and basic sorting.",
    color: "#10b981",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    icon: "flame-outline" as const,
    desc: "Comfortable with basics. Ready for trees, graphs, and recursion.",
    color: "#f59e0b",
  },
  {
    value: "advanced",
    label: "Advanced",
    icon: "rocket-outline" as const,
    desc: "Strong foundation. Tackle dynamic programming and complex algorithms.",
    color: "#ef4444",
  },
];

const Difficulty = () => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Load saved difficulty on mount
  useEffect(() => {
    const loadDifficulty = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("profiles")
          .select("difficulty")
          .eq("id", user.id)
          .single();

        if (data?.difficulty) setSelected(data.difficulty);
      } catch {
        // silently fail
      } finally {
        setFetching(false);
      }
    };
    void loadDifficulty();
  }, []);

  const handleSave = async () => {
    if (!selected) {
      showToast("Please select a difficulty level");
      return;
    }

    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        showToast("Please log in to save your difficulty");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ difficulty: selected })
        .eq("id", user.id);

      if (error) throw error;

      showToast(`Difficulty set to ${selected} 🚀`);
    } catch {
      showToast("Failed to save difficulty. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Choose Difficulty</Text>
      <Text style={styles.subheading}>
        Pick the level that matches your current knowledge.
      </Text>

      <View style={styles.optionsContainer}>
        {LEVELS.map((level) => {
          const isSelected = selected === level.value;
          return (
            <Pressable
              key={level.value}
              style={[
                styles.option,
                isSelected && { borderColor: level.color },
              ]}
              onPress={() => setSelected(level.value)}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: level.color + "22" },
                ]}
              >
                <Ionicons name={level.icon} size={26} color={level.color} />
              </View>
              <View style={styles.optionText}>
                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && { color: level.color },
                  ]}
                >
                  {level.label}
                </Text>
                <Text style={styles.optionDesc}>{level.desc}</Text>
              </View>
              {isSelected && (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={level.color}
                />
              )}
            </Pressable>
          );
        })}
      </View>

      <Pressable
        style={[styles.saveBtn, loading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveBtnText}>
          {loading ? "Saving..." : "Save Difficulty"}
        </Text>
      </Pressable>
    </ScrollView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg },
    content: { padding: 20, paddingBottom: 40 },
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
    optionsContainer: { gap: 14 },
    option: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 16,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: theme.border,
      backgroundColor: theme.bgCard,
    },
    iconBox: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    optionText: { flex: 1, gap: 4 },
    optionLabel: { fontSize: 16, fontWeight: "700", color: theme.text },
    optionDesc: { fontSize: 13, color: theme.textSecondary, lineHeight: 18 },
    saveBtn: {
      marginTop: 32,
      backgroundColor: theme.primary,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
    },
    saveBtnText: { color: theme.textInverse, fontSize: 16, fontWeight: "700" },
  });

export default Difficulty;
