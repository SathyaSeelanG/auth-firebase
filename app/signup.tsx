import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';

export default function SignupScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateInputs = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const numberRegex = /\d/;

        if (!email) {
            Toast.show({ type: 'error', text1: 'Email Required', text2: 'Please enter an email' });
            return false;
        }
        if (!emailRegex.test(email)) {
            Toast.show({ type: 'error', text1: 'Invalid Email', text2: 'Please enter a valid email format' });
            return false;
        }
        if (!password) {
            Toast.show({ type: 'error', text1: 'Password Required', text2: 'Please enter a password' });
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
        if (password !== confirmPassword) {
            Toast.show({ type: 'error', text1: 'Password Mismatch', text2: 'Passwords do not match' });
            return false;
        }
        return true;
    };

    const handleSignup = async () => {
        if (!validateInputs()) return;

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredential.user);

            Toast.show({
                type: 'success',
                text1: 'Verification Sent',
                text2: 'Check your email to verify your account'
            });
            router.replace('/login');
        } catch (error: any) {
            let msg = 'Signup failed. Please try again.';
            if (error.code === 'auth/email-already-in-use') msg = 'This email is already in use.';
            else if (error.code === 'auth/invalid-email') msg = 'The email address is invalid.';
            else if (error.code === 'auth/weak-password') msg = 'The password is too weak.';

            Toast.show({ type: 'error', text1: 'Signup Failed', text2: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
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
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="#666" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.link}>Already have an account? Login</Text>
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
    button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    link: { color: '#007AFF', textAlign: 'center', marginTop: 15 }
} as const;

