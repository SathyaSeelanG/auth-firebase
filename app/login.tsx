import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateInputs = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const numberRegex = /\d/;

        if (!email) {
            Toast.show({ type: 'error', text1: 'Email Required', text2: 'Please enter your email address' });
            return false;
        }
        if (!emailRegex.test(email)) {
            Toast.show({ type: 'error', text1: 'Invalid Email', text2: 'Please enter a valid email format' });
            return false;
        }
        if (!password) {
            Toast.show({ type: 'error', text1: 'Password Required', text2: 'Please enter your password' });
            return false;
        }
        if (password.length < 6 || password.length > 12) {
            Toast.show({ type: 'error', text1: 'Invalid Password', text2: 'Password must be between 6 and 12 characters' });
            return false;
        }
        if (!numberRegex.test(password)) {
            Toast.show({ type: 'error', text1: 'Invalid Password', text2: 'Password must contain at least one number' });
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!validateInputs()) return;

        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (!userCredential.user.emailVerified) {
                await signOut(auth);
                Toast.show({
                    type: 'info',
                    text1: 'Email Verification',
                    text2: 'Please verify your email before logging in.'
                });
                return;
            }
            Toast.show({ type: 'success', text1: 'Welcome back!', text2: 'Login successful' });
            router.replace('/home');
        } catch (error: any) {
            let msg = 'Login failed. Please try again.';
            if (error.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
            else if (error.code === 'auth/user-disabled') msg = 'This account has been disabled.';
            else if (error.code === 'auth/too-many-requests') msg = 'Too many attempts. Try again later.';

            Toast.show({ type: 'error', text1: 'Login Failed', text2: msg });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            Toast.show({ type: 'success', text1: 'Welcome!', text2: 'Signed in with Google' });
            router.replace('/home');
        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Google Login Error', text2: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#666" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={handleGoogleLogin} disabled={loading}>
                <Ionicons name="logo-google" size={20} color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.buttonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text style={styles.link}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = {
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    passwordInput: {
        flex: 1,
        padding: 10,
    },
    eyeIcon: {
        padding: 10,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    googleButton: {
        backgroundColor: '#DB4437',
    },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    link: { color: '#007AFF', textAlign: 'center', marginTop: 15 }
} as const;

