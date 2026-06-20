import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ThemeContext, ThemeType } from '@/theme/ThemeContext';

const graph: Record<number, number[]> = {
    1: [2, 3],
    2: [1, 3],
    3: [1, 2],
};

type NodeCircleProps = {
    label: string;
    active: boolean;
    selected: boolean;
    onPress: () => void;
    theme: ThemeType;
};

const NodeCircle = ({ label, active, selected, onPress, theme }: NodeCircleProps) => {
    const styles = getStyles(theme);

    let bgColor = theme.primary;
    if (active) bgColor = '#FF6B6B';
    else if (selected) bgColor = theme.success;

    return (
        <Pressable
            onPress={onPress}
            style={[styles.node, { backgroundColor: bgColor }]}
        >
            <Text style={styles.nodeText}>{label}</Text>
        </Pressable>
    );
};

const GraphsVisual = () => {
    const { theme } = useContext(ThemeContext);

    const [activeNode, setActiveNode] = useState<number | null>(null);
    const [startNode, setStartNode] = useState<number | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const styles = getStyles(theme);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    // 🔥 BFS
    const BFS = async (start: number) => {
        if (isRunning) return;
        setIsRunning(true);

        const visited = new Set<number>();
        const queue: number[] = [start];

        while (queue.length) {
            const node = queue.shift();
            if (node === undefined || visited.has(node)) continue;

            visited.add(node);
            setActiveNode(node);
            await delay(700);

            for (const neighbor of graph[node]) {
                if (!visited.has(neighbor)) queue.push(neighbor);
            }
        }

        setActiveNode(null);
        setIsRunning(false);
    };

    // 🔥 DFS - visits forward then backtracks
    const DFS = async (start: number) => {
        if (isRunning) return;
        setIsRunning(true);

        const visited = new Set<number>();
        const path: number[] = [];

        // Build the DFS path
        const dfs = (node: number) => {
            if (visited.has(node)) return;
            visited.add(node);
            path.push(node);
            for (const neighbor of graph[node]) {
                dfs(neighbor);
            }
        };

        dfs(start);

        // Animate forward: 1 -> 2 -> 3
        // Then backward: 3 -> 2 -> 1
        const fullSequence = [...path, ...[...path].reverse()];

        for (const node of fullSequence) {
            setActiveNode(node);
            await delay(700);
        }

        setActiveNode(null);
        setIsRunning(false);
    };

    // ♻ RESET
    const Reset = () => {
        setActiveNode(null);
        setStartNode(null);
        setIsRunning(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Graph Visualizer</Text>

            {/* GRAPH */}
            <View style={styles.graphContainer}>

                {/* TOP NODE */}
                <NodeCircle
                    label="1"
                    active={activeNode === 1}
                    selected={startNode === 1}
                    onPress={() => setStartNode(1)}
                    theme={theme}
                />

                {/* EDGES */}
                <View style={styles.edgeWrapper}>
                    <View style={styles.edgeLeft} />
                    <View style={styles.edgeRight} />
                </View>

                {/* BOTTOM ROW */}
                <View style={styles.bottomRow}>
                    <NodeCircle
                        label="2"
                        active={activeNode === 2}
                        selected={startNode === 2}
                        onPress={() => setStartNode(2)}
                        theme={theme}
                    />

                    <View style={styles.edgeHorizontal} />

                    <NodeCircle
                        label="3"
                        active={activeNode === 3}
                        selected={startNode === 3}
                        onPress={() => setStartNode(3)}
                        theme={theme}
                    />
                </View>
            </View>

            {/* BUTTONS */}
            <View style={styles.buttonRow}>
                <Pressable
                    style={styles.button}
                    onPress={() => BFS(startNode ?? 1)}
                >
                    <Text style={styles.buttonText}>BFS</Text>
                </Pressable>

                <Pressable
                    style={styles.button}
                    onPress={() => DFS(startNode ?? 1)}
                >
                    <Text style={styles.buttonText}>DFS</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={Reset}>
                    <Text style={styles.buttonText}>Reset</Text>
                </Pressable>
            </View>

            {/* STATUS */}
            <Text style={styles.info}>
                {isRunning
                    ? `Running... Node: ${activeNode}`
                    : startNode
                        ? `Start Node: ${startNode} — press BFS or DFS`
                        : 'Tap a node to select start'}
            </Text>

            <Text style={styles.infoSmall}>
                {activeNode ? `Current Node: ${activeNode}` : 'Idle'}
            </Text>
        </View>
    );
};

const getStyles = (theme: ThemeType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 50,
            alignItems: 'center',
            backgroundColor: theme.bg,
        },

        title: {
            fontSize: 26,
            fontWeight: 'bold',
            marginBottom: 25,
            color: theme.text,
        },

        graphContainer: {
            alignItems: 'center',
            marginTop: 20,
        },

        node: {
            width: 55,
            height: 55,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 10,
        },

        nodeText: {
            color: '#fff',
            fontWeight: 'bold',
        },

        edgeWrapper: {
            width: 180,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 5,
        },

        edgeLeft: {
            width: 70,
            height: 2,
            backgroundColor: theme.border,
            transform: [{ rotate: '-45deg' }],
        },

        edgeRight: {
            width: 70,
            height: 2,
            backgroundColor: theme.border,
            transform: [{ rotate: '45deg' }],
        },

        bottomRow: {
            width: 220,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },

        edgeHorizontal: {
            width: 70,
            height: 2,
            backgroundColor: theme.border,
        },

        buttonRow: {
            flexDirection: 'row',
            gap: 12,
            marginTop: 30,
        },

        button: {
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 8,
            backgroundColor: theme.primary,
        },

        buttonText: {
            color: '#fff',
            fontWeight: '600',
        },

        info: {
            marginTop: 20,
            fontSize: 16,
            color: theme.text,
        },

        infoSmall: {
            marginTop: 5,
            fontSize: 14,
            color: theme.textSecondary,
        },
    });

export default GraphsVisual;
