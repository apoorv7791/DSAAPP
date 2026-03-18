import React from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';

const Arrays = () => {
    const content = [
        {
            type: "Subheading",
            text: "What is an Array?",
        },
        {
            type: "text",
            text: "An array is a collection of elements stored in contiguous memory locations.",
        },
        {
            type: "code",
            text: "int[] arr = {10, 20, 30, 40};",
            language: "Java",
            dataType: "Integer Array",
        },
        {
            type: "subheading",
            text: "Key Points",
        },
        {
            type: "list",
            items: [
                "Fixed size",
                "Fast access",
                "Contiguous memory",
            ],
        },
    ]
    const renderItem = ({ item }: { item: typeof content[0] }) => {
        switch (item.type) {
            case "Heading":
                return <Text style={styles.heading}>{item.text}</Text>;
            case "Subheading":
                return <Text style={styles.subHeading}>{item.text}</Text>;
            case "text":
                return <Text style={styles.text}>{item.text}</Text>;
            case "code":
                return (
                    <View style={styles.codeBox}>
                        <Text style={styles.codeType}>{item.language} . {item.dataType}</Text>
                        <Text style={styles.code}>{item.text}</Text>
                    </View>
                );
            case "list":
                return (
                    <View style={styles.listContainer}>
                        {item.items && item.items.map((i, index) => (
                            <Text key={index} style={styles.listItem}>
                                • {i}
                            </Text>
                        ))}
                    </View>
                )

            default:
                return null;
        }
    };
    return (
        <View style={styles.container}>
            <FlatList
                style={styles.container}
                data={content}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginBottom: 20,
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    subHeading: {
        fontSize: 20,
        fontWeight: "700",
        marginTop: 20,
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        color: "#555",
        lineHeight: 24, // 🔥 big difference
    },

    codeBox: {
        backgroundColor: "#1e1e1e", // 🔥 proper dev feel
        padding: 14,
        borderRadius: 12,
        marginVertical: 12,
    },

    code: {
        color: "#fff",
        fontFamily: "monospace",

    },
    codeType: {
        color: "#aaa",
        fontSize: 12,
        marginBottom: 6,
    },
    listContainer: {
        marginTop: 4,
    },

    listItem: {
        fontSize: 16,
        color: "#555",
        marginVertical: 4,
        paddingLeft: 6, // 🔥 slight indent
    }

})

export default Arrays;
