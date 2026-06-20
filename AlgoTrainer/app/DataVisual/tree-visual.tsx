import React, { useState, useContext, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { ThemeContext } from '@/theme/ThemeContext';

/* ---------------- TREE ---------------- */

const tree = {
    value: "1",
    left: {
        value: "2",
        left: { value: "4" },
        right: { value: "5" }
    },
    right: {
        value: "3",
        left: { value: "6" },
        right: { value: "7" }
    }
};

/* ---------------- COMPONENT ---------------- */

const TreesVisual = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const [activeNode, setActiveNode] = useState<string | null>(null);
    const [explanation, setExplanation] = useState('');
    const [running, setRunning] = useState(false);

    const SPEED = 2;

    /* ---------------- UTILITIES ---------------- */

    const delay = (ms: number) =>
        new Promise(res => setTimeout(res, ms));

    const explain = async (msg: string, wait = 400) => {
        setExplanation(msg);
        await delay(wait * SPEED);
    };

    const reset = useCallback(() => {
        setActiveNode(null);
        setExplanation('');
        setRunning(false);
    }, []);

    /* ---------------- DFS ---------------- */

    const dfs = useCallback(async (node: any) => {
        if (!node) return;

        setActiveNode(node.value);
        await explain(`Visiting node ${node.value} (DFS)`);

        if (node.left) {
            await explain(`Going LEFT → ${node.left.value}`);
            await dfs(node.left);
        }

        if (node.right) {
            await explain(`Going RIGHT → ${node.right.value}`);
            await dfs(node.right);
        }

        await explain(`Backtracking from ${node.value}`, 300);
    }, []);

    const runDFS = async () => {
        if (running) return;

        reset();
        setRunning(true);

        await explain('DFS starts: exploring deep before backtracking', 600);
        await dfs(tree);

        setActiveNode(null);
        setRunning(false);
    };

    /* ---------------- BFS ---------------- */

    const bfs = async (root: any) => {
        if (!root || running) return;

        reset();
        setRunning(true);

        const queue = [root];

        await explain('BFS starts: level-order traversal using queue', 600);

        while (queue.length) {
            const node = queue.shift();
            if (!node) continue;

            setActiveNode(node.value);
            await explain(`Visiting ${node.value}`);

            if (node.left) {
                queue.push(node.left);
                await explain(`Enqueued LEFT child ${node.left.value}`, 250);
            }

            if (node.right) {
                queue.push(node.right);
                await explain(`Enqueued RIGHT child ${node.right.value}`, 250);
            }
        }

        setActiveNode(null);
        setRunning(false);
    };

    /* ---------------- UI ---------------- */

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>Tree Visualizer</Text>

                <View style={styles.rootWrapper}>
                    <Node label="1" active={activeNode === "1"} theme={theme} />
                </View>

                <View style={styles.levelRow}>
                    <Node label="2" active={activeNode === "2"} theme={theme} />
                    <Node label="3" active={activeNode === "3"} theme={theme} />
                </View>

                <View style={styles.levelRowGrand}>
                    {["4", "5", "6", "7"].map(v => (
                        <Node key={v} label={v} active={activeNode === v} theme={theme} />
                    ))}
                </View>

                <View style={styles.buttonRow}>
                    <Btn text="DFS" onPress={runDFS} theme={theme} />
                    <Btn text="BFS" onPress={() => bfs(tree)} theme={theme} />
                    <Btn text="Reset" onPress={reset} theme={theme} />
                </View>

                <Text style={styles.info}>
                    {activeNode ? `Current Node: ${activeNode}` : 'No node selected'}
                </Text>

                <View style={styles.explanationBox}>
                    <Text style={styles.explanationTitle}>Explanation</Text>
                    <Text style={styles.explanationText}>{explanation}</Text>
                </View>
            </View>
        </ScrollView>
    );
};

/* ---------------- SMALL COMPONENTS ---------------- */

const Node = ({ label, active, theme }: any) => {
    const styles = getStyles(theme);
    return (
        <View style={[styles.node, active && styles.activeNode]}>
            <Text style={{ color: theme.textInverse, fontWeight: 'bold' }}>
                {label}
            </Text>
        </View>
    );
};

const Btn = ({ text, onPress, theme }: any) => {
    const styles = getStyles(theme);
    return (
        <TouchableOpacity style={styles.btn} onPress={onPress}>
            <Text style={styles.btnText}>{text}</Text>
        </TouchableOpacity>
    );
};

/* ---------------- STYLES ---------------- */

const getStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 50,
            alignItems: 'center',
            backgroundColor: theme.bg
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: 30,
            color: theme.text
        },

        node: {
            width: 55,
            height: 55,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 10,
            backgroundColor: theme.primary
        },

        activeNode: {
            backgroundColor: '#FF6B6B'
        },

        rootWrapper: { marginBottom: 40 },

        levelRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 30,
            marginBottom: 40
        },

        levelRowGrand: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 15,
            marginBottom: 20
        },

        buttonRow: {
            flexDirection: 'row',
            gap: 15,
            marginTop: 30
        },

        btn: {
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
            backgroundColor: theme.primary
        },

        btnText: {
            color: theme.textInverse,
            fontWeight: '600'
        },

        info: {
            marginTop: 10,
            color: theme.secondary
        },

        explanationBox: {
            marginTop: 30,
            padding: 16,
            borderRadius: 12,
            backgroundColor: theme.bgCard,
            width: '90%'
        },

        explanationTitle: {
            fontWeight: '700',
            color: theme.primary,
            marginBottom: 8
        },

        explanationText: {
            color: theme.textSecondary
        }
    });

export default TreesVisual;