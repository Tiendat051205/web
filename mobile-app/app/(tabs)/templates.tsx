import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { getStoredAuth } from '@/services/storage';
import { buildApiUrl } from '@/config/api';

const templates = [
  { id: 'henry_simple', title: 'Henry Simple', description: 'Mẫu 1 cột, rõ ràng, tối giản.' },
  { id: 'henry_professional', title: 'Henry Professional', description: 'Mẫu 2 cột, hiện đại và chuyên nghiệp.' },
  { id: 'henry_traditional', title: 'Henry Traditional', description: 'Mẫu cổ điển, trang trọng.' },
  { id: 'henry_modern', title: 'Henry Modern', description: 'Mẫu sáng tạo, nổi bật.' },
];

export default function TemplatesScreen() {
  const [loading, setLoading] = useState(false);

  const createCV = async (templateId: string) => {
    const { token } = await getStoredAuth();
    if (!token) {
      router.replace('/login' as never);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(buildApiUrl('/cv/create'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ templateId }),
      });
      const data = await res.json();
      if (data.success) {
        router.push({ pathname: '/editor', params: { cvId: String(data.cvId), templateId } } as never);
      } else {
        Alert.alert('Lỗi', data.error || 'Không thể tạo CV.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối tới backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>🎯 Chọn mẫu CV</Text>
      <Text style={styles.subtitle}>Chọn mẫu CV phù hợp và bắt đầu chỉnh sửa ngay trên điện thoại.</Text>
      {templates.map((tpl) => (
        <View key={tpl.id} style={styles.card}>
          <Text style={styles.cardTitle}>{tpl.title}</Text>
          <Text style={styles.cardText}>{tpl.description}</Text>
          <TouchableOpacity style={styles.btn} onPress={() => createCV(tpl.id)} disabled={loading}>
            <Text style={styles.btnText}>{loading ? 'Đang tạo...' : 'Tạo CV này'}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  contentContainer: { padding: 20, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: '#1a3a4a', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1a3a4a', marginBottom: 6 },
  cardText: { color: '#555', marginBottom: 12 },
  btn: { backgroundColor: '#2C7DA0', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});
