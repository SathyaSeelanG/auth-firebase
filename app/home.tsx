import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';

export default function HomeScreen() {
    const { user } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace('/login');
        } catch (error: any) {
            Alert.alert('Error', 'Logout failed');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home</Text>
            <Text style={styles.text}>Logged in as: {user?.email}</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = {
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    text: { fontSize: 16, marginBottom: 30 },
    button: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 5, width: '100%', alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold' }
} as const;

