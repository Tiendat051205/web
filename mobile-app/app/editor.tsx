import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { getStoredAuth } from '@/services/storage';
import { buildApiUrl } from '@/config/api';

export default function EditorScreen() {
  const params = useLocalSearchParams<{ cvId?: string; templateId?: string }>();
  const cvId = params.cvId;
  const templateId = params.templateId;

  const [token, setToken] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: 'HENRY JONES',
    title: 'Lead Sales Operations Manager',
    email: 'resume@example.com',
    phone: '(512) 555-0199',
    address: 'Austin, TX, 78701',
    summary: 'Results-oriented Retail Operations Specialist with over 5 years of experience.',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { token: storedToken } = await getStoredAuth();
      setToken(storedToken);
      if (!storedToken || !cvId) {
        router.replace('/login' as never);
        return;
      }

      try {
        const res = await fetch(buildApiUrl(`/cv/${cvId}`), {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        const data = await res.json();
        if (data.success && data.cv?.content) {
          setForm({ ...form, ...data.cv.content });
        }
      } catch {
        Alert.alert('Lỗi', 'Không thể tải dữ liệu CV.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [cvId]);

  const updateField = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveCV = async () => {
    if (!token || !cvId) return;
    try {
      const res = await fetch(buildApiUrl(`/cv/${cvId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: form, templateId }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Thành công', 'CV đã được lưu.');
      } else {
        Alert.alert('Lỗi', data.error || 'Không thể lưu CV.');
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu CV.');
    }
  };

  const exportPDF = async () => {
    if (!token || !cvId) return;
    try {
      const res = await fetch(buildApiUrl(`/cv/${cvId}/export-pdf`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.arrayBuffer();
      const file = new FileSystem.File(FileSystem.Paths.cache, `cv-${cvId}.pdf`);
      file.write(Buffer.from(blob), { encoding: 'base64' as never });
      await Sharing.shareAsync(file.uri, { mimeType: 'application/pdf', dialogTitle: 'Xuất CV PDF' });
    } catch {
      Alert.alert('Lỗi', 'Không thể xuất PDF.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>📝 Chỉnh sửa CV</Text>
      {loading ? <Text style={styles.loading}>Đang tải...</Text> : null}

      <View style={styles.card}>
        <Text style={styles.label}>Họ tên</Text>
        <TextInput style={styles.input} value={form.fullName} onChangeText={(value) => updateField('fullName', value)} />
        <Text style={styles.label}>Chức danh</Text>
        <TextInput style={styles.input} value={form.title} onChangeText={(value) => updateField('title', value)} />
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={form.email} onChangeText={(value) => updateField('email', value)} />
        <Text style={styles.label}>Điện thoại</Text>
        <TextInput style={styles.input} value={form.phone} onChangeText={(value) => updateField('phone', value)} />
        <Text style={styles.label}>Địa chỉ</Text>
        <TextInput style={styles.input} value={form.address} onChangeText={(value) => updateField('address', value)} />
        <Text style={styles.label}>Tóm tắt</Text>
        <TextInput style={[styles.input, styles.textArea]} multiline value={form.summary} onChangeText={(value) => updateField('summary', value)} />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={saveCV}>
          <Text style={styles.btnText}>Lưu CV</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={exportPDF}>
          <Text style={styles.btnText}>Xuất PDF</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  contentContainer: { padding: 20, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: '#1a3a4a', marginBottom: 12 },
  loading: { color: '#666', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  actions: { flexDirection: 'row', marginTop: 16, gap: 10 },
  primaryBtn: { flex: 1, backgroundColor: '#2C7DA0', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  secondaryBtn: { flex: 1, backgroundColor: '#28a745', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});
