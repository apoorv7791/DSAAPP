import React, { useRef, useEffect, useContext } from "react";
import { View, TouchableOpacity, Animated, StyleSheet, Dimensions, Text } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { ThemeContext } from "../theme/ThemeContext";

interface TabBarProps {
    state: BottomTabBarProps["state"];
    descriptors: BottomTabBarProps["descriptors"];
    navigation: BottomTabBarProps["navigation"];
}

const { width } = Dimensions.get("window");

const CustomTabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
    const { theme } = useContext(ThemeContext);

    const translateX = useRef(new Animated.Value(0)).current;
    const tabWidth = width / state.routes.length;

    useEffect(() => {
        Animated.spring(translateX, {
            toValue: state.index * tabWidth,
            useNativeDriver: true,
        }).start();
    }, [state.index, tabWidth]);

    return (
        <View
            style={[
                styles.tabContainer,
                {
                    backgroundColor: theme.bg,   // 🔥 FIXED
                    borderTopColor: theme.border,
                }
            ]}
        >
            <Animated.View
                style={[
                    styles.slider,
                    {
                        width: tabWidth,
                        backgroundColor: theme.primary, // 🔥 FIXED
                        transform: [{ translateX }]
                    }
                ]}
            />

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
                    color: isFocused ? theme.primary : theme.textSecondary,
                    size: 28,
                });

                return (
                    <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabButton}>
                        {icon}

                        <Text
                            style={{
                                marginTop: 4,
                                color: isFocused ? theme.primary : theme.textSecondary,
                                fontSize: 12
                            }}
                        >
                            {options.title ?? route.name}
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
        borderTopWidth: 1,
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
        height: 3,
        bottom: 0,
        borderRadius: 2,
    },
});

export default CustomTabBar;