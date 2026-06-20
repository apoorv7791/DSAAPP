import React, { useState, useContext, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/theme/ThemeContext';

const { width } = Dimensions.get('window');
const CANVAS_SIZE = width - 40;
const NODE_RADIUS = 25;
const SPEED = 2;

interface Node {
    id: number;
    x: number;
    y: number;
}

interface Edge {
    from: number;
    to: number;
}

const GraphVisualizer = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    // Hardcoded graph structure for visualization
    const nodes: Node[] = [
        { id: 0, x: CANVAS_SIZE / 2, y: 50 },
        { id: 1, x: 80, y: 150 },
        { id: 2, x: CANVAS_SIZE - 80, y: 150 },
        { id: 3, x: 50, y: 280 },
        { id: 4, x: 150, y: 280 },
        { id: 5, x: CANVAS_SIZE - 150, y: 280 },
        { id: 6, x: CANVAS_SIZE - 50, y: 280 },
    ];

    const edges: Edge[] = [
        { from: 0, to: 1 }, { from: 0, to: 2 },
        { from: 1, to: 3 }, { from: 1, to: 4 },
        { from: 2, to: 5 }, { from: 2, to: 6 },
        { from: 3, to: 4 }, // Added a cycle for complexity
    ];

    const adjList: Record<number, number[]> = {
        0: [1, 2],
        1: [0, 3, 4],
        2: [0, 5, 6],
        3: [1, 4],
        4: [1, 3],
        5: [2],
        6: [2],
    };

    const [activeNode, setActiveNode] = useState<number | null>(null);
    const [visitedNodes, setVisitedNodes] = useState<Set<number>>(new Set());
    const [queue, setQueue] = useState<number[]>([]);
    const [stack, setStack] = useState<number[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [algorithm, setAlgorithm] = useState<'BFS' | 'DFS' | null>(null);
    const [explanation, setExplanation] = useState('');

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const explain = async (msg: string, wait = 400) => {
        setExplanation(msg);
        await delay(wait * SPEED);
    };

    const reset = () => {
        setActiveNode(null);
        setVisitedNodes(new Set());
        setQueue([]);
        setStack([]);
        setIsRunning(false);
        setAlgorithm(null);
    };

    const runBFS = async () => {
        if (isRunning) return;

        reset();
        setIsRunning(true);
        setAlgorithm('BFS');

        const q = [0];
        const visited = new Set<number>();

        setQueue([...q]);

        await explain('BFS starts from source node and explores level by level using a queue (FIFO).', 600);

        while (q.length > 0) {
            const current = q.shift()!;
            setQueue([...q]);

            if (visited.has(current)) continue;

            setActiveNode(current);
            await explain(`Visiting node ${current}.`);

            visited.add(current);
            setVisitedNodes(new Set(visited));

            await explain(`Marked node ${current} as visited.`, 300);

            for (const neighbor of adjList[current]) {
                if (!visited.has(neighbor)) {
                    q.push(neighbor);
                    setQueue([...q]);

                    await explain(`Adding node ${neighbor} to queue.`, 250);
                }
            }
        }

        setActiveNode(null);
        setIsRunning(false);
    };

    const runDFS = async () => {
        if (isRunning) return;

        reset();
        setIsRunning(true);
        setAlgorithm('DFS');

        const visited = new Set<number>();
        const currentStack: number[] = [];

        await explain(
            'DFS explores as deep as possible using recursion (stack / LIFO behavior).',
            600
        );

        const dfsRecursive = async (node: number) => {
            if (visited.has(node)) return;

            currentStack.push(node);
            setStack([...currentStack]);
            setActiveNode(node);

            await explain(`Going deeper into node ${node}.`);

            visited.add(node);
            setVisitedNodes(new Set(visited));

            await explain(`Marked node ${node} as visited.`, 300);

            for (const neighbor of adjList[node]) {
                if (!visited.has(neighbor)) {
                    await explain(`Exploring ${node} → ${neighbor}`, 400);
                    await dfsRecursive(neighbor);
                }
            }

            currentStack.pop();
            setStack([...currentStack]);

            setActiveNode(
                currentStack.length
                    ? currentStack[currentStack.length - 1]
                    : null
            );

            await explain(`Backtracking from node ${node}.`, 300);
        };

        await dfsRecursive(0);

        setActiveNode(null);
        setIsRunning(false);
    };

    const renderEdge = (edge: Edge, index: number) => {
        const fromNode = nodes[edge.from];
        const toNode = nodes[edge.to];

        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        return (
            <View
                key={`edge-${index}`}
                style={[
                    styles.edge,
                    {
                        width: distance,
                        left: fromNode.x,
                        top: fromNode.y,
                        transform: [
                            { rotate: `${angle}rad` },
                            { translateX: 0 },
                            { translateY: 0 }
                        ],
                        backgroundColor: (visitedNodes.has(edge.from) && visitedNodes.has(edge.to))
                            ? theme.primary
                            : theme.border
                    }
                ]}
            />
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Graph Algorithms: BFS & DFS</Text>

            <View style={styles.controls}>
                <Pressable
                    style={[styles.button, isRunning && styles.buttonDisabled]}
                    onPress={runBFS}
                    disabled={isRunning}
                >
                    <Text style={styles.buttonText}>Run BFS</Text>
                </Pressable>
                <Pressable
                    style={[styles.button, isRunning && styles.buttonDisabled]}
                    onPress={runDFS}
                    disabled={isRunning}
                >
                    <Text style={styles.buttonText}>Run DFS</Text>
                </Pressable>
                <Pressable style={styles.resetButton} onPress={reset}>
                    <Ionicons name="refresh" size={20} color={theme.text} />
                </Pressable>
            </View>

            <View style={styles.canvas}>
                {edges.map(renderEdge)}
                {nodes.map((node) => (
                    <View
                        key={`node-${node.id}`}
                        style={[
                            styles.node,
                            { left: node.x - NODE_RADIUS, top: node.y - NODE_RADIUS },
                            activeNode === node.id && styles.activeNode,
                            visitedNodes.has(node.id) && styles.visitedNode,
                        ]}
                    >
                        <Text style={[
                            styles.nodeText,
                            (activeNode === node.id || visitedNodes.has(node.id)) && { color: '#fff' }
                        ]}>
                            {node.id}
                        </Text>
                    </View>
                ))}
            </View>

            <View style={styles.statusArea}>
                <View style={styles.statusBox}>
                    <Text style={styles.statusTitle}>Current State</Text>
                    <Text style={styles.statusText}>
                        Algorithm: <Text style={{ fontWeight: 'bold', color: theme.primary }}>{algorithm || 'None'}</Text>
                    </Text>
                    <Text style={styles.statusText}>
                        Active Node: <Text style={{ fontWeight: 'bold', color: theme.accent }}>{activeNode !== null ? activeNode : 'None'}</Text>
                    </Text>
                </View>

                {algorithm === 'BFS' && (
                    <View style={styles.queueBox}>
                        <Text style={styles.statusTitle}>Explanation</Text>
                        <Text style={styles.statusText}>
                            {explanation || 'Run BFS or DFS to see step-by-step reasoning'}
                        </Text>
                        <Text style={styles.statusTitle}>Queue (FIFO)</Text>
                        <View style={styles.queueList}>
                            {queue.map((item, i) => (
                                <View key={i} style={styles.queueItem}>
                                    <Text style={styles.queueText}>{item}</Text>
                                </View>
                            ))}
                            {queue.length === 0 && <Text style={styles.emptyText}>Empty</Text>}
                        </View>
                    </View>
                )}

                {algorithm === 'DFS' && (
                    <View style={styles.queueBox}>
                        <Text style={styles.statusTitle}>Stack (LIFO)</Text>
                        <Text style={styles.statusText}>
                            {explanation || 'Run BFS or DFS to see step by step reasoning'}
                        </Text>

                        <View style={styles.queueList}>
                            {stack.map((item, i) => (
                                <View key={i} style={[styles.queueItem, { backgroundColor: theme.accent }]}>
                                    <Text style={styles.queueText}>{item}</Text>
                                </View>
                            ))}
                            {stack.length === 0 && <Text style={styles.emptyText}>Empty</Text>}
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: theme.border }]} />
                    <Text style={styles.legendText}>Unvisited</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: theme.accent }]} />
                    <Text style={styles.legendText}>Active</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: theme.primary }]} />
                    <Text style={styles.legendText}>Visited</Text>
                </View>
            </View>
        </View>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg, padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', color: theme.text, marginBottom: 20 },
    controls: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    button: { flex: 1, backgroundColor: theme.primary, height: 45, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    resetButton: { width: 45, height: 45, borderRadius: 8, borderWidth: 1, borderColor: theme.border, justifyContent: 'center', alignItems: 'center' },
    canvas: { width: CANVAS_SIZE, height: 350, backgroundColor: theme.bgCard, borderRadius: 12, borderWidth: 1, borderColor: theme.border, position: 'relative', overflow: 'hidden' },
    node: { position: 'absolute', width: NODE_RADIUS * 2, height: NODE_RADIUS * 2, borderRadius: NODE_RADIUS, backgroundColor: theme.bg, borderWidth: 2, borderColor: theme.border, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
    activeNode: { backgroundColor: theme.accent, borderColor: theme.accent, transform: [{ scale: 1.1 }] },
    visitedNode: { backgroundColor: theme.primary, borderColor: theme.primary },
    nodeText: { fontSize: 16, fontWeight: 'bold', color: theme.text },
    edge: { position: 'absolute', height: 2, zIndex: 1, transformOrigin: '0% 50%' },
    statusArea: { marginTop: 20, flexDirection: 'row', gap: 15 },
    statusBox: { flex: 1, padding: 12, backgroundColor: theme.bgCard, borderRadius: 8, borderWidth: 1, borderColor: theme.border },
    queueBox: { flex: 1, padding: 12, backgroundColor: theme.bgCard, borderRadius: 8, borderWidth: 1, borderColor: theme.border },
    statusTitle: { fontSize: 12, fontWeight: 'bold', color: theme.textSecondary, marginBottom: 8, textTransform: 'uppercase' },
    statusText: { fontSize: 14, color: theme.text, marginBottom: 4 },
    queueList: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
    queueItem: { width: 24, height: 24, borderRadius: 4, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' },
    queueText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    emptyText: { fontSize: 12, color: theme.textSecondary, fontStyle: 'italic' },
    legend: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 25 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 12, height: 12, borderRadius: 6 },
    legendText: { fontSize: 12, color: theme.textSecondary },
});

export default GraphVisualizer;