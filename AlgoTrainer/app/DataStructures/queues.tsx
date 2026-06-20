import React, { useContext, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, Platform, ToastAndroid, ScrollView, Pressable, FlatList } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router'
import { ThemeContext } from '@/theme/ThemeContext';
import { useTranslation } from '@/context/LanguageContext';

const Queues = () => {
    const router = useRouter();
    const { theme } = useContext(ThemeContext);
    const { t } = useTranslation();
    const styles = getStyles(theme);

    const content = useMemo(() => [
        {
            id: "1",
            type: "subheading",
            text: t('topicContent.queues.title'),
        },
        {
            id: "2",
            type: "text",
            text: t('topicContent.queues.description'),
        },
        {
            id: "3",
            type: "subheading",
            text: t('topicContent.queues.whyTitle'),
        },
        {
            id: "4",
            type: "text",
            text: t('topicContent.queues.whyDesc'),
        },
        {
            id: "5",
            type: "code",
            language: t('common.java'),
            dataType: t('common.queueImplementation'),
            text: `class Queue {
    int queue[] = new int[100];
    int front = 0;
    int rear = -1;
    }`
        },
        {
            id: "6",
            type: "code",
            language: t('common.java'),
            dataType: t('common.enqueueOperations'),
            text: "void enqueue(int item) {\n    if (rear >= 99) {\n        System.out.println(\"Queue overflow\");\n    } else {\n        queue[++rear] = item;\n    }\n}"
        },
        {
            id: "7",
            type: "code",
            language: t('common.java'),
            dataType: t('common.dequeueOperations'),
            text: "int dequeue() {\n    if (front > rear) {\n        System.out.println(\"Queue underflow\");\n        return -1;\n    } else {\n        return queue[front++];\n    }\n}"
        },
        {
            id: "8",
            type: "code",
            language: t('common.java'),
            dataType: t('common.peekOperations'),

            text: "int peek() {\n    if (front > rear) {\n        System.out.println(\"Queue is empty\");\n        return -1;\n    } else {\n        return queue[front];\n    }\n}"
        },
        {
            id: "9",
            type: "code",
            language: t('common.java'),
            dataType: t('common.sizeOperation'),
            text: "int size() {\n    return rear - front + 1;\n}"
        },
        {
            id: "10",
            type: "list",
            items: t('topicContent.queues.listItems')
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
                        <Text style={styles.text}>{item.text}</Text>
                    </View>
                );
            case "code":
                return (
                    <View style={styles.codeBox}>
                        {item.language && item.dataType && (
                            <View style={styles.codeHeader}>
                                <Text style={styles.codeType}>{item.language} • {item.dataType}</Text>
                                <Pressable onPress={() => handleCopy(item.text)}>
                                    <Text style={styles.copy}>{t('common.copy')}</Text>
                                </Pressable>
                            </View>
                        )}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <Text style={styles.code}>{item.text}</Text>
                        </ScrollView>
                    </View>
                );
            case "list":
                return (
                    <View style={styles.section}>
                        {item.items.map((i: string, index: number) => (
                            <View key={index} style={styles.listRow}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.listText}>{i}</Text>
                            </View>
                        ))}
                    </View>
                )
            default:
                return null;
        }
    }, [handleCopy, styles, t]);

    return (
        <View style={styles.container}>
            <FlatList
                data={content}
                renderItem={renderItem}
                keyExtractor={(item) => item?.id}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.btn} onPress={() => router.push("/DataVisual/queue-visual")}>
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
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
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
        buttonContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 20,
        }
    });
}


export default Queues;
