import React, { useState, useContext, useMemo } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';



interface ListNode {
    id: string;
    value: number;
    next: string | null; // ID of next node
}

// Utility function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);


// Arrow component for visual connections
const Arrow = ({ styles }: { styles: ReturnType<typeof getStyles> }) => (

    <View style={styles.arrowContainer}>
        <View style={styles.arrowLine} />
        <View style={styles.arrowHead} />
    </View>
);

// Individual node component
const NodeComponent = ({ node, isHead, isTail, isAnimating, styles }: {

    node: ListNode;
    isHead: boolean;
    isTail: boolean;
    isAnimating: boolean;
    styles: ReturnType<typeof getStyles>;
}) => (
    <View style={styles.nodeWrapper}>
        <View style={[
            styles.nodeBox,
            isHead && styles.headNode,
            isTail && styles.tailNode,
            isAnimating && styles.animatingNode
        ]}>
            <Text style={styles.nodeValue}>{node.value}</Text>
        </View>
        {node.next && <Arrow styles={styles} />}
    </View>
);

const LinkedListVisual = () => {

    // State management
    const { theme } = useContext(ThemeContext);

    const styles = useMemo(() => getStyles(theme), [theme]);

    const [nodes, setNodes] = useState<ListNode[]>([]);
    const [headId, setHeadId] = useState<string | null>(null);
    const [tailId, setTailId] = useState<string | null>(null);
    const [animatingNode, setAnimatingNode] = useState<string | null>(null);


    // Core operations
    const insertAtHead = (value: number) => {
        const newNode: ListNode = {
            id: generateId(),
            value,
            next: headId
        };
        setNodes([newNode, ...nodes]);
        setHeadId(newNode.id);
        if (!tailId) setTailId(newNode.id);
        animateOperation(newNode.id);
    };

    const insertAtTail = (value: number) => {
        const newNode: ListNode = {
            id: generateId(),
            value,
            next: null
        };

        if (tailId && nodes.length > 0) {
            const updatedNodes = nodes.map(node =>
                node.id === tailId ? { ...node, next: newNode.id } : node
            );
            setNodes([...updatedNodes, newNode]);
        } else {
            setNodes([newNode]);
            setHeadId(newNode.id);
        }
        setTailId(newNode.id);
        animateOperation(newNode.id);
    };

    const deleteAtHead = () => {
        if (headId) {
            const newHead = nodes.find(n => n.id === headId)?.next;
            setNodes(nodes.filter(n => n.id !== headId));
            setHeadId(newHead || null);
            if (nodes.length as number === 1) {
                setTailId(null);
            }
        }
    };

    const deleteAtTail = () => {
        if (tailId && nodes.length > 0) {
            const newTail = nodes.find(n => n.next === tailId);
            if (newTail) {
                const updatedNodes = nodes.map(node =>
                    node.id === newTail.id ? { ...node, next: null } : node
                );
                setNodes(updatedNodes.filter(n => n.id !== tailId));
                setTailId(newTail.id);
            } else {
                // Only one node in list
                setNodes([]);
                setHeadId(null);
                setTailId(null);
            }
        }
    };



    const clearList = () => {
        setNodes([]);
        setHeadId(null);
        setTailId(null);
    };

    const animateOperation = (nodeId: string) => {
        setAnimatingNode(nodeId);
        setTimeout(() => setAnimatingNode(null), 500);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Linked List Visualizer</Text>

            {/* Linked List Display */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                <View style={styles.listContainer}>
                    {(nodes.length as number) === 0 ? (
                        <Text style={styles.emptyText}>Empty List</Text>
                    ) : (
                        nodes.map(node => (
                            <NodeComponent
                                key={node.id}
                                node={node}
                                isHead={node.id === headId}
                                isTail={node.id === tailId}
                                isAnimating={node.id === animatingNode}
                                styles={styles}
                            />
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Control Panel */}
            <View style={styles.controlPanel}>
                <View style={styles.buttonRow}>
                    <Pressable style={styles.button} onPress={() => insertAtHead(Math.floor(Math.random() * 100))}>
                        <Text style={styles.buttonText}>Add Head</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => insertAtTail(Math.floor(Math.random() * 100))}>
                        <Text style={styles.buttonText}>Add Tail</Text>
                    </Pressable>
                </View>
                <View style={styles.buttonRow}>
                    <Pressable style={[styles.button, styles.deleteButton]} onPress={deleteAtHead}>
                        <Text style={styles.buttonText}>Delete Head</Text>
                    </Pressable>
                    <Pressable style={[styles.button, styles.deleteButton]} onPress={deleteAtTail}>
                        <Text style={styles.buttonText}>Delete Tail</Text>
                    </Pressable>
                </View>
                <Pressable style={[styles.button, styles.clearButton]} onPress={clearList}>
                    <Text style={styles.buttonText}>Clear List</Text>
                </Pressable>
            </View>

            {/* Info Panel */}
            <View style={styles.infoPanel}>
                <Text style={styles.infoText}>Nodes: {nodes.length}</Text>
                <Text style={styles.infoText}>Head: {headId ? nodes.find(n => n.id === headId)?.value : 'null'}</Text>
                <Text style={styles.infoText}>Tail: {tailId ? nodes.find(n => n.id === tailId)?.value : 'null'}</Text>
            </View>
        </View>
    );
}
const getStyles = (theme: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: theme.bg,
        },
        heading: {
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 20,
            color: theme.text,
        },
        scrollView: {
            maxHeight: 120,
            marginBottom: 20,
        },
        listContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            minHeight: 80,
        },
        emptyText: {
            fontSize: 16,
            color: theme.textSecondary,
            fontStyle: 'italic',
        },
        nodeWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        nodeBox: {
            width: 60,
            height: 60,
            backgroundColor: theme.primary,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 5,
            borderWidth: 2,
            borderColor: theme.border,
        },
        nodeValue: {
            color: theme.textInverse,
            fontWeight: 'bold',
            fontSize: 16,
        },
        headNode: {
            backgroundColor: theme.error,
            borderColor: theme.error,
        },
        tailNode: {
            backgroundColor: theme.success,
            borderColor: theme.success,
        },
        animatingNode: {
            transform: [{ scale: 1.1 }],
            backgroundColor: theme.accent,
            borderColor: theme.accent,
        },
        arrowContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 2,
        },
        arrowLine: {
            width: 20,
            height: 2,
            backgroundColor: theme.textSecondary,
        },
        arrowHead: {
            width: 0,
            height: 0,
            borderLeftWidth: 8,
            borderLeftColor: theme.textSecondary,
            borderTopWidth: 6,
            borderTopColor: 'transparent',
            borderBottomWidth: 6,
            borderBottomColor: 'transparent',
        },
        controlPanel: {
            backgroundColor: theme.bgCard,
            padding: 15,
            borderRadius: 10,
            marginBottom: 20,
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            borderWidth: 1,
            borderColor: theme.border,
        },
        buttonRow: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 10,
        },
        button: {
            backgroundColor: theme.primary,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 8,
            minWidth: 100,
            alignItems: 'center',
        },
        deleteButton: {
            backgroundColor: theme.error,
        },
        clearButton: {
            backgroundColor: theme.borderLight,
            width: '100%',
        },
        buttonText: {
            color: theme.textInverse,
            fontWeight: 'bold',
            fontSize: 14,
        },
        infoPanel: {
            backgroundColor: theme.bgCard,
            padding: 15,
            borderRadius: 10,
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            borderWidth: 1,
            borderColor: theme.border,
        },
        infoText: {
            fontSize: 14,
            color: theme.text,
            marginBottom: 5,
        },
    });
}
export default LinkedListVisual;
