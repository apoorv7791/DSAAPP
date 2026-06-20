import React, { useContext, useMemo } from 'react';
import { StyleSheet, View, Text, ToastAndroid, FlatList, ScrollView, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { ThemeContext } from '@/theme/ThemeContext';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/context/LanguageContext';

const Searching = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const router = useRouter();
    const { t } = useTranslation();

    const modules = useMemo(() => [
        {
            id: "1",
            type: "subheading",
            title: t('topicContent.searching.title'),
            description: t('topicContent.searching.desc')
        },
        {
            id: "2",
            type: "list",
            title: t('categories.algorithms'),
            list: [t('topicContent.searching.linearTitle'), t('topicContent.searching.binaryTitle')]
        },
        {
            id: "3",
            type: "subheading",
            title: t('topicContent.searching.linearTitle'),
            description: t('topicContent.searching.linearDesc')
        },
        {
            id: "4",
            type: "subheading",
            title: t('topicContent.searching.binaryTitle'),
            description: t('topicContent.searching.binaryDesc')
        },
        {
            id: "5",
            type: "code",
            title: `${t('topicContent.searching.linearTitle')} ${t('common.copy')}`,
            language: t('common.java'),
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
            id: "6",
            type: "code",
            title: `${t('topicContent.searching.binaryTitle')} ${t('common.copy')}`,
            language: t('common.java'),
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
    ], [t]);
    const handleCopy = async (code: string) => {
        await Clipboard.setStringAsync(code);
        ToastAndroid.show(t('common.copied'), ToastAndroid.LONG);
    }
    const renderItem = ({ item }: { item: any }) => {
        switch (item.type) {
            case "subheading":
                return (
                    <View style={styles.section}>
                        <Text style={styles.subHeading}>{item.title}</Text>
                        <Text style={styles.text}>{item.description}</Text>
                    </View>
                );
            case "list":
                return (
                    <View style={styles.section}>
                        <Text style={styles.subHeading}>{item.title}</Text>
                        {item.list.map((listItem: string, index: number) => (
                            <View key={index} style={styles.listItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.listText}>{listItem}</Text>
                            </View>
                        ))}
                    </View>
                );
            case "code":
                return (
                    <View style={styles.section}>
                        <Text style={styles.subHeading}>{item.title}</Text>
                        {item.description && <Text style={styles.text}>{item.description}</Text>}

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
                );
            default:
                return null;
        }
    };
    return (
        <View style={styles.container}>
            <FlatList
                data={modules}
                renderItem={renderItem}
                keyExtractor={(item => item.id)}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.btn} onPress={() => router.push("/AlgoVisual/searching-visual")}>
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
            alignSelf: "flex-start",

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

export default Searching;
