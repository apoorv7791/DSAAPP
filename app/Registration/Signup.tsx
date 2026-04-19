import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ToastAndroid
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { ThemeContext } from '../theme/ThemeContext';

const Signup = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        if (!email || !password) {
            ToastAndroid.show("Enter email and password", ToastAndroid.SHORT);
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        } else {
            ToastAndroid.show("Account created 🚀", ToastAndroid.SHORT);
            console.log(data);

            // 👉 NEXT: yaha bhi redirect kar sakte ho (login ya home)
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>

            <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                placeholder="Password"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const getStyles = (theme: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            justifyContent: 'center',
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
        },
        input: {
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
        },
        button: {
            backgroundColor: '#000',
            padding: 15,
            borderRadius: 8,
            marginTop: 10,
        },
        buttonText: {
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
        },
    });
};

export default Signup;