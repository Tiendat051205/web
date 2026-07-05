import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { buildApiUrl } from '@/config/api';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(buildApiUrl('/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: name, email, password }),
      });
      const data = await res.json();

      if (data.success) {
        Alert.alert('Thành công', 'Đăng ký thành công, hãy đăng nhập.');
        router.replace('/login' as never);
      } else {
        Alert.alert('Đăng ký thất bại', data.error || 'Vui lòng thử lại.');
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
        <Text style={styles.title}>📝 Sign up</Text>
        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Đang xử lý...' : 'Register'}</Text>
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
});
