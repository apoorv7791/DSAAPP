import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { ToastAndroid } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/theme/ThemeContext';
import { useTranslation } from '@/context/LanguageContext';

const Arrays = () => {
    const router = useRouter();
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const { t } = useTranslation();

    const content = useMemo(() => [
        {
            id: "1",
            type: "subheading",
            text: t('topicContent.arrays.whatIs'),
        },
        {
            id: "2",
            type: "text",
            text: t('topicContent.arrays.whatIsDesc'),
        },
        {
            id: "3",
            type: "subheading",
            text: t('topicContent.arrays.whyUse'),
        },
        {
            id: "4",
            type: "text",
            text: t('topicContent.arrays.whyUseDesc'),
        },
        {
            id: "5",
            type: "list",
            items: [
                t('topicContent.arrays.withoutArrays'),
                t('topicContent.arrays.hardToProcess'),
                t('topicContent.arrays.noStructuredWay'),
                t('topicContent.arrays.memoryInefficient')
            ],
        },
        {
            id: "6",
            type: "code",
            text: "// Without Array\nint a = 10;\nint b = 20;\nint c = 30;\n\n// With Array\nint[] arr = {10, 20, 30};",
            language: t('common.java'),
            dataType: t('common.comparison'),
        },
        {
            id: "7",
            type: "text",
            text: t('topicContent.arrays.solveDescription'),
        },
        {
            id: "8",
            type: "code",
            text: "int[] arr = {10, 20, 30, 40};",
            language: t('common.java'),
            dataType: t('common.integerArray'),
        },
        {
            id: "9",
            type: "code",
            text: "Accessing elements: arr[0] = {10};\n arr[1] = {20}; \n arr[2] = {30};\n arr[3] = {40};",
            language: t('common.java'),
            dataType: t('common.integerArray'),
        },
        {
            id: "10",
            type: "subheading",
            text: t('topicContent.arrays.keyPoints'),
        },
        {
            id: "11",
            type: "list",
            items: [
                t('topicContent.arrays.fixedSize'),
                t('topicContent.arrays.fastAccess'),
                t('topicContent.arrays.contiguousMemory'),
            ],
        },
        {
            id: "12",
            type: "subheading",
            text: t('topicContent.arrays.operations'),
        },
        {
            id: "13",
            type: "list",
            items: [
                t('topicContent.arrays.traversal'),
                t('topicContent.arrays.insertion'),
                t('topicContent.arrays.deletion'),
                t('topicContent.arrays.searching'),
            ],
        },
        {
            id: "14",
            type: "subheading",
            text: t('topicContent.arrays.tryYourself'),
        },
        {
            id: "15",
            type: "code",
            text: "// Print all elements\nfor(int i=0; i<arr.length; i++){\n   System.out.println(arr[i]);\n}",
            language: t('common.java'),
            dataType: t('common.practice'),
        },
        {
            id: "16",
            type: "code",
            text: "// search an element (20)\nboolean found = false;\nfor(int i=0; i<arr.length; i++){\n   if(arr[i] == 20){\n       found = true;\n       break;\n   }\n}",
            language: t('common.java'),
            dataType: t('common.practice'),
        },
        {
            id: "17",
            type: "code",
            text: "// Insert an element at a specific index\nint[] newArr = new int[arr.length + 1];\nfor(int i=0; i<index; i++){\n   newArr[i] = arr[i];\n}\nnewArr[index] = element;\nfor(int i=index; i<arr.length; i++){\n   newArr[i+1] = arr[i];\n}",
            language: t('common.java'),
            dataType: t('common.practice'),
        },
        {
            id: "18",
            type: "code",
            text: "// Delete an element at a specific index\nvoid deleteAtIndex(int[] arr, int n, int index) {\n    if (index < 0 || index >= n) {\n        System.out.println(\"Invalid index\");\n        return;\n    }\n\n    // Shift elements to the left\n    for (int i = index; i < n - 1; i++) {\n        arr[i] = arr[i + 1];\n    }\n\n    // Reduce size\n    n = n - 1;\n}",
            language: t('common.java'),
            dataType: t('common.practice'),
        },
        {
            id: "19",
            type: "code",
            text: "// Search for en element in log time using binary search (sorted array)\nboolean binarySearch(int[] arr, int target) {\n    int left = 0, right = arr.length - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return true;\n        else if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return false;\n}",
            language: t('common.java'),
            dataType: t('common.practice'),
        },

    ], [t]);

    const handleCopy = async (text: string) => {
        await Clipboard.setStringAsync(text);
        ToastAndroid.show(t('common.copied'), ToastAndroid.LONG);
    }

    const renderItem = useCallback(({ item }: any) => {
        switch (item.type) {
            case "subheading":
                return (
                    <View style={styles.section}>
                        <Text style={styles.subHeading}>{item.text}</Text>
                    </View>
                );
            case "text":
                return (
                    <View style={styles.section}>
                        <Text style={styles.text}>
                            {item.text}
                        </Text>
                    </View>
                );
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
            case "list":
                return (
                    <View>
                        {item.items.map((i: string, index: number) => (
                            <View key={index} style={styles.listRow}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.listText}>{i}</Text>
                            </View>
                        ))}
                    </View>
                );
            default:
                return null;
        }
    }, [handleCopy, styles, t]);

    return (
        <View style={styles.container}>
            <FlatList
                data={content}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.btn} onPress={() => router.push("/DataVisual/array-visual")}>
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
        listRow: {
            flexDirection: "row",
            alignItems: "flex-start",
            marginBottom: 8,
        },
        bullet: {
            marginRight: 8,
            color: theme.textSecondary,
            fontSize: 16,
        },
        codeHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
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
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 20,
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
};
export default Arrays;