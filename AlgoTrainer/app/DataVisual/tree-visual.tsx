import React, { useState, useContext, useCallback, useRef } from 'react';
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
    const [paused, setPaused] = useState(false);
    const isPaused = useRef(false);
    const SPEED = 2;

    /* ---------------- UTILITIES ---------------- */

    const delay = (ms: number) =>
        new Promise(res => setTimeout(res, ms));

    const explain = async (msg: string, wait = 400) => {
        await waitifPaused();
        setExplanation(msg);
        await delay(wait * SPEED);
    };

    const togglepause = async () => {
        setPaused(prev => {
            isPaused.current = !prev;
            return !prev;
        });
    }

    const waitifPaused = async () => {
        while(isPaused.current) {
            await delay(100);
        }
    }

    const reset = useCallback(() => {
    setActiveNode(null);
    setExplanation('');
}, []);

    /* ---------------- DFS ---------------- */

    const dfs = useCallback(async (node: any) => {
        if (!node) return;
        await waitifPaused();

        setActiveNode(node.value);
        await explain(`Visiting node ${node.value} (DFS)`);

        if (node.left) {
            await explain(`Going LEFT → ${node.left.value}`);
            await dfs(node.left);   
            setActiveNode(node.value);
            await explain(`Returning to ${node.value} after exploring LEFT`, 300);
        }

        if (node.right) {
            await explain(`Going RIGHT → ${node.right.value}`);
            await dfs(node.right);

        setActiveNode(node.value);     // ← Returned again
        await explain(`Returned to ${node.value} from RIGHT`);
        }

        await explain(`Finished exploring ${node.value}`, 300);
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
            await waitifPaused();
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

    // Node centers (relative to the 320×260 canvas)
    // Root: (160, 40) | Level2: (95, 140), (225, 140) | Level3: (50, 240), (140, 240), (180, 240), (270, 240)
    const edges = [
        { x1: 160, y1: 50, x2: 90, y2: 150 },  // 1 → 2
        { x1: 160, y1: 50, x2: 230, y2: 150 },  // 1 → 3
        { x1: 90, y1: 150, x2: 50, y2: 250 },  // 2 → 4
        { x1: 90, y1: 150, x2: 130, y2: 250 },  // 2 → 5
        { x1: 230, y1: 150, x2: 190, y2: 250 },  // 3 → 6
        { x1: 230, y1: 150, x2: 270, y2: 250 },  // 3 → 7
    ];

    return (
        <ScrollView>
            <View style={styles.container}>

                {/* ── Canvas with edges + nodes ── */}
                <View style={{ width: 320, height: 300, position: 'relative', marginBottom: 10 }}>

                    {/* Edges drawn first so they sit behind nodes */}
                    {edges.map((e, i) => {
                        const dx = e.x2 - e.x1;
                        const dy = e.y2 - e.y1;
                        const length = Math.sqrt(dx * dx + dy * dy);
                        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                        // Position at midpoint, center the line there — rotation then works correctly
                        const midX = (e.x1 + e.x2) / 2;
                        const midY = (e.y1 + e.y2) / 2;
                        return (
                            <View
                                key={i}
                                style={{
                                    position: 'absolute',
                                    left: midX - length / 2,
                                    top: midY - 1,
                                    width: length,
                                    height: 2,
                                    backgroundColor: theme.border,
                                    transform: [{ rotate: `${angle}deg` }],
                                }}
                            />
                        );
                    })}

                    {/* Nodes absolutely positioned at their centers */}
                    {[
                        { label: "1", x: 160, y: 50 },
                        { label: "2", x: 90, y: 150 },
                        { label: "3", x: 230, y: 150 },
                        { label: "4", x: 50, y: 250 },
                        { label: "5", x: 130, y: 250 },
                        { label: "6", x: 190, y: 250 },
                        { label: "7", x: 270, y: 250 },
                    ].map(({ label, x, y }) => (
                        <View
                            key={label}
                            style={{ position: 'absolute', left: x - 27, top: y - 27 }}
                        >
                            <Node label={label} active={activeNode === label} theme={theme} />
                        </View>
                    ))}
                </View>

                <View style={styles.buttonRow}>
                    <Btn text="DFS" onPress={runDFS} theme={theme} />
                    <Btn text="BFS" onPress={() => bfs(tree)} theme={theme} />
                    <Btn text="Reset" onPress={reset} theme={theme} />
                    <Btn text={paused ? "Resume" : "Pause"} onPress={togglepause} theme={theme} />
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

        rootWrapper: { marginBottom: 10 },

        levelRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 30,
            marginBottom: 10
        },

        levelRowGrand: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 15,
            marginBottom: 10
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
