import React, { useRef, useEffect } from "react";
import { View, TouchableOpacity, Animated, StyleSheet, Dimensions, Text } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

interface TabBarProps {
    state: BottomTabBarProps["state"];
    descriptors: BottomTabBarProps["descriptors"];
    navigation: BottomTabBarProps["navigation"];
}

const { width } = Dimensions.get("window");

const CustomTabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const tabWidth = width / state.routes.length;

    useEffect(() => {
        Animated.spring(translateX, {
            toValue: state.index * tabWidth,
            useNativeDriver: true,
        }).start();
    }, [state.index, tabWidth]);

    return (
        <View style={styles.tabContainer}>
            <Animated.View style={[styles.slider, { width: tabWidth, transform: [{ translateX }] }]} />
            {state.routes.map((route, index) => {
                const descriptor = descriptors[route.key];
                const options = descriptor.options;
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const icon = options.tabBarIcon?.({
                    focused: isFocused,
                    color: isFocused ? "#6c5ce7" : "#222",
                    size: 28,
                });

                // Get the title from options
                const label = options.title ?? route.name;

                return (
                    <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabButton}>
                        {icon ? (
                            typeof icon === "string" ? <Text>{icon}</Text> : icon
                        ) : (
                            <View style={{ width: 28, height: 28 }} />
                        )}
                        <Text style={{ marginTop: 4, color: isFocused ? "#6c5ce7" : "#222", fontSize: 12 }}>
                            {options.title ?? route.name}   {/* Wrapped in Text */}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: "row",
        height: 70,
        elevation: 10,
        backgroundColor: "#fff",
        borderTopWidth: 0,
        position: "relative",
        paddingBottom: 10,
    },
    tabButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    slider: {
        position: "absolute",
        height: 4,
        backgroundColor: "#6c5ce7",
        bottom: 0,
        borderRadius: 2,
    },
});

export default CustomTabBar;