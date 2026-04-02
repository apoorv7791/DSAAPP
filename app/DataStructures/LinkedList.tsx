import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { ToastAndroid } from 'react-native';
import * as Clipboard from 'expo-clipboard';
const LinkedList = () => {
    const content = [
        {
            id: "1",
            type: "subheading",
            text: "What is a Linked List?",
        },
        {
            id: "2",
            type: "text",
            text: "A linked list is a linear data structure where each element (called a node) contains a value and a reference (or pointer) to the next node in the sequence. Unlike arrays, linked lists do not require contiguous memory allocation, allowing for efficient insertion and deletion of elements.",
        },
        {
            id: "3",
            type: "subheading",
            text: "Why do we use Linked Lists?",
        },
        {
            id: "4",
            type: "text",
            text: "Linked lists are used when we need a dynamic data structure that can grow and shrink in size. They are particularly useful for implementing stacks, queues, and other abstract data types. Also they are preferred when we need to perform frequent insertions and deletions, as they can be done in constant time without the need to shift elements (as in arrays).",
        },
        {
            id: "5",
            type: "list",
            items: [
                "Dynamic size",
                "Efficient insert/delete",
                "No shifting required",
            ],
        },
        {
            id: "6",
            type: "code",
            language: "Java",
            dataType: "Node Class",
            text: `Class Node {
    int data;
    Node next;

    Node(int data) {
        this.data = data;
        this.next = null;
    }
}`
        },
        {
            id: "7",
            type: "code",
            language: "Java",
            dataType: "Class LinkedList",
            text: `Class LinkedList {
    Node head;

    LinkedList() {
        this.head = null;
    }
}`
        },
        {
            id: "8",
            type: "code",
            language: "Java",
            dataType: "Insert Node",
            text: `public void insert(int data) {
    Node newNode = new Node(data);
    if (head == null) {
        head = newNode;
    } else {
        Node current = head;
        while (current.next != null) {
            current = current.next;
        }
        current.next = newNode;
    }
}`
        },
        {
            id: "10",
            type: "code",
            language: "Java",
            dataType: "Display Node",
            text: `public void display() {
    Node current = head;
    while (current != null) {
        System.out.print(current.data + " ");
        current = current.next;
    }
}`
        },
        {

            id: "11",
            type: "code",
            language: "Java",
            dataType: "Delete Node",
            text: `void delete(int key) {
    Node temp = head, prev = null;

    if (temp != null && temp.data == key) {
        head = temp.next;
        return;
    }

    while (temp != null && temp.data != key) {
        prev = temp;
        temp = temp.next;
    }

    if (temp == null) return;

    prev.next = temp.next;
}`

        },
        {
            id: "12",
            type: "code",
            language: "Java",
            dataType: "Main method",
            text: `
    void main(){
        var list = new LinkedList();
            list.insert(10);
            list.insert(20);
            list.insert(30);
            list.insert(40);
            list.insert(50);
            list.display();

    }
`
        },
        {
            id: "13",
            type: "code",
            language: "Java",
            dataType: "Output",
            text: `Linked List: 10 -> 20 -> 30 -> 40 -> 50 null`
        }
    ]


    const handleCopy = async (code: string) => {
        await Clipboard.setStringAsync(code);
        ToastAndroid.show("Code copied to clipboard!", ToastAndroid.LONG);
    }

    const rendetItem = ({ item }: { item: any }) => {
        switch (item.type) {
            case "subheading":
                return <Text style={styles.subHeading}>{item.text}</Text>
            case "text":
                return <Text style={styles.text}>{item.text}</Text>
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
            case "list":
                return (
                    <View>
                        {item.items.map((point: string, index: number) => (
                            <View key={index} style={styles.listRow}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.listText}>{point}</Text>
                            </View>
                        ))}
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={content}
                renderItem={rendetItem}
                keyExtractor={(item) => item.id.toString()}
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
        fontFamily: "monospace",
        fontSize: 13,
        lineHeight: 20,
        flexWrap: "wrap", // 🔥 fix
    },
    copy: {
        color: "#4da6ff",
        fontSize: 15,
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

export default LinkedList;
