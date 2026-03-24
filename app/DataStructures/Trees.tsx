import React from 'react';
import { StyleSheet, View, Text, ToastAndroid } from 'react-native';
import * as Clipboard from 'expo-clipboard';
const Trees = () => {
    const data = [
        {
            id: "1",
            type: "subheading",
            text: "What is a Tree?\n"
        },
        {
            id: "2",
            type: "paragraph",
            text: "A tree is a hierarchical data structure that consists of nodes connected by edges.\nIt is a non-linear data structure that is used to represent relationships between different elements.\nEach node in a tree can have zero or more child nodes, and there is one node called the root that serves as the starting point of the tree.\n"
        },
        {
            id: "3",
            type: "subheading",
            text: "Why do we use Trees?\n"
        },
        {
            id: "4",
            type: "paragraph",
            text: "Trees are used in various applications such as file systems, databases, and network routing.\nThey provide an efficient way to organize and search data, allowing for fast access and retrieval.\nTrees also help in representing hierarchical relationships, making them useful for tasks like parsing expressions and managing organizational structures.\n"
        },
        {
            id: "5",
            type: "subheading",
            text: "Key operations on Trees\n"
        },
        {
            id: "6",
            type: "list",
            items: [
                "Insertion: Adding a new node to the tree.",
                "Deletion: Removing a node from the tree.",
                "Traversal: Visiting all the nodes in a specific order (e.g., pre-order, in-order, post-order).",
                "Searching: Finding a specific value in the tree."
            ]
        },
        {
            id: "7",
            type: "code",
            language: "Java",
            dataType: "Tree Implementation",
            text: `class TreeNode {
    int data;
    TreeNode left, right;
    
    TreeNode(int item) {
        data = item;
        left = right = null;
    }
}`
        },
        {
            id: "8",
        }
    ];

    const handleCopy = (text: string) => {
        Clipboard.setStringAsync(text);
        ToastAndroid.show("Code copied to clipboard!", ToastAndroid.LONG);

        return (
            <View style={styles.container}>


            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    }
})

export default Trees;
