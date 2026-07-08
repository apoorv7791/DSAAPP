import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { ThemeContext } from "@/theme/ThemeContext";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/toast";
import { guestProgress } from "@/lib/guestProgress";
import { getBackendUrl } from "@/lib/appConfig";

const BACKEND_URL = getBackendUrl();

const GOALS = [
  { label: "5 min / day", value: 5, desc: "Just getting started" },
  { label: "10 min / day", value: 10, desc: "Light practice" },
  { label: "20 min / day", value: 20, desc: "Steady progress" },
  { label: "30 min / day", value: 30, desc: "Serious learner" },
  { label: "60 min / day", value: 60, desc: "Full focus mode" },
];

const DailyGoal = () => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Load saved goal on mount
  useEffect(() => {
    const loadGoal = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;

        if (!token) {
          // Guest: load from local storage
          const localGoal = await guestProgress.getGoal();
          if (localGoal) setSelected(localGoal);
          return;
        }

        if (!BACKEND_URL) {
          return;
        }

        const res = await fetch(`${BACKEND_URL}/api/user/goal`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const body = await res.json();
          if (body.daily_minutes) setSelected(body.daily_minutes);
        }
      } catch {
        // silently fail — user can still pick a new goal
      } finally {
        setFetching(false);
      }
    };
    void loadGoal();
  }, []);

  const handleSave = async () => {
    if (selected === null) {
      showToast("Please select a goal first");
      return;
    }

    try {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        // Guest: save to local storage
        await guestProgress.setGoal(selected);
        showToast(`Daily goal saved locally 🎯`);
        return;
      }

      if (!BACKEND_URL) {
        showToast(
          "Cloud sync is unavailable right now. Please try again later.",
        );
        return;
      }

      const res = await fetch(`${BACKEND_URL}/api/user/goal`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ daily_minutes: selected }),
      });

      if (!res.ok) throw new Error("Failed to save");

      showToast(`Daily goal set to ${selected} min/day 🎯`);
    } catch {
      showToast("Failed to save goal. Try again.");
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
      <Text style={styles.heading}>Set Your Daily Goal</Text>
      <Text style={styles.subheading}>
        How much time do you want to spend learning each day?
      </Text>

      <View style={styles.optionsContainer}>
        {GOALS.map((goal) => {
          const isSelected = selected === goal.value;
          return (
            <Pressable
              key={goal.value}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => setSelected(goal.value)}
            >
              <View style={styles.optionLeft}>
                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected,
                  ]}
                >
                  {goal.label}
                </Text>
                <Text
                  style={[
                    styles.optionDesc,
                    isSelected && styles.optionDescSelected,
                  ]}
                >
                  {goal.desc}
                </Text>
              </View>
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
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
          {loading ? "Saving..." : "Save Goal"}
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
    optionsContainer: { gap: 12 },
    option: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: theme.border,
      backgroundColor: theme.bgCard,
    },
    optionSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.bgSecondary,
    },
    optionLeft: { gap: 4 },
    optionLabel: { fontSize: 16, fontWeight: "600", color: theme.text },
    optionLabelSelected: { color: theme.primary },
    optionDesc: { fontSize: 13, color: theme.textSecondary },
    optionDescSelected: { color: theme.textSecondary },
    radio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: theme.border,
      justifyContent: "center",
      alignItems: "center",
    },
    radioSelected: { borderColor: theme.primary },
    radioDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.primary,
    },
    saveBtn: {
      marginTop: 32,
      backgroundColor: theme.primary,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
    },
    saveBtnText: { color: theme.textInverse, fontSize: 16, fontWeight: "700" },
  });

export default DailyGoal;
