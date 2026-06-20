import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { ThemeContext } from '@/theme/ThemeContext';

const INITIAL_ARRAY = [64, 34, 25, 12, 22, 11, 90];


const SortingVisual = () => {
    const { theme } = React.useContext(ThemeContext);

    const [array, setArray] = useState([...INITIAL_ARRAY]);
    const [sorting, setSorting] = useState(false);
    const [comparing, setComparing] = useState<number[]>([]);
    const [swapping, setSwapping] = useState<number[]>([]);
    const [sorted, setSorted] = useState<number[]>([]);

    const scaleAnims = useRef(INITIAL_ARRAY.map(() => new Animated.Value(1))).current;

    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));



    const legendData = [
        { label: 'Comparing', color: '#FFC107' },
        { label: 'Swapping', color: '#F44336' },
        { label: 'Sorted', color: '#4CAF50' },
    ]

    const popBars = (indices: number[]) => {
        indices.forEach(i => {
            Animated.sequence([
                Animated.timing(scaleAnims[i], {
                    toValue: 1.25,
                    duration: 80,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnims[i], {
                    toValue: 1,
                    duration: 80,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    };

    const getBarColor = (index: number) => {
        if (sorted.includes(index)) return '#4CAF50';
        if (swapping.includes(index)) return '#F44336';
        if (comparing.includes(index)) return '#FFC107';
        return theme.primary;
    };

    // ───────── BUBBLE SORT ─────────
    const bubbleSort = async () => {
        if (sorting) return;
        setSorting(true);

        setComparing([]);
        setSwapping([]);
        setSorted([]);

        let temp = [...array];
        const n = temp.length;

        for (let i = 0; i < n - 1; i++) {
            let swapped = false;

            for (let j = 0; j < n - i - 1; j++) {
                setComparing([j, j + 1]);
                await sleep(250);

                if (temp[j] > temp[j + 1]) {
                    setSwapping([j, j + 1]);
                    popBars([j, j + 1]);

                    [temp[j], temp[j + 1]] = [temp[j + 1], temp[j]];
                    setArray([...temp]);

                    swapped = true;
                    await sleep(200);
                    setSwapping([]);
                }
            }

            setSorted(prev => [...prev, n - 1 - i]);

            if (!swapped) break;
        }

        setComparing([]);
        setSwapping([]);
        setSorted([...Array(n).keys()]);
        setSorting(false);
    };

    // ───────── SELECTION SORT (FIXED) ─────────
    const selectionSort = async () => {
        if (sorting) return;
        setSorting(true);

        setComparing([]);
        setSwapping([]);
        setSorted([]);

        let temp = [...array];
        const n = temp.length;

        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;

            for (let j = i + 1; j < n; j++) {
                setComparing([minIndex, j]);
                await sleep(200);

                if (temp[j] < temp[minIndex]) {
                    minIndex = j;
                }
            }

            if (minIndex !== i) {
                setSwapping([i, minIndex]);
                popBars([i, minIndex]);

                [temp[i], temp[minIndex]] = [temp[minIndex], temp[i]];
                setArray([...temp]);

                await sleep(200);
                setSwapping([]);
            }

            setSorted(prev => [...prev, i]);
        }

        setComparing([]);
        setSwapping([]);
        setSorted([...Array(n).keys()]);
        setSorting(false);
    };

    // ───────── INSERTION SORT (cleaned) ─────────
    const insertionSort = async () => {
        if (sorting) return;
        setSorting(true);

        setComparing([]);
        setSwapping([]);
        setSorted([]);

        let temp = [...array];
        const n = temp.length;

        for (let i = 1; i < n; i++) {
            let key = temp[i];
            let j = i - 1;

            setComparing([i]);
            await sleep(150);

            while (j >= 0 && temp[j] > key) {
                setComparing([j, j + 1]);
                setSwapping([j, j + 1]);

                popBars([j, j + 1]);

                temp[j + 1] = temp[j];
                setArray([...temp]);

                await sleep(180);

                setSwapping([]);
                j--;
            }

            temp[j + 1] = key;
            setArray([...temp]);
        }

        setSorted([...Array(n).keys()]);
        setComparing([]);
        setSorting(false);
    };

    // ───────── QUICK SORT (FIXED VISUAL STATE) ─────────
    const partition = async (arr: any[], low: number, high: number) => {
        const pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            setComparing([j, high]);
            await sleep(150);

            if (arr[j] < pivot) {
                i++;

                setSwapping([i, j]);
                popBars([i, j]);

                [arr[i], arr[j]] = [arr[j], arr[i]];
                setArray([...arr]);

                await sleep(150);
                setSwapping([]);
            }
        }

        setSwapping([i + 1, high]);
        await sleep(150);

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        setArray([...arr]);

        setSwapping([]);
        return i + 1;
    };

    const quickSortHelper = async (arr: any[], low: number, high: number) => {
        if (low >= high) return;

        const pi = await partition(arr, low, high);

        await quickSortHelper(arr, low, pi - 1);
        await quickSortHelper(arr, pi + 1, high);
    };

    const QuickSort = async () => {
        if (sorting) return;
        setSorting(true);

        setComparing([]);
        setSwapping([]);
        setSorted([]);

        let temp = [...array];
        await quickSortHelper(temp, 0, temp.length - 1);

        setSorted([...Array(temp.length).keys()]);
        setSorting(false);
    };

    const resetArray = () => {
        if (sorting) return;

        setArray([...INITIAL_ARRAY]);
        setComparing([]);
        setSwapping([]);
        setSorted([]);

        scaleAnims.forEach(a => a.setValue(1));
    };




    // ───────── MERGE SORT ─────────
    const merge = async (arr: any[], left: number, mid: number, right: number) => {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);

        let i = 0, j = 0, k = left;

        while (i < leftArr.length && j < rightArr.length) {
            setComparing([left + i, mid + 1 + j]);
            await sleep(150);

            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }

            setSwapping([k]);
            popBars([k]);
            setArray([...arr]);
            await sleep(100);
            setSwapping([]);
            k++;
        }

        while (i < leftArr.length) {
            arr[k] = leftArr[i];
            setSwapping([k]);
            popBars([k]);
            setArray([...arr]);
            await sleep(100);
            setSwapping([]);
            i++;
            k++;
        }

        while (j < rightArr.length) {
            arr[k] = rightArr[j];
            setSwapping([k]);
            popBars([k]);
            setArray([...arr]);
            await sleep(100);
            setSwapping([]);
            j++;
            k++;
        }
    };

    const mergeSortHelper = async (arr: any[], left: number, right: number) => {
        if (left >= right) return;

        const mid = Math.floor((left + right) / 2);
        await mergeSortHelper(arr, left, mid);
        await mergeSortHelper(arr, mid + 1, right);
        await merge(arr, left, mid, right);
    };

    const mergeSort = async () => {
        if (sorting) return;
        setSorting(true);

        setComparing([]);
        setSwapping([]);
        setSorted([]);

        let temp = [...array];
        await mergeSortHelper(temp, 0, temp.length - 1);

        setSorted([...Array(temp.length).keys()]);
        setComparing([]);
        setSorting(false);
    };

    // ───────── HEAP SORT ─────────
    const heapify = async (arr: any[], n: number, i: number) => {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        setComparing([i, left < n ? left : i, right < n ? right : i].filter(x => x < n));
        await sleep(150);

        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        if (largest !== i) {
            setSwapping([i, largest]);
            popBars([i, largest]);

            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            setArray([...arr]);

            await sleep(150);
            setSwapping([]);

            await heapify(arr, n, largest);
        }
    };

    const heapSort = async () => {
        if (sorting) return;
        setSorting(true);

        setComparing([]);
        setSwapping([]);
        setSorted([]);

        let temp = [...array];
        const n = temp.length;

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await heapify(temp, n, i);
        }

        for (let i = n - 1; i > 0; i--) {
            setSwapping([0, i]);
            popBars([0, i]);

            [temp[0], temp[i]] = [temp[i], temp[0]];
            setArray([...temp]);

            await sleep(200);
            setSwapping([]);

            setSorted(prev => [...prev, i]);
            await heapify(temp, i, 0);
        }

        setComparing([]);
        setSwapping([]);
        setSorted([...Array(n).keys()]);
        setSorting(false);
    };


    const styles = getStyles(theme);

    return (
        <View style={styles.container}>

            <View style={styles.arrayContainer}>
                {array.map((item, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            styles.box,
                            {
                                backgroundColor: getBarColor(index),
                                transform: [{ scale: scaleAnims[index] }],
                            },
                        ]}
                    >
                        <Text style={styles.boxText}>{item}</Text>
                    </Animated.View>
                ))}
            </View>


            <View style={styles.legendContainer}>
                {legendData.map((item) => (
                    <View key={item.label} style={styles.legendContainer}>
                        <View
                            style={[
                                styles.legendDot,
                                { backgroundColor: item.color },
                            ]}
                        />
                        <Text style={[styles.legendText, { color: theme.text }]}>
                            {item.label}
                        </Text>
                    </View>
                ))}

            </View>

            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={bubbleSort}>
                    <Text style={styles.buttonText}>Bubble</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={selectionSort}>
                    <Text style={styles.buttonText}>Selection</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={insertionSort}>
                    <Text style={styles.buttonText}>Insertion</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={QuickSort}>
                    <Text style={styles.buttonText}>QuickSort</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={mergeSort}>
                    <Text style={styles.buttonText}>MergeSort</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={heapSort}>
                    <Text style={styles.boxText}>HeapSort</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={resetArray}>
                    <Text style={styles.buttonText}>Reset</Text>
                </Pressable>
            </View>

        </View>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    arrayContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },

    box: {
        width: 45,
        height: 45,
        borderRadius: 8,
        margin: 4,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },

    boxText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },

    legendContainer: {
        flexDirection: 'row',
        marginBottom: 28,
        gap: 16,
    },

    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },

    legendText: {
        fontSize: 12,
        fontWeight: '500',
    },

    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },

    button: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: theme.primary,
        margin: 6,
        minWidth: 120,
        alignItems: 'center',
    },

    buttonDisabled: {
        opacity: 0.5,
    },

    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
});
export default SortingVisual;
