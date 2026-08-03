import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { ThemeContext } from "@/theme/ThemeContext";

const DPVisualizer = () => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [n, setN] = useState("6");
  const [table, setTable] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const runFibonacciTabulation = async () => {
    if (isRunning) return;
    const num = parseInt(n);
    if (isNaN(num) || num < 0 || num > 12) return;

    setIsRunning(true);
    const dp = new Array(num + 1).fill(0);
    setTable([]);

    for (let i = 0; i <= num; i++) {
      setCurrentIndex(i);
      await delay(600);

      if (i <= 1) {
        dp[i] = i;
      } else {
        dp[i] = dp[i - 1] + dp[i - 2];
      }

      setTable([...dp.slice(0, i + 1)]);
      await delay(400);
    }

    setCurrentIndex(null);
    setIsRunning(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>DP: Fibonacci Tabulation</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={n}
          onChangeText={setN}
          keyboardType="numeric"
          placeholder="n (0-12)"
          placeholderTextColor={theme.textSecondary}
          editable={!isRunning}
        />
        <Pressable
          style={[styles.button, isRunning && styles.buttonDisabled]}
          onPress={runFibonacciTabulation}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>Visualize</Text>
        </Pressable>
      </View>

      <View style={styles.tableContainer}>
        <Text style={styles.sectionTitle}>DP Table (Bottom-Up)</Text>
        <View style={styles.grid}>
          {Array.from({ length: (parseInt(n, 10) || 0) + 1 }).map((_, i) => (
            <View key={i} style={styles.cellWrapper}>
              <Text style={styles.indexText}>i={i}</Text>
              <View
                style={[
                  styles.cell,
                  currentIndex === i && styles.activeCell,
                  table[i] !== undefined && styles.filledCell,
                ]}
              >
                <Text
                  style={[
                    styles.cellText,
                    (currentIndex === i || table[i] !== undefined) && {
                      color: "#fff",
                    },
                  ]}
                >
                  {table[i] !== undefined ? table[i] : "?"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.explanation}>
        <Text style={styles.explanationTitle}>How it works:</Text>
        <Text style={styles.explanationText}>
          1. We create an array (DP Table) of size n+1.{"\n"}
          2. Base cases: dp[0]=0, dp[1]=1.{"\n"}
          3. For each i from 2 to n, we calculate dp[i] = dp[i-1] + dp[i-2].
          {"\n"}
          4. This avoids re-calculating the same values multiple times
          (Efficiency!).
        </Text>
      </View>
    </ScrollView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg, padding: 16 },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 20,
    },
    inputRow: { flexDirection: "row", gap: 10, marginBottom: 30 },
    input: {
      flex: 1,
      height: 45,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      color: theme.text,
      backgroundColor: theme.bgCard,
    },
    button: {
      backgroundColor: theme.primary,
      paddingHorizontal: 20,
      height: 45,
      borderRadius: 8,
      justifyContent: "center",
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: "#fff", fontWeight: "600" },
    tableContainer: { marginBottom: 30 },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 15,
    },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    cellWrapper: { alignItems: "center", gap: 4 },
    indexText: { fontSize: 10, color: theme.textSecondary },
    cell: {
      width: 60,
      height: 60,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.bgCard,
    },
    activeCell: { backgroundColor: theme.accent, borderColor: theme.accent },
    filledCell: { backgroundColor: theme.primary, borderColor: theme.primary },
    cellText: { fontSize: 16, fontWeight: "bold", color: theme.text },
    explanation: {
      padding: 16,
      backgroundColor: theme.bgCard,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    explanationTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.primary,
      marginBottom: 8,
    },
    explanationText: {
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 20,
    },
  });

export default DPVisualizer;
