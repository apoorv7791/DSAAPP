import React, {
    useContext,
    useState,
    useMemo,
    useRef,
    useCallback,
} from 'react';

import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';

import { ThemeContext } from '@/theme/ThemeContext';

// ───────────────────────────────
// CONSTANTS
// ───────────────────────────────

const SCREEN_WIDTH = Dimensions.get('window').width;
const NODE_SIZE = 44;
const LEVEL_HEIGHT = 80;
const BASE_SPACING = 140;

// ───────────────────────────────
// HEAP LOGIC
// ───────────────────────────────

function heapInsert(heap: number[], value: number) {
    const arr = [...heap, value];
    const swaps: Array<[number, number]> = [];

    let i = arr.length - 1;

    while (i > 0) {
        const p = Math.floor((i - 1) / 2);

        if (arr[i] < arr[p]) {
            [arr[i], arr[p]] = [arr[p], arr[i]];
            swaps.push([i, p]);
            i = p;
        } else break;
    }

    return { heap: arr, swaps };
}

// ───────────────────────────────
// LAYOUT ENGINE (FIXED)
// ───────────────────────────────

function computeLayout(heap: number[], width: number) {
    const map = new Map<number, { x: number; y: number }>();

    if (!heap.length) return map;

    const rawPositions: Record<number, { x: number; y: number }> = {};

    const queue = [{ i: 0, x: 0, level: 0 }];

    let minX = Infinity;

    while (queue.length) {
        const { i, x, level } = queue.shift()!;
        if (i >= heap.length) continue;

        const y = level * 80 + 60;

        rawPositions[i] = { x, y };

        minX = Math.min(minX, x);

        const offset = 140 / Math.pow(2, level);

        queue.push({ i: 2 * i + 1, x: x - offset, level: level + 1 });
        queue.push({ i: 2 * i + 2, x: x + offset, level: level + 1 });
    }

    // SHIFT ALL X TO POSITIVE SPACE
    const shift = Math.abs(minX) + width / 2;

    Object.entries(rawPositions).forEach(([i, pos]) => {
        map.set(Number(i), {
            x: pos.x + shift,
            y: pos.y,
        });
    });

    return map;
}
// ───────────────────────────────
// COMPONENT
// ───────────────────────────────

export default function HeapVisual() {
    const { theme } = useContext(ThemeContext);

    const [heap, setHeap] = useState<number[]>([]);
    const [input, setInput] = useState('');
    const [message, setMessage] = useState('');

    const animRefs = useRef<{ [k: number]: Animated.Value }>({});

    const getAnim = (i: number) => {
        if (!animRefs.current[i]) {
            animRefs.current[i] = new Animated.Value(1);
        }
        return animRefs.current[i];
    };

    // ───────────────────────────────
    // INSERT
    // ───────────────────────────────

    const insert = useCallback(async () => {
        const val = parseInt(input);
        if (isNaN(val)) return;

        const result = heapInsert(heap, val);
        setHeap(result.heap);

        setMessage(`Inserted ${val}`);
        setInput('');

        // simple animation
        const newIndex = result.heap.length - 1;
        const anim = getAnim(newIndex);

        anim.setValue(0.5);

        Animated.spring(anim, {
            toValue: 1,
            friction: 6,
            useNativeDriver: true,
        }).start();

    }, [heap, input]);

    // ───────────────────────────────
    // LAYOUT
    // ───────────────────────────────

    const layout = useMemo(
        () => computeLayout(heap, SCREEN_WIDTH),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [heap]
    );

    // ───────────────────────────────
    // EXTRACT MIN
    // ───────────────────────────────

    const extractMin = useCallback(() => {
        if (heap.length === 0) return;

        const arr = [...heap];
        const min = arr[0];

        // Move last element to root and remove last
        arr[0] = arr[arr.length - 1];
        arr.pop();

        // Sift down
        let i = 0;
        while (true) {
            const left = 2 * i + 1;
            const right = 2 * i + 2;
            let smallest = i;

            if (left < arr.length && arr[left] < arr[smallest]) {
                smallest = left;
            }
            if (right < arr.length && arr[right] < arr[smallest]) {
                smallest = right;
            }

            if (smallest !== i) {
                [arr[i], arr[smallest]] = [arr[smallest], arr[i]];
                i = smallest;
            } else break;
        }

        setHeap(arr);
        setMessage(`Extracted min: ${min}`);

        // Animate new root if exists
        if (arr.length > 0) {
            const anim = getAnim(0);
            anim.setValue(0.5);
            Animated.spring(anim, {
                toValue: 1,
                friction: 6,
                useNativeDriver: true,
            }).start();
        }
    }, [heap]);



    // canvas sizing fix
    const canvasWidth = useMemo(() => {
        let maxX = 0;
        layout.forEach(({ x }) => {
            maxX = Math.max(maxX, x);
        });

        return Math.max(SCREEN_WIDTH, maxX + 120);
    }, [layout]);

    const canvasHeight = useMemo(() => {
        const depth = Math.floor(Math.log2(heap.length || 1));
        return depth * LEVEL_HEIGHT + 150;
    }, [heap]);

    // ───────────────────────────────
    // RENDER
    // ───────────────────────────────

    return (
        <View style={[styles.container, { backgroundColor: theme.bg }]}>
            <Text style={[styles.title, { color: theme.text }]}>
                Min Heap Visualizer
            </Text>

            {/* INPUT */}
            <View style={styles.row}>
                <TextInput
                    value={input}
                    onChangeText={setInput}
                    keyboardType="numeric"
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Enter value"
                    placeholderTextColor={theme.textSecondary}
                />

                <Pressable onPress={insert} style={styles.btn}>
                    <Text style={styles.btnText}>Insert</Text>
                </Pressable>
                <Pressable onPress={extractMin} style={styles.btn}>
                    <Text style={styles.btnText}>Extract-Min</Text>
                </Pressable>
            </View>

            {message !== '' && (
                <Text style={{ color: theme.textSecondary }}>
                    {message}
                </Text>
            )}

            {/* CANVAS */}
            <ScrollView horizontal>
                <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                    <View
                        style={{
                            width: canvasWidth,
                            height: canvasHeight,
                        }}
                    >
                        {/* NODES */}
                        {heap.map((val, i) => {
                            const pos = layout.get(i);
                            if (!pos) return null;

                            const anim = getAnim(i);

                            return (
                                <Animated.View
                                    key={i}
                                    style={{
                                        position: 'absolute',
                                        left: pos.x - NODE_SIZE / 2,
                                        top: pos.y,
                                        width: NODE_SIZE,
                                        height: NODE_SIZE,
                                        borderRadius: NODE_SIZE / 2,
                                        backgroundColor: theme.primary,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        transform: [{ scale: anim }],
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                                        {val}
                                    </Text>
                                </Animated.View>
                            );
                        })}
                    </View>
                </ScrollView>
            </ScrollView>
        </View>
    );
}

// ───────────────────────────────
// STYLES
// ───────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },

    row: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },

    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
    },

    btn: {
        backgroundColor: '#4f46e5',
        padding: 10,
        borderRadius: 8,
    },

    btnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});