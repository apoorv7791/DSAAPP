import React, { useState, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "@/theme/ThemeContext";

interface StackFrame {
  id: string;
  n: number;
  result?: number;
  isReturning: boolean;
  depth: number;
}

const RecursionVisualizer = () => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [n, setN] = useState("5");
  const [stack, setStack] = useState<StackFrame[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [paused, setPaused] = useState(false);
  const isPaused = useRef(paused);

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  const togglePause = () => {
  
    const next = !isPaused.current;
    isPaused.current = next;
    setPaused(next);
};

  const pauseIfNeeded = async () => {
    while (isPaused.current) {
      await delay(100); 
    }
  }

  const runFactorial = async () => {
    if (isRunning) return;
    const num = parseInt(n);
    if (isNaN(num) || num < 0 || num > 10) {
      setLogs(["Please enter a number between 0 and 10"]);
      return;
    }
    setIsRunning(true);
    setStack([]);
    setLogs([`Calculating factorial(${num})...`]);

    // Recursive Descent
    const calculate = async (
      currentN: number,
      depth: number,
    ): Promise<number> => {
      const frameId = Math.random().toString(36).substr(2, 9);
      const newFrame: StackFrame = {
        id: frameId,
        n: currentN,
        depth,
        isReturning: false,
      };

      setStack((prev) => [newFrame, ...prev]);
      setLogs((prev) => [`factorial(${currentN}) called`, ...prev]);
      await pauseIfNeeded();
      await delay(800);

      if (currentN <= 1) {
        setLogs((prev) => [
          `Base case reached: factorial(${currentN}) = 1`,
          ...prev,
        ]);
        setStack((prev) =>
          prev.map((f) =>
            f.id === frameId ? { ...f, result: 1, isReturning: true } : f,
          ),
        );
        await pauseIfNeeded();
        await delay(800);
        return 1;
      }

      const subResult = await calculate(currentN - 1, depth + 1);
      const result = currentN * subResult;

      setStack((prev) =>
        prev.map((f) =>
          f.id === frameId ? { ...f, result, isReturning: true } : f,
        ),
      );
      setLogs((prev) => [
        `factorial(${currentN}) returns ${currentN} * ${subResult} = ${result}`,
        ...prev,
      ]);
      await pauseIfNeeded();
      await delay(800);

      // Pop frame after returning
      await pauseIfNeeded();
      setStack((prev) => prev.filter((f) => f.id !== frameId));
      return result;
    };

    await calculate(num, 0);
    setIsRunning(false);
    setLogs((prev) => ["Calculation complete! ✨", ...prev]);
  };

  const reset = () => {
    setStack([]);
    setLogs([]);
    setIsRunning(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recursion: Factorial</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={n}
            onChangeText={setN}
            keyboardType="numeric"
            placeholder="n (0-10)"
            placeholderTextColor={theme.textSecondary}
            editable={!isRunning}
          />
          <Pressable
            style={[styles.button, isRunning && styles.buttonDisabled]}
            onPress={runFactorial}
            disabled={isRunning}
          >
            <Text style={styles.buttonText}>Visualize</Text>
          </Pressable>
          <Pressable style={styles.resetButton} onPress={reset}>
            <Ionicons name="refresh" size={20} color={theme.text} />
          </Pressable>
          <Pressable
            style={[styles.button, !isRunning && styles.buttonDisabled]}
            onPress={togglePause}
            disabled={!isRunning}
          >
            <Ionicons 
                        name={paused ? "play" : "pause"}
                        size={20}
                        color={theme.text}
                      />
          </Pressable>
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.stackContainer}>
          <Text style={styles.sectionTitle}>Call Stack</Text>
          <ScrollView contentContainerStyle={styles.stackScroll}>
            {stack.length === 0 && (
              <Text style={styles.emptyText}>Stack is empty</Text>
            )}
            {stack.map((frame, index) => (
              <Animated.View
                key={frame.id}
                style={[
                  styles.stackFrame,
                  frame.isReturning && styles.returningFrame,
                  { zIndex: stack.length - index },
                ]}
              >
                <Text style={styles.frameText}>factorial({frame.n})</Text>
                {frame.result !== undefined && (
                  <Text style={styles.resultText}>➔ {frame.result}</Text>
                )}
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.logContainer}>
          <Text style={styles.sectionTitle}>Execution Log</Text>
          <ScrollView style={styles.logScroll}>
            {logs.map((log, i) => (
              <Text key={i} style={styles.logText}>
                {log}
              </Text>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg, padding: 16 },
    header: { marginBottom: 20 },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 12,
    },
    inputRow: { flexDirection: "row", gap: 10, alignItems: "center" },
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
    resetButton: {
      width: 45,
      height: 45,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: "center",
      alignItems: "center",
    },
    main: { flex: 1, flexDirection: "row", gap: 16 },
    stackContainer: {
      flex: 1.2,
      backgroundColor: theme.bgCard,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    logContainer: {
      flex: 1,
      backgroundColor: theme.bgCard,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.primary,
      marginBottom: 10,
      textTransform: "uppercase",
    },
    stackScroll: { alignItems: "center", paddingBottom: 20 },
    stackFrame: {
      width: "90%",
      padding: 12,
      backgroundColor: theme.primary,
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    returningFrame: { backgroundColor: theme.success },
    frameText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
    resultText: {
      color: "#fff",
      fontSize: 12,
      textAlign: "center",
      marginTop: 4,
    },
    emptyText: {
      color: theme.textSecondary,
      textAlign: "center",
      marginTop: 20,
      fontSize: 12,
    },
    logScroll: { flex: 1 },
    logText: {
      color: theme.text,
      fontSize: 12,
      marginBottom: 6,
      lineHeight: 18,
    },
  });

export default RecursionVisualizer;
