import React from 'react';
import { StyleSheet, View, Text, ToastAndroid, Platform, TouchableOpacity, ScrollView, FlatList } from 'react-native';
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
                "Traversal: Visiting all the nodes in a specific order in the tree (e.g., pre-order, in-order, post-order).",
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
            type: "code",
            language: "Java",
            dataType: "Insertion",
            text: `void insert(int key) {
    root = insertRec(root, key);
}

TreeNode insertRec(TreeNode root, int key) {
    if (root == null) {
        root = new TreeNode(key);
        return root;
    }
    if (key < root.data)
        root.left = insertRec(root.left, key);
    else if (key > root.data)
        root.right = insertRec(root.right, key);
    
    return root;
}`
        },
        {
            id: "9",
            type: "code",
            language: "Java",
            dataType: "Deletion",
            text: `void delete(int key) {
    root = deleteRec(root, key);
}

TreeNode deleteRec(TreeNode root, int key) {
    if (root == null) return root;

    if (key < root.data)
        root.left = deleteRec(root.left, key);
    else if (key > root.data)
        root.right = deleteRec(root.right, key);
    else {
        if (root.left == null) return root.right;
        else if (root.right == null) return root.left;

        TreeNode temp = findMin(root.right);
        root.data = temp.data;
        root.right = deleteRec(root.right, temp.data);
    }
    return root;
}`
        },
        {
            id: "10",
            type: "code",
            language: "Java",
            dataType: "Traversal",
            text: `
void inorder() {
    inorderRec(root);
    if (root == null) return;
    inorderRec(root.left);
    System.out.print(root.data + " ");
    inorderRec(root.right);
}`
        }
    ];
    const handleCopy = (text: string) => {
        Clipboard.setStringAsync(text);
        ToastAndroid.show("Code copied to clipboard!", ToastAndroid.LONG);
    }

    const renderItem = ({ item }: { item: any }) => {
        switch (item.type) {
            case "subheading":
                return <Text style={styles.heading}>{item.text}</Text>;
            case "paragraph":
                return <Text>{item.text}</Text>;
            case "list":
                return (
                    <View>
                        {item.items.map((listItem: string, index: number) => (
                            <Text key={index}>- {listItem}</Text>
                        ))}
                    </View>
                );
            case "code":
                return (
                    <View style={styles.codeBox}>
                        <View style={styles.codeHeader}>
                            <Text style={styles.codeType}>
                                {item.language} • {item.dataType}
                            </Text>

                            <TouchableOpacity onPress={() => handleCopy(item.text)}>
                                <Text style={styles.copy}>COPY</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <Text style={styles.code}>{item.text}</Text>
                        </ScrollView>
                    </View>
                );
            default:
                return null;
        }
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.btn}>
                            <Text style={styles.btnText}>Visualize</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },

    section: {
        marginBottom: 16,
    },

    heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#222",
        marginBottom: 16,
    },

    subHeading: {
        fontSize: 20,
        fontWeight: "700",
        color: "#222",
        marginBottom: 6,
        marginTop: 10,
    },

    text: {
        fontSize: 16,
        color: "#555",
        lineHeight: 24,
    },

    bold: {
        fontWeight: "bold",
        color: "#000",
    },


    codeBox: {
        backgroundColor: "#1e1e1e",
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#333",
        marginTop: 12,   // 👈 thoda gap badhao
        marginBottom: 8,
    },
    codeHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },

    codeType: {
        color: "#aaa",
        fontSize: 12,
        flex: 1, // 🔥 important
    },
    code: {
        color: "#fff",
        fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
        fontSize: 13,
        lineHeight: 20,
    },
    copy: {
        color: "#4da6ff",
        fontSize: 12,
        fontWeight: "600",
    },
    // 🔥 List Styling
    listRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: 4,
    },

    bullet: {
        marginRight: 8,
        color: "#888",
        fontSize: 16,
    },

    listText: {
        flex: 1,
        fontSize: 16,
        color: "#555",
    },
    btn: {
        backgroundColor: "#4da6ff",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    btnText: {
        color: "#3617e0",
        fontSize: 14,
        fontWeight: "600",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    }
});


export default Trees;
