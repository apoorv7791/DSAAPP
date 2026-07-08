import React, { useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { ThemeContext } from "@/theme/ThemeContext";
import { LEARNING_TOPICS } from "@/lib/learningTopics";
import { useLearningProgress } from "@/context/LearningProgressContext";
import { createTypography } from "@/theme/Typography";
import Card from "@/components/Card/Card";

const Progress = () => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const typography = createTypography(theme);
  const { completedById, loaded, toggleTopic, refresh, isDone } =
    useLearningProgress();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const completed = LEARNING_TOPICS.filter((t) => isDone(t.id)).length;
  const percent = Math.round((completed / LEARNING_TOPICS.length) * 100);

  // Calculate category progress
  const dataStructures = LEARNING_TOPICS.filter(
    (t) =>
      t.label.includes("Array") ||
      t.label.includes("List") ||
      t.label.includes("Stack") ||
      t.label.includes("Queue") ||
      t.label.includes("Hash") ||
      t.label.includes("Tree") ||
      t.label.includes("Graph") ||
      t.label.includes("Heap"),
  );
  const algorithms = LEARNING_TOPICS.filter(
    (t) => t.label.includes("Sort") || t.label.includes("Search"),
  );
  const advanced = LEARNING_TOPICS.filter(
    (t) =>
      t.label.includes("DP") ||
      t.label.includes("Greedy") ||
      t.label.includes("Recursion") ||
      t.label.includes("Graph Algorithms"),
  );

  const getProgress = (topics: typeof LEARNING_TOPICS) => {
    const done = topics.filter((t) => isDone(t.id)).length;
    return Math.round((done / topics.length) * 100);
  };

  if (!loaded) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Your Learning Dashboard</Text>
      <Text style={styles.subheading}>
        Track your progress across all topics
      </Text>

      {/* Overall Progress Card */}
      <Card theme={theme} variant="elevated" style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{completed}</Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {LEARNING_TOPICS.length - completed}
            </Text>
            <Text style={styles.summaryLabel}>Remaining</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{percent}%</Text>
            <Text style={styles.summaryLabel}>Done</Text>
          </View>
        </View>

        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${percent}%` }]} />
        </View>
      </Card>

      {/* Category Progress Cards */}
      <Text style={styles.sectionTitle}>Category Breakdown</Text>
      <View style={styles.categoryGrid}>
        <Card theme={theme} variant="outlined" style={styles.categoryCard}>
          <View style={styles.categoryContent}>
            <Ionicons name="cube-outline" size={20} color={theme.primary} />
            <Text
              style={[
                typography.labelSmall,
                { color: theme.textSecondary, marginTop: 8 },
              ]}
            >
              Data Structures
            </Text>
            <Text style={[typography.h3, { color: theme.text, marginTop: 4 }]}>
              {getProgress(dataStructures)}%
            </Text>
          </View>
        </Card>

        <Card theme={theme} variant="outlined" style={styles.categoryCard}>
          <View style={styles.categoryContent}>
            <Ionicons
              name="swap-vertical-outline"
              size={20}
              color={theme.accent}
            />
            <Text
              style={[
                typography.labelSmall,
                { color: theme.textSecondary, marginTop: 8 },
              ]}
            >
              Algorithms
            </Text>
            <Text style={[typography.h3, { color: theme.text, marginTop: 4 }]}>
              {getProgress(algorithms)}%
            </Text>
          </View>
        </Card>

        <Card theme={theme} variant="outlined" style={styles.categoryCard}>
          <View style={styles.categoryContent}>
            <Ionicons name="code-outline" size={20} color={theme.success} />
            <Text
              style={[
                typography.labelSmall,
                { color: theme.textSecondary, marginTop: 8 },
              ]}
            >
              Advanced
            </Text>
            <Text style={[typography.h3, { color: theme.text, marginTop: 4 }]}>
              {getProgress(advanced)}%
            </Text>
          </View>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>All Topics</Text>
      <View style={styles.topicList}>
        {LEARNING_TOPICS.map((topic) => {
          const done = completedById[topic.id] === true;
          return (
            <Pressable
              key={topic.id}
              onPress={() => toggleTopic(topic.id)}
              style={({ pressed }) => [
                styles.topicRow,
                pressed && { opacity: 0.75 },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${topic.label}, ${done ? "completed" : "not completed"}. Tap to toggle.`}
            >
              <View style={styles.topicLeft}>
                <Ionicons
                  name={topic.icon as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color={theme.primary}
                />
                <Text style={styles.topicLabel}>{topic.label}</Text>
              </View>
              <Ionicons
                name={done ? "checkmark-circle" : "ellipse-outline"}
                size={22}
                color={done ? theme.success : theme.border}
              />
            </Pressable>
          );
        })}
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
    centered: {
      justifyContent: "center",
      alignItems: "center",
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
      marginBottom: 24,
      lineHeight: 22,
    },
    summaryCard: {
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.bgCard,
      marginBottom: 28,
      gap: 16,
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    summaryItem: {
      alignItems: "center",
      gap: 4,
    },
    summaryValue: {
      fontSize: 26,
      fontWeight: "700",
      color: theme.primary,
    },
    summaryLabel: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    summaryDivider: {
      width: 1,
      height: 40,
      backgroundColor: theme.border,
    },
    barBg: {
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.bgTertiary,
      overflow: "hidden",
    },
    barFill: {
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.primary,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 12,
      marginTop: 20,
    },
    categoryGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 24,
    },
    categoryCard: {
      flex: 1,
      padding: 16,
      alignItems: "center",
    },
    categoryContent: {
      alignItems: "center",
    },
    topicList: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.bgCard,
      overflow: "hidden",
    },
    topicRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    topicLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    topicLabel: {
      fontSize: 15,
      color: theme.text,
      fontWeight: "500",
    },
  });

export default Progress;
