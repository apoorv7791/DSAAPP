import React from 'react';
import { StyleSheet, View, Text, ToastAndroid } from 'react-native';
import * as Clipboard from 'expo-clipboard';

const Searching = () => {
    const moudle = [
        {
            id: "1",
            type: "subheading",
            title: "Searching Algorithms",
            description: "Searching is the process of finding a specific element in a collection of elements. \n There are many different searching algorithms, each with their own advantages and disadvantages.\n"
        },
        {
            id: "2",
            type: "list",
            title: "Types of Searching Algorithms",
            list: [
                "Linear Search",
                "Binary Search",
            ]
        },
        {
            id: "3",
            type: "code",
            language: "Java",
            dataType: "Array",
            code: `public class LinearSearch {
    public static int search(int[] arr, int x) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == x) {
                return i;
            }
        }
        return -1;
    }
}`
        },
        {
            id: "4",
            type: "code",
            language: "Java",
            dataType: "Array",
            code: `public class BinarySearch {
    public static int search(int[] arr, int x) {
        int left = 0;
        int right = arr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == x) {
                return mid;
            }
            if (arr[mid] < x) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }
}`
        }
    ]
    const handleCopy = async (code: string) => {
        await Clipboard.setStringAsync(code);
        ToastAndroid.show('Code copied to clipboard', ToastAndroid.SHORT);
    }
    const renderItem = ({ item }: { item: any }) => {
        switch (item.type) {
            case "text":
                return <Text key={item.id}>{item.text}</Text>;
            case "list":
                return <Text key={item.id}>{item.title}</Text>;
            case "code":
                return <Text key={item.id}>{item.code}</Text>;
            default:
                return null;
        }
    }
    return (
        <View style={styles.container}>
        </View>
    );
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

export default Searching;
