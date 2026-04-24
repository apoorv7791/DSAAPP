import React, { useState, useMemo, useContext, useRef, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, StyleSheet, Animated } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';

interface NodeType {
    id: string;
    value: number;
    next: string | null;
}

// ---------------- LOGIC LAYER ----------------
const useLinkedList = () => {
    const [nodes, setNodes] = useState<NodeType[]>([]);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [prevId, setPrevId] = useState<string | null>(null);
    const [isReversing, setIsReversing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const idCounter = useRef(0);
    const generateId = () => (++idCounter.current).toString();

    const getHeadId = () => {
        const pointed = new Set(nodes.map(n => n.next).filter(Boolean));
        return nodes.find(n => !pointed.has(n.id))?.id || null;
    };

    const getTailId = () => nodes.find(n => n.next === null)?.id || null;

    const append = (value: number) => {
        const newNode: NodeType = { id: generateId(), value, next: null };
        const tail = getTailId();

        if (!tail) return setNodes([newNode]);

        setNodes(prev =>
            prev.map(n => (n.id === tail ? { ...n, next: newNode.id } : n)).concat(newNode)
        );
    };

    const deleteHead = () => {
        const head = getHeadId();
        if (!head) return;

        setDeletingId(head);
        setTimeout(() => {
            setNodes(prev => prev.filter(n => n.id !== head));
            setDeletingId(null);
        }, 300);
    };

    const deleteTail = () => {
        const tail = getTailId();
        if (!tail) return;

        setDeletingId(tail);
        setTimeout(() => {
            setNodes(prev => {
                const newTail = prev.find(n => n.next === tail);
                if (!newTail) return [];

                return prev
                    .map(n => (n.id === newTail.id ? { ...n, next: null } : n))
                    .filter(n => n.id !== tail);
            });
            setDeletingId(null);
        }, 300);
    };

    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

    const reverse = async () => {
        if (isReversing) return;

        setIsReversing(true);

        const map = new Map(nodes.map(n => [n.id, { ...n }]));

        let prev: string | null = null;
        let curr: string | null = getHeadId();

        while (curr) {
            setCurrentId(curr);
            setPrevId(prev);

            await sleep(400);

            const node = map.get(curr);
            if (!node) break;

            const next = node.next;
            node.next = prev;

            prev = curr;
            curr = next;

            setNodes(Array.from(map.values()));

            await sleep(400);
        }

        setCurrentId(null);
        setPrevId(null);
        setIsReversing(false);
    };

    const getOrdered = () => {
        const ordered: NodeType[] = [];
        let curr = getHeadId();

        while (curr) {
            const node = nodes.find(n => n.id === curr);
            if (!node) break;
            ordered.push(node);
            curr = node.next;
        }

        return ordered;
    };

    return {
        nodes,
        currentId,
        prevId,
        isReversing,
        deletingId,
        append,
        deleteHead,
        deleteTail,
        reverse,
        getOrdered,
        getHeadId,
        getTailId,
    };
};

// ---------------- NODE COMPONENT ----------------
const Node = React.memo(({ value, isHead, isTail, isCurrent, isPrev, hasNext, isDeleting, styles }: any) => {
    const scale = useRef(new Animated.Value(0)).current;
    const bgAnim = useRef(new Animated.Value(0)).current;
    const deleteAnim = useRef(new Animated.Value(1)).current;
    const mounted = useRef(false);

    useEffect(() => {
        if (!mounted.current) {
            Animated.spring(scale, {
                toValue: 1,
                friction: 6,
                useNativeDriver: true,
            }).start();
            mounted.current = true;
        }
    }, []);

    useEffect(() => {
        Animated.timing(bgAnim, {
            toValue: isCurrent ? 1 : isPrev ? 2 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [isCurrent, isPrev]);

    useEffect(() => {
        if (isDeleting) {
            Animated.parallel([
                Animated.timing(deleteAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(scale, {
                    toValue: 0,
                    friction: 6,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isDeleting]);

    const bgColor = bgAnim.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [styles.node.backgroundColor, 'orange', 'green'],
    });

    return (
        <Animated.View style={[styles.nodeWrapper, { opacity: deleteAnim }]}>

            {/* 👇 vertical stack (node + label) */}
            <Animated.View
                style={[
                    styles.nodeContainer,
                    { transform: [{ scale }], opacity: scale },
                ]}
            >
                <Animated.View
                    style={[
                        styles.node,
                        isHead && styles.head,
                        isTail && styles.tail,
                        { backgroundColor: bgColor },
                    ]}
                >
                    <Text style={styles.text}>{value}</Text>
                </Animated.View>

                {/* 👇 LABEL BELOW NODE */}
                <View style={styles.labelContainer}>
                    {isHead && <Text style={styles.headLabel}>HEAD</Text>}
                    {isTail && <Text style={styles.tailLabel}>TAIL</Text>}
                </View>
            </Animated.View>

            {/* 👇 arrow stays separate */}
            {hasNext && (
                <View style={styles.arrowContainer}>
                    <View style={styles.line} />
                    <View style={styles.arrowHead} />
                </View>
            )}

        </Animated.View>
    );
});

// ---------------- MAIN COMPONENT ----------------
export default function LinkedListVisual() {
    const { theme } = useContext(ThemeContext);
    const styles = useMemo(() => createStyles(theme), [theme]);

    const {
        append,
        deleteHead,
        deleteTail,
        reverse,
        getOrdered,
        getHeadId,
        getTailId,
        currentId,
        prevId,
        deletingId,
    } = useLinkedList();

    const [input, setInput] = useState('');

    const ordered = getOrdered();
    const headId = getHeadId();
    const tailId = getTailId();

    return (
        <View style={styles.container}>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.row}>
                    {ordered.length === 0 ? (
                        <Text style={styles.text}>Empty</Text>
                    ) : (
                        <>
                            {ordered.map(node => (
                                <Node
                                    key={node.id}
                                    value={node.value}
                                    isHead={node.id === headId}
                                    isTail={node.id === tailId}
                                    isCurrent={node.id === currentId}
                                    isPrev={node.id === prevId}
                                    hasNext={node.next !== null}
                                    isDeleting={node.id === deletingId}
                                    styles={styles}
                                />
                            ))}
                            {tailId && <Text style={[styles.nullText]}>NULL</Text>}
                        </>
                    )}
                </View>
            </ScrollView>

            <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                keyboardType="numeric"
                placeholder="Enter value"
                placeholderTextColor="#888"
            />

            <Pressable
                style={styles.btn}
                onPress={() => {
                    const val = parseInt(input);
                    if (!isNaN(val)) {
                        append(val);
                        setInput('');
                    }
                }}
            >
                <Text style={styles.btnText}>Add</Text>
            </Pressable>

            <Pressable style={styles.btn} onPress={deleteHead}>
                <Text style={styles.btnText}>Delete Head</Text>
            </Pressable>

            <Pressable style={styles.btn} onPress={deleteTail}>
                <Text style={styles.btnText}>Delete Tail</Text>
            </Pressable>

            <Pressable style={[styles.btn, styles.reverseBtn]} onPress={reverse}>
                <Text style={styles.btnText}>Reverse</Text>
            </Pressable>
        </View>
    );
}

// ---------------- STYLES ----------------
const createStyles = (theme: any) =>
    StyleSheet.create({
        container: { flex: 1, padding: 20, backgroundColor: theme.bg },
        title: { fontSize: 22, textAlign: 'center', color: theme.text, marginBottom: 10 },
        row: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
        nodeWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        nodeContainer: {
            alignItems: 'center', // center label under node
        },

        labelContainer: {
            marginTop: 4,
        },

        headLabel: {
            fontSize: 10,
            color: 'green',
            fontWeight: 'bold',
        },

        tailLabel: {
            fontSize: 10,
            color: 'red',
            fontWeight: 'bold',
        },
        node: {
            width: 60,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 5,
            marginBottom: 4,
            backgroundColor: theme.primary,
            borderRadius: 10,
        },
        text: { color: '#fff', fontWeight: 'bold' },
        arrow: { width: 30, height: 3, backgroundColor: '#666' },  // Increased thickness
        input: {
            borderWidth: 1,
            borderColor: '#ccc',
            marginVertical: 10,
            padding: 12,
            borderRadius: 8,
            color: theme.text,
        },
        btn: {
            padding: 12,
            backgroundColor: '#444',
            marginVertical: 5,
            borderRadius: 8,
            alignItems: 'center',
        },
        nullText: {
            marginLeft: 10,
            color: '#999',
            fontWeight: 'bold',
        },
        lable: {
            position: 'absolute',
            top: -18,
            fontSize: 10,
            color: '#fff',
        },
        btnText: { color: '#fff', fontWeight: '600' },
        reverseBtn: { backgroundColor: '#6a5acd' },
        head: { borderWidth: 2, borderColor: 'yellow' },
        tail: { borderWidth: 2, borderColor: 'red' },
        arrowContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 6,
        },

        line: {
            width: 20,
            height: 2,
            backgroundColor: 'white',
        },

        arrowHead: {
            width: 0,
            height: 0,
            borderTopWidth: 5,
            borderBottomWidth: 5,
            borderLeftWidth: 8,
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent',
            borderLeftColor: 'white',
        },
    });
