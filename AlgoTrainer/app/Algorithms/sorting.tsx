import React, { useContext, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, ToastAndroid, FlatList, Pressable, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/theme/ThemeContext';
import { useTranslation } from '@/context/LanguageContext';

const Sorting = () => {
    const router = useRouter();
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const { t } = useTranslation();

    const handleCopy = useCallback(async (text: string) => {
        await Clipboard.setStringAsync(text);
        ToastAndroid.show(t('common.copied'), ToastAndroid.LONG);
    }, [t]);

    const modules = useMemo(() => [
        {
            id: "1",
            type: "subheading",
            title: t('topicContent.sorting.title'),
            description: t('topicContent.sorting.description')
        },
        {
            id: "2",
            type: "list",
            title: t('categories.algorithms'),
            list: [
                t('topicContent.sorting.bubbleTitle'),
                t('topicContent.sorting.selectionTitle'),
                t('topicContent.sorting.insertionTitle'),
                t('topicContent.sorting.mergeTitle'),
                t('topicContent.sorting.quickTitle'),
                t('topicContent.sorting.heapTitle'),
            ]
        },
        {
            id: "3",
            type: "code",
            title: t('topicContent.sorting.bubbleTitle'),
            description: t('topicContent.sorting.bubbleDesc'),
            language: "Java",
            code: `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}`
        },
        {
            id: "4",
            type: "code",
            title: t('topicContent.sorting.selectionTitle'),
            description: t('topicContent.sorting.selectionDesc'),
            language: "Java",
            code: `public class SelectionSort {
    public static void selectionSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIndex = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            int temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
    }
}`
        },
        {
            id: "5",
            type: "code",
            title: t('topicContent.sorting.insertionTitle'),
            description: t('topicContent.sorting.insertionDesc'),
            language: "Java",
            code: `public class InsertionSort {
    public static void insertionSort(int[] arr) {
        int n = arr.length;
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
    }
}`
        },
        {
            id: "6",
            type: "code",
            title: t('topicContent.sorting.mergeTitle'),
            description: t('topicContent.sorting.mergeDesc'),
            language: "Java",
            code: `public class MergeSort {
    public static void mergeSort(int[] arr) {
        if (arr.length > 1) {
            int mid = arr.length / 2;
            int[] left = new int[mid];
            int[] right = new int[arr.length - mid];
            for (int i = 0; i < mid; i++) {
                left[i] = arr[i];
            }
            for (int i = mid; i < arr.length; i++) {
                right[i - mid] = arr[i];
            }
            mergeSort(left);
            mergeSort(right);
            merge(arr, left, right);
        }
    }
    public static void merge(int[] arr, int[] left, int[] right) {
        int i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length) {
            if (left[i] < right[j]) {
                arr[k] = left[i];
                i++;
            } else {
                arr[k] = right[j];
                j++;
            }
            k++;
        }
        while (i < left.length) {
            arr[k] = left[i];
            i++;
            k++;
        }
        while (j < right.length) {
            arr[k] = right[j];
            j++;
            k++;
        }
    }
}`
        },
        {
            id: "7",
            type: "code",
            title: t('topicContent.sorting.quickTitle'),
            description: t('topicContent.sorting.quickDesc'),
            language: "Java",
            code: `public class QuickSort {
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
    public static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = (low - 1);
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return (i + 1);
    }
}`
        },
        {
            id: "8",
            type: "code",
            title: t('topicContent.sorting.heapTitle'),
            description: t('topicContent.sorting.heapDesc'),
            language: "Java",
            code: `public class HeapSort {
    public static void heapSort(int[] arr) {
        int n = arr.length;
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }
        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
            heapify(arr, i, 0);
        }
    }
    public static void heapify(int[] arr, int n, int i) {
        int largest = i;
        int l = 2 * i + 1;
        int r = 2 * i + 2;
        if (l < n && arr[l] > arr[largest]) {
            largest = l;
        }
        if (r < n && arr[r] > arr[largest]) {
            largest = r;
        }
        if (largest != i) {
            int temp = arr[i];
            arr[i] = arr[largest];
            arr[largest] = temp;
            heapify(arr, n, largest);
        }
    }
}`
        }
    ], [t]);

    const renderitem = ({ item }: { item: any }) => {
        switch (item.type) {
            case "subheading":
                return (
                    <View style={styles.section}>
                        <Text style={styles.subHeading}>{item.title}</Text>
                        <Text style={[styles.text, { marginTop: 4 }]}>
                            {item.description}
                        </Text>
                    </View>
                );
            case "list":
                return (
                    <View style={styles.section}>
                        <Text style={styles.subHeading}>{item.title}</Text>

                        {item.list.map((algo: string, index: number) => (
                            <View key={index} style={styles.listRow}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.listText}>{algo}</Text>
                            </View>
                        ))}
                    </View>
                );
            case "code":
                return (
                    <View style={styles.section}>
                        <Text style={styles.subHeading}>{item.title}</Text>
                        <Text style={styles.text}>{item.description}</Text>

                        <View style={styles.codeBox}>
                            <View style={styles.codeHeader}>
                                <Pressable onPress={() => handleCopy(item.code)}>
                                    <Text style={styles.copy}>{t('common.copy')}</Text>
                                </Pressable>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <Text style={styles.code}>{item.code}</Text>
                            </ScrollView>
                        </View>
                    </View>
                )
            default:
                return null;
        }
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={modules}
                renderItem={renderitem}
                keyExtractor={(item => item.id)}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.btn} onPress={() => router.push("/AlgoVisual/sorting-visual")}>
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

        heading: {
            fontSize: 24,
            fontWeight: "bold",
            color: theme.text,
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

        bold: {
            fontWeight: "bold",
            color: theme.text,
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
        },
        code: {
            color: "#ffffff",
            fontFamily: "monospace",
            fontSize: 13,
            lineHeight: 20,
            flexWrap: "wrap", // 🔥 fix
        },
        copy: {
            color: "#20b912",
            fontSize: 15,
            fontWeight: "600",
            justifyContent: "flex-end",

        },

        // 🔥 List Styling
        listRow: {
            flexDirection: "row",
            alignItems: "flex-start",
            marginVertical: 4,
        },
        listItem: {
            flexDirection: "row",
            alignItems: "flex-start",
            marginVertical: 4,
            paddingHorizontal: 12,
            backgroundColor: "#f5f5f5",
            borderRadius: 10,
            elevation: 2,
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
}

export default Sorting;
