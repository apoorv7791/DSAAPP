import React, { useContext, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, ToastAndroid, Pressable, ScrollView, FlatList } from 'react-native';
import * as ClipBoard from 'expo-clipboard';
import { ThemeContext } from '@/theme/ThemeContext';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/context/LanguageContext';

const Recursion = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const router = useRouter();
    const { t } = useTranslation();

    const handleCopy = useCallback(async (code: string) => {
        await ClipBoard.setStringAsync(code);
        ToastAndroid.show(t('common.copied'), ToastAndroid.SHORT);
    }, [t]);

    const modules = useMemo(() => [
        {
            id: "1",
            type: "subheading",
            text: t('topicContent.recursion.title'),
        },
        {
            id: "2",
            type: "text",
            text: t('topicContent.recursion.description')
        },
        {
            id: "3",
            type: "subheading",
            text: t('topicContent.recursion.whyTitle'),
        },
        {
            id: "4",
            type: "text",
            text: t('topicContent.recursion.whyDesc')
        },
        {
            id: "5",
            type: "subheading",
            text: t('topicContent.recursion.howWorks')
        },
        {
            id: "6",
            type: "text",
            text: t('topicContent.recursion.howWorksDesc')
        },
        {
            id: "7",
            type: "code",
            language: "Java",
            dataType: "Factorial implementation",
            code: `public static int factorial(int n) {
    if (n == 0) {
        return 1;
    }
    return n * factorial(n - 1);
} 
    public static void main(){
        System.out.println(factorial(5));
    }
    output: 1 2 6 24 120`
        },
        {
            id: "8",
            type: "code",
            language: "Java",
            dataType: "Fibonacci implementation",
            code: `public static int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}
    public static void main(){
        System.out.println(fibonacci(10));
    }
    output: 0 1 1 2 3 5 8 13 21 34`
        },
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
                            <Pressable onPress={() => handleCopy(item.code)}>
                                <Text style={styles.copy}>{t('common.copy')}</Text>
                            </Pressable>

                            <Text style={styles.codeType}>
                                {item.language} • {item.dataType}
                            </Text>
                        </View>

                        <ScrollView horizontal>
                            <Text style={styles.code}>{item.code}</Text>
                        </ScrollView>
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
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.btn} onPress={() => router.push('/AdvanceVisual/recursion')}>
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
            backgroundColor: theme.mode === "dark" ? "#1e1e1e" : "#f5f5f5",
            padding: 14,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
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
            color: theme.textSecondary,
            fontSize: 12,
        },
        code: {
            color: theme.mode === "dark" ? "#fff" : "#000",
            fontFamily: "monospace",
            fontSize: 13,
            lineHeight: 20,
            flexWrap: "wrap", // 🔥 fix
        },
        copy: {
            color: theme.primary,
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
            backgroundColor: theme.mode === "dark" ? "#2a2a2a" : "#f5f5f5",
            borderRadius: 10,
            elevation: 2,
        },

        bullet: {
            marginRight: 8,
            color: theme.textSecondary,
            fontSize: 16,
        },

        listText: {
            flex: 1,
            fontSize: 16,
            color: theme.textSecondary,
        },
        btn: {
            backgroundColor: theme.primary,
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 8,
            alignSelf: "flex-start",
        },
        btnText: {
            color: "#fff",
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

export default Recursion;
