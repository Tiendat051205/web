import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getStoredAuth } from '@/services/storage';
import { buildApiUrl } from '@/config/api';

export default function ContactScreen() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendContact = async () => {
    const { token } = await getStoredAuth();
    if (!token) {
      Alert.alert('Cần đăng nhập', 'Vui lòng đăng nhập trước khi gửi liên hệ.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(buildApiUrl('/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject, message }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Thành công', 'Tin nhắn của bạn đã được gửi.');
        setSubject('');
        setMessage('');
      } else {
        Alert.alert('Lỗi', data.error || 'Không thể gửi liên hệ.');
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể kết nối tới backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>📧 Gửi liên hệ</Text>
      <Text style={styles.subtitle}>Hãy cho chúng tôi biết câu hỏi hoặc góp ý của bạn.</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Chủ đề</Text>
        <TextInput style={styles.input} value={subject} onChangeText={setSubject} placeholder="Ví dụ: Hỗ trợ đăng nhập" />
        <Text style={styles.label}>Nội dung</Text>
        <TextInput style={[styles.input, styles.textArea]} multiline value={message} onChangeText={setMessage} placeholder="Nội dung cần hỗ trợ" />
        <TouchableOpacity style={styles.btn} onPress={sendContact} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Đang gửi...' : 'Gửi liên hệ'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  contentContainer: { padding: 20, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: '#1a3a4a', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  btn: { backgroundColor: '#2C7DA0', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});
