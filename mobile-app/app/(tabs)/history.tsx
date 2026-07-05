import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { getStoredAuth } from '@/services/storage';
import { buildApiUrl } from '@/config/api';

export default function HistoryScreen() {
  const [cvs, setCvs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCVs = async () => {
      const { token } = await getStoredAuth();
      if (!token) {
        router.replace('/login' as never);
        return;
      }

      try {
        const res = await fetch(buildApiUrl('/cvs'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setCvs(data.cvs || []);
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải danh sách CV.');
      } finally {
        setLoading(false);
      }
    };

    loadCVs();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>🕘 Lịch sử CV của tôi</Text>
        <Text style={styles.subtitle}>Những CV bạn đã tạo và chỉnh sửa trước đây.</Text>
      </View>

      {loading ? (
        <Text style={styles.emptyText}>Đang tải...</Text>
      ) : cvs.length === 0 ? (
        <Text style={styles.emptyText}>Bạn chưa có CV nào.</Text>
      ) : (
        cvs.map((cv) => (
          <View key={cv.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.badgeWrap}>
                <Text style={styles.badge}>{cv.templateId || 'CV'}</Text>
              </View>
              <Text style={styles.date}>{new Date(cv.createdAt).toLocaleDateString('vi-VN')}</Text>
            </View>
            <Text style={styles.cardTitle}>{cv.content?.fullName || 'CV chưa có tên'}</Text>
            <Text style={styles.cardPreview}>{cv.content?.summary || 'Chưa có mô tả'}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/(tabs)' as never)}>
                <Text style={styles.btnText}>Xem</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  contentContainer: { padding: 20, paddingBottom: 32 },
  header: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#1a3a4a', marginBottom: 6 },
  subtitle: { color: '#666', fontSize: 14 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 18, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  badgeWrap: { flex: 1 },
  badge: { backgroundColor: '#e8f4f8', color: '#2C7DA0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start', fontSize: 12, fontWeight: '600' },
  date: { color: '#999', fontSize: 12 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 6 },
  cardPreview: { color: '#666', fontSize: 13, lineHeight: 20, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 8 },
  emptyText: { color: '#666', fontSize: 14, textAlign: 'center', marginTop: 12 },
  btnPrimary: { backgroundColor: '#2C7DA0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, marginRight: 8 },
  btnSecondary: { backgroundColor: '#6c757d', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, marginRight: 8 },
  btnDanger: { backgroundColor: '#dc3545', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: '600' },
});
