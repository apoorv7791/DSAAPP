
import React, { useContext, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ToastAndroid, Platform, Pressable, ScrollView, FlatList } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/theme/ThemeContext';
import { useTranslation } from '@/context/LanguageContext';

const Heaps = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const { t } = useTranslation();
    const router = useRouter();

    const handleCopy = useCallback(async (text: string) => {
        await Clipboard.setStringAsync(text);
        ToastAndroid.show(t('common.copied'), ToastAndroid.LONG);
    }, [t]);

    const modules = useMemo(() => [
        {
            id: "1",
            type: "subheading",
            text: t('topicContent.heaps.title')
        },
        {
            id: "2",
            type: "text",
            text: t('topicContent.heaps.description')
        },
        {
            id: "3",
            type: "subheading",
            text: t('topicContent.heaps.whyTitle')
        },
        {
            id: "4",
            type: "text",
            text: t('topicContent.heaps.whyDesc')
        },
        {
            id: "5",
            type: "subheading",
            text: t('topicContent.heaps.typesTitle')
        },
        {
            id: "6",
            type: "text",
            text: t('topicContent.heaps.typesDesc')
        },
        {
            id: "7",
            type: "subheading",
            text: t('topicContent.heaps.opsTitle')
        },
        {
            id: "8",
            type: "text",
            text: t('topicContent.heaps.opsDesc')
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
            dataType: "Output",
            text: `Max Heap: 90 15 30 70 25 80 60
Min Heap: 10 30 20 40 70 60 50
10`
        }
    ], [t]);


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

                            <Pressable onPress={() => handleCopy(item.text)}>
                                <Text style={styles.copy}>{t('common.copy')}</Text>
                            </Pressable>
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
                        <Pressable style={styles.btn} onPress={() => router.push("/DataVisual/heap-visual")}>
                            <Text style={styles.btnText}>{t('common.visualize')}</Text>
                        </Pressable>
                    </View>
                }
            />
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

        section: {
            marginBottom: 16,
        },

        subHeading: {
            fontSize: 20,
            fontWeight: "700",
            color: theme.text,
            marginBottom: 6,
            marginTop: 10,
        },

        text: {
            fontSize: 16,
            color: theme.textSecondary,
            lineHeight: 24,
        },

        listText: {
            flex: 1,
            fontSize: 16,
            color: theme.textSecondary,
        },

        bullet: {
            marginRight: 8,
            color: theme.textSecondary,
            fontSize: 16,
        },

        codeBox: {
            backgroundColor: theme.mode === "dark" ? "#1e1e1e" : "#f5f5f5",
            padding: 14,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            marginTop: 12,
            marginBottom: 8,
        },
        codeHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        code: {
            color: theme.mode === "dark" ? "#fff" : "#000",
            fontFamily: "monospace",
            fontSize: 13,
            lineHeight: 20,
        },

        codeType: {
            color: theme.textSecondary,
            fontSize: 12,
            flex: 1,
        },

        copy: {
            color: theme.primary,
            fontSize: 15,
            fontWeight: "600",
        },
        buttonContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        btn: {
            backgroundColor: theme.primary,
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 8,
        },

        btnText: {
            color: "#fff",
            fontSize: 14,
            fontWeight: "600",
        },
    });

}
export default Heaps;



