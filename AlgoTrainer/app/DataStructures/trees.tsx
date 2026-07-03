import React, { useMemo, useContext } from 'react';
import { StyleSheet, View, Text, ToastAndroid, Pressable, ScrollView, FlatList } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/theme/ThemeContext';
import { useTranslation } from '@/context/LanguageContext';

const Trees = () => {
    const router = useRouter();
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const { t, tArray } = useTranslation();

    const data = useMemo(() => [
        {
            id: "1",
            type: "subheading",
            text: t('topicContent.trees.title')
        },
        {
            id: "2",
            type: "paragraph",
            text: t('topicContent.trees.description')
        },
        {
            id: "3",
            type: "subheading",
            text: t('topicContent.trees.whyTitle')
        },
        {
            id: "4",
            type: "paragraph",
            text: t('topicContent.trees.whyDesc')
        },
        {
            id: "5",
            type: "subheading",
            text: t('topicContent.trees.keyOps')
        },
        {
            id: "6",
            type: "list",
            items: tArray('topicContent.trees.keyOpsItems')
        },
        {
            id: "7",
            type: "code",
            language: "Java",
            dataType: "Tree Implementation",
            text: `class TreeNode {
    int data;
    TreeNode left, right;
    
    TreeNode(int item) {
        data = item;
        left = right = null;
    }
}`
        },
        {
            id: "8",
            type: "code",
            language: "Java",
            dataType: "Insertion",
            text: `void insert(int key) {
    root = insertRec(root, key);
}

TreeNode insertRec(TreeNode root, int key) {
    if (root == null) {
        root = new TreeNode(key);
        return root;
    }
    if (key < root.data)
        root.left = insertRec(root.left, key);
    else if (key > root.data)
        root.right = insertRec(root.right, key);
    
    return root;
}`
        },
        {
            id: "9",
            type: "code",
            language: "Java",
            dataType: "Deletion",
            text: `void delete(int key) {
    root = deleteRec(root, key);
}

TreeNode deleteRec(TreeNode root, int key) {
    if (root == null) return root;

    if (key < root.data)
        root.left = deleteRec(root.left, key);
    else if (key > root.data)
        root.right = deleteRec(root.right, key);
    else {
        if (root.left == null) return root.right;
        else if (root.right == null) return root.left;

        TreeNode temp = findMin(root.right);
        root.data = temp.data;
        root.right = deleteRec(root.right, temp.data);
    }
    return root;
}`
        },
        {
            id: "10",
            type: "code",
            language: "Java",
            dataType: "Traversal",
            text: `
void inorder() {
    inorderRec(root);
    if (root == null) return;
    inorderRec(root.left);
    System.out.print(root.data + " ");
    inorderRec(root.right);
}`
        }
    ], [t]);

    const handleCopy = (text: string) => {
        Clipboard.setStringAsync(text);
        ToastAndroid.show(t('common.copied'), ToastAndroid.LONG);
    }

    const renderItem = ({ item }: { item: any }) => {
        switch (item.type) {
            case "subheading":
                return <Text style={styles.heading}>{item.text}</Text>;
            case "paragraph":
                return <Text style={styles.text}>{item.text}</Text>;
            case "list":
                return (
                    <View>
                        {item.items.map((listItem: string, index: number) => (
                            <Text key={index} style={styles.text}>- {listItem}</Text>
                        ))}
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
            default:
                return null;
        }
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.btn} onPress={() => router.push("/DataVisual/tree-visual")}>
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
        heading: {
            fontSize: 24,
            fontWeight: "700",
            color: theme.text,
            marginBottom: 10,
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
            marginTop: 10,
        },
        btn: {
            backgroundColor: theme.primary,
            paddingVertical: 9,
            paddingHorizontal: 16,
            borderRadius: 6,
        },

        btnText: {
            color: "#fff",
            fontSize: 14,
            fontWeight: "600",
        },
    });


}
export default Trees;
