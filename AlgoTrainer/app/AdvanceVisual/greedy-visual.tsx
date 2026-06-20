import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { ThemeContext } from '@/theme/ThemeContext';

const COINS = [25, 10, 5, 1];

type Step = { value: number; count: number };

const GreedyVisualizer = () => {
    const { theme } = useContext(ThemeContext);
    // states logic
    const [amount, setAmount] = useState(67);
    const [steps, setSteps] = useState<Step[]>([]);
    const [currentCoin, setCurrentCoin] = useState<number | null>(null);
    const [remaining, setRemaining] = useState(67);
    const [running, setRunning] = useState(false);
    const [explanation, setExplanation] = useState('');

    const delay = (ms: number) =>
        new Promise(res => setTimeout(res, ms));

    const run = async () => {
        if (running) return;

        setRunning(true);
        setSteps([]);
        setRemaining(amount);

        let temp = amount;

        for (const coin of COINS) {
            setCurrentCoin(coin);
            await delay(400);

            setExplanation(`Checking ${coin}¢ coin because greedy picks the largest possible value first.`);

            const count = Math.floor(temp / coin);

            if (count > 0) {
                temp %= coin;

                setExplanation(`${coin} fits ${count} time(s). Remaining amount becomes ${temp}.`);

                setSteps(prev => [...prev, { value: coin, count }]);
                setRemaining(temp);
            } else {
                setExplanation(
                    `${coin}¢ is too large for remaining value ${temp}.`
                );
            }

            await delay(400);
        }

        setCurrentCoin(null);
        setRunning(false);
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
            <Text style={[styles.title, { color: theme.text }]}>
                Greedy Coin Change
            </Text>

            {/* Controls */}
            <View style={styles.center}>
                <View style={styles.row}>
                    <Pressable onPress={() => setAmount(a => Math.max(1, a - 1))}>
                        <Text style={styles.btn}>-</Text>
                    </Pressable>

                    <Text style={[styles.amount, { color: theme.primary }]}>
                        ${amount}
                    </Text>

                    <Pressable onPress={() => setAmount(a => Math.min(99, a + 1))}>
                        <Text style={styles.btn}>+</Text>
                    </Pressable>
                </View>

                <Pressable
                    onPress={run}
                    disabled={running}
                    style={[styles.runBtn, running && { opacity: 0.5 }]}
                >
                    <Text style={styles.runText}>Run Greedy</Text>
                </Pressable>

                <Text style={{ color: theme.textSecondary }}>
                    Remaining: {remaining}
                </Text>
            </View>

            {/* Coins */}
            <View style={styles.section}>
                <Text style={styles.label}>Coins</Text>

                <View style={styles.row}>
                    {COINS.map(c => (
                        <View
                            key={c}
                            style={[
                                styles.coin,
                                currentCoin === c && styles.activeCoin,
                            ]}
                        >
                            <Text style={{ color: theme.primary, fontWeight: 'bold' }}>
                                {c}¢
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Explanation */}
            <View style={styles.section}>
                <Text style={styles.label}>Explanation</Text>

                <View style={styles.box}>
                    <Text style={{ color: theme.text }}>
                        {explanation || 'Algorithm  reasoning wil appear here '}
                    </Text>
                </View>
            </View>

            {/* Steps */}
            <View style={styles.section}>
                <Text style={styles.label}>Steps</Text>

                <View style={styles.box}>
                    {steps.length === 0 ? (
                        <Text style={{ color: theme.textSecondary }}>
                            Press run to visualize
                        </Text>
                    ) : (
                        steps.map((s, i) => (
                            <Text key={i} style={{ color: theme.text }}>
                                {s.count} × {s.value}¢
                            </Text>
                        ))
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

export default GreedyVisualizer;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },

    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },

    center: {
        alignItems: 'center',
        marginBottom: 20,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 10,
    },

    btn: {
        fontSize: 24,
        paddingHorizontal: 12,
    },

    amount: {
        fontSize: 36,
        fontWeight: 'bold',
    },

    runBtn: {
        backgroundColor: '#4f46e5',
        padding: 10,
        borderRadius: 10,
        marginBottom: 8,
    },

    runText: {
        color: 'white',
        fontWeight: 'bold',
    },

    section: {
        marginTop: 16,
    },

    label: {
        fontSize: 12,
        opacity: 0.6,
        marginBottom: 8,
        textTransform: 'uppercase',
    },

    coin: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#4f46e5',
    },

    activeCoin: {
        backgroundColor: '#4f46e520',
        transform: [{ scale: 1.05 }],
    },

    box: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
});