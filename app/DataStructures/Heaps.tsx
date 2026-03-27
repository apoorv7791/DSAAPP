
import React from 'react';
import { View, Text, StyleSheet, ToastAndroid, Platform, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import * as Clipboard from 'expo-clipboard';

const Heaps = () => {
    const handleCopy = async (text: string) => {
        await Clipboard.setStringAsync(text);
        if (Platform.OS === 'android') ToastAndroid.show('Copied to clipboard', ToastAndroid.LONG);
    }

    const modules = [
        {
            id: "1",
            type: "subheading",
            text: "What is a Heap?"
        },
        {
            id: "2",
            type: "text",
            text: "A heap is a specialized tree-based data structure that satisfies the heap property.\nIt is commonly used to implement priority queues."
        },
        {
            id: "3",
            type: "subheading",
            text: "Why do we use Heaps?"
        },
        {
            id: "4",
            type: "text",
            text: "Heaps are used to efficiently access the maximum or minimum element in a collection.\nThey are commonly used in algorithms like Dijkstra's shortest path and heap sort."
        },
        {
            id: "5",
            type: "subheading",
            text: "Types of Heaps"
        },
        {
            id: "6",
            type: "text",
            text: "There are two main types of heaps: max heaps and min heaps.\nIn a max heap, the parent node is always greater than or equal to its child nodes, while in a min heap, the parent node is always less than or equal to its child nodes."
        },
        {
            id: "7",
            type: "subheading",
            text: "Heap Operations"
        },
        {
            id: "8",
            type: "text",
            text: "The main operations on a heap include insertion,  \n deletion, and extraction of the maximum or minimum element.\nThese operations maintain the heap property and have a time complexity of O(log n)."
        },
        {
            id: "9",
            type: "code",
            language: "Java",
            dataType: "Heap Implementation",
            text: `class Heap {
    int heap[] = new int[100];
    int size = 0;
    
    void insert(int item) {
        heap[size++] = item;
        heapifyUp(size - 1);
    }
    
    void heapifyUp(int index) {
        if (index == 0) return;
        int parent = (index - 1) / 2;
        if (heap[index] > heap[parent]) {
            int temp = heap[index];
            heap[index] = heap[parent];
            heap[parent] = temp;
            heapifyUp(parent);
        }
    }
}`
        },
        {
            id: "10",
            type: "code",
            language: "Java",
            dataType: "Extract Max Operation",
            text: `int extractMax() {
    if (size == 0) {
        System.out.println("Heap underflow");
        return -1;
    }
    int max = heap[0];
    heap[0] = heap[size - 1];
    size--;
    heapifyDown(0);
    return max;
}`
        },
        {
            id: "11",
            type: "code",
            language: "java",
            dataType: "Extract Min Operation",
            text: `int extractMin() {
    if (size == 0) {
        System.out.println("Heap underflow");
        return -1;
    }
    int min = heap[0];
    heap[0] = heap[size - 1];
    size--;
    heapifyDown(0);
    return min;
}`
        },
        {
            id: "12",
            type: "code",
            language: "java",
            dataType: "Heapify Down Operation",
            text: `void heapifyDown(int index) {
    int largest = index;
    int left = 2 * index + 1;
    int right = 2 * index + 2;
    
    if (left < size && heap[left] > heap[largest]) {
        largest = left;
    }
    
    if (right < size && heap[right] > heap[largest]) {
        largest = right;
    }
    
    if (largest != index) {
        int temp = heap[index];
        heap[index] = heap[largest];
        heap[largest] = temp;
        heapifyDown(largest);
    }
}`
        },
        {
            id: "13",
            type: "code",
            language: "Java",
            dataType: "Operations Implementation",
            text: `var maxHeap = new PriorityQueue<Integer>();
            maxHeap.add(10);
            maxHeap.add(20);
            maxHeap.add(30);
            maxHeap.add(40);
            maxHeap.add(50);
            maxHeap.add(60);
            maxHeap.add(70);
            maxHeap.add(80);
            maxHeap.add(90);
            System.out.println(maxHeap) \n  ;
            System.out.println(maxHeap.poll()) \n  ;
            
            `
        },
        {
            id: "14",
            type: "code",
            language: "Java",
            dataType: "Operations Implementation",
            text: `var minHeap = new PriorityQueue<Integer>();
            minHeap.add(10);
            minHeap.add(20);
            minHeap.add(30);
            minHeap.add(40);
            minHeap.add(50);
            minHeap.add(60);
            minHeap.add(70);
            minHeap.add(80);
            minHeap.add(90);
            System.out.println(minHeap) \n  ;
            System.out.println(minHeap.poll()) \n  ;
            `
        },
        {
            id: "15",
            type: "code",
            language: "java",
            dataType: "Ouput",
            text: `Max Heap: 90 15 30 70 25 80 60
Min Heap: 10 30 20 40 70 60 50
10`
        }
    ]


    const renderItem = ({ item }: { item: any }) => {
        switch (item.type) {
            case "subheading":
                return (
                    <View style={styles.section}>
                        <Text style={styles.subHeading}>{item.text}</Text>
                    </View>
                )
            case "text":
                return (
                    <View style={styles.section}>
                        <Text style={styles.text}>{item.text}</Text>
                    </View>
                )
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
                data={modules}
                renderItem={renderItem}
                keyExtractor={(item => item.id)}
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


export default Heaps;



