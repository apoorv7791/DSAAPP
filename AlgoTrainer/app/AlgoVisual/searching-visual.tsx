import React, { useState, useRef, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
} from 'react-native';

import { ThemeContext } from '@/theme/ThemeContext';
import { useTranslation } from '@/app/context/LanguageContext';

const INITIAL_ARRAY = [11, 12, 22, 25, 34, 64, 90];

const SearchingVisual = () => {
    const { theme } = useContext(ThemeContext);
    const { t } = useTranslation();

    const [array] = useState(INITIAL_ARRAY);

    const [searching, setSearching] = useState(false);

    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [foundIndex, setFoundIndex] = useState<number | null>(null);
    const [leftIndex, setLeftIndex] = useState<number | null>(null);
    const [rightIndex, setRightIndex] = useState<number | null>(null);

    const TARGET = 34;

    const scaleAnims = useRef(
        INITIAL_ARRAY.map(() => new Animated.Value(1))
    ).current;

    const sleep = (ms: number) =>
        new Promise(res => setTimeout(res, ms));

    const popBar = (index: number) => {
        Animated.sequence([
            Animated.timing(scaleAnims[index], {
                toValue: 1.25,
                duration: 100,
                useNativeDriver: true,
            }),

            Animated.timing(scaleAnims[index], {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const getBarColor = (index: number) => {
        if (foundIndex === index) return '#4CAF50';

        if (currentIndex === index) return '#FFC107';

        if (index === leftIndex || index === rightIndex)
            return '#2196F3';

        return theme.primary;
    };

    // ───────── LINEAR SEARCH ─────────
    const linearSearch = async () => {
        if (searching) return;

        setSearching(true);
        setCurrentIndex(null);
        setFoundIndex(null);

        for (let i = 0; i < array.length; i++) {
            setCurrentIndex(i);

            popBar(i);

            await sleep(500);

            if (array[i] === TARGET) {
                setFoundIndex(i);
                break;
            }
        }

        setCurrentIndex(null);
        setSearching(false);
    };
    const binarySearch = async () => {
        if (searching) return;

        setSearching(true);

        setCurrentIndex(null);
        setFoundIndex(null);

        let left = 0;
        let right = array.length - 1;

        while (left <= right) {

            setLeftIndex(left);
            setRightIndex(right);

            let mid = Math.floor((left + right) / 2);

            setCurrentIndex(mid);

            popBar(mid);

            await sleep(700);

            if (array[mid] === TARGET) {
                setFoundIndex(mid);
                break;
            }

            if (array[mid] < TARGET) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        setCurrentIndex(null);
        setLeftIndex(null);
        setRightIndex(null);

        setSearching(false);
    };
    const resetSearch = () => {
        if (searching) return;

        setCurrentIndex(null);
        setFoundIndex(null);

        scaleAnims.forEach(anim => anim.setValue(1));
    };

    const legendData = [
        { label: t('common.searchingLabel'), color: '#FFC107' },
        { label: t('common.foundLabel'), color: '#4CAF50' },
    ];

    const styles = getStyles(theme);

    return (
        <View style={styles.container}>

    

            <Text style={styles.subtitle}>
                {t('common.target')}: {TARGET}
            </Text>

            {/* ARRAY */}
            <View style={styles.arrayContainer}>

                {array.map((item, index) => (
                    <View
                        key={index}
                        style={{
                            alignItems: 'center',
                        }}
                    >

                        {/* POINTER LABELS */}
                        <View
                            style={{
                                height: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >

                            {leftIndex === index && (
                                <Text
                                    style={{
                                        color: '#f3216eff',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    L
                                </Text>
                            )}

                            {currentIndex === index && (
                                <Text
                                    style={{
                                        color: '#ff0707ff',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    M
                                </Text>
                            )}

                            {rightIndex === index && (
                                <Text
                                    style={{
                                        color: '#3f0c8cff',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    R
                                </Text>
                            )}

                        </View>

                        <Animated.View
                            style={[
                                styles.box,
                                {
                                    backgroundColor: getBarColor(index),
                                    transform: [
                                        { scale: scaleAnims[index] },
                                    ],
                                },
                            ]}
                        >
                            <Text style={styles.boxText}>
                                {item}
                            </Text>
                        </Animated.View>

                    </View>
                ))}

            </View>

            {/* LEGEND */}
            <View style={styles.legendContainer}>
                {legendData.map((item) => (
                    <View
                        key={item.label}
                        style={styles.legendItem}
                    >
                        <View
                            style={[
                                styles.legendDot,
                                {
                                    backgroundColor: item.color,
                                },
                            ]}
                        />

                        <Text
                            style={[
                                styles.legendText,
                                { color: theme.text },
                            ]}
                        >
                            {item.label}
                        </Text>
                    </View>
                ))}
            </View>

            {/* BUTTONS */}
            <View style={styles.buttonContainer}>

                <Pressable
                    style={[
                        styles.button,
                        searching && styles.buttonDisabled,
                    ]}
                    onPress={linearSearch}
                    disabled={searching}
                >
                    <Text style={styles.buttonText}>
                        {t('topicContent.searching.linearTitle')}
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.button,
                        searching && styles.buttonDisabled,
                    ]}
                    onPress={binarySearch}
                    disabled={searching}
                >
                    <Text style={styles.buttonText}>
                        {t('topicContent.searching.binaryTitle')}
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.button,
                        searching && styles.buttonDisabled,
                    ]}
                    onPress={resetSearch}
                    disabled={searching}
                >
                    <Text style={styles.buttonText}>
                        {t('common.reset')}
                    </Text>
                </Pressable>

            </View>

        </View>
    );
};

const getStyles = (theme: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.background,
        },

        title: {
            fontSize: 26,
            fontWeight: 'bold',
            marginBottom: 8,
            color: theme.text,
        },

        subtitle: {
            fontSize: 16,
            marginBottom: 28,
            color: theme.textSecondary,
        },

        arrayContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: 30,
        },

        box: {
            width: 50,
            height: 50,
            borderRadius: 10,
            margin: 6,
            justifyContent: 'center',
            alignItems: 'center',

            elevation: 4,

            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.2,
            shadowRadius: 3,
        },

        boxText: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 15,
        },

        legendContainer: {
            flexDirection: 'row',
            gap: 18,
            marginBottom: 30,
        },

        legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        legendDot: {
            width: 12,
            height: 12,
            borderRadius: 6,
            marginRight: 6,
        },

        legendText: {
            fontSize: 13,
            fontWeight: '500',
        },

        buttonContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
        },

        button: {
            backgroundColor: theme.primary,
            paddingVertical: 12,
            paddingHorizontal: 18,
            borderRadius: 10,
            margin: 6,
            minWidth: 140,
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
};

export default SearchingVisual;