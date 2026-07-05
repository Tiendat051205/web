import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { clearAuth, saveAuth } from '@/services/storage';
import { buildApiUrl } from '@/config/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập email và mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(buildApiUrl('/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        await saveAuth(data.token, data.user);
        router.replace('/(tabs)' as never);
      } else {
        Alert.alert('Đăng nhập thất bại', data.error || 'Vui lòng thử lại.');
      }
    } catch (error) {
      Alert.alert('Lỗi kết nối', 'Không thể kết nối tới backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🔐 Login</Text>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Đang đăng nhập...' : 'Login'}</Text>
        </TouchableOpacity>
        <Text style={styles.helperText}>Chưa có tài khoản?</Text>
        <TouchableOpacity onPress={() => router.replace('/register' as never)}>
          <Text style={styles.linkText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f5f7fa' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  title: { fontSize: 24, fontWeight: '700', color: '#1a3a4a', marginBottom: 18, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  primaryBtn: { backgroundColor: '#2C7DA0', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 6 },
  btnText: { color: '#fff', fontWeight: '700' },
  helperText: { color: '#666', marginTop: 12, textAlign: 'center' },
  linkText: { color: '#2C7DA0', fontWeight: '700', textAlign: 'center', marginTop: 6 },
});
