import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AboutScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>ℹ️ Giới thiệu về JobGenius</Text>
        <Text style={styles.subtitle}>Tạo CV chuyên nghiệp, dễ dàng và nhanh chóng chỉ trong vài phút.</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🚀 Sứ mệnh</Text>
          <Text style={styles.cardText}>
            JobGenius ra đời với mục tiêu giúp ứng viên tạo CV ấn tượng và thu hút nhà tuyển dụng ngay từ cái nhìn đầu tiên.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>✅ Tại sao chọn JobGenius?</Text>
          <Text style={styles.cardText}>{'• Hơn 50 mẫu CV đa dạng\n• Dễ sử dụng và chỉnh sửa nhanh\n• Tương thích ATS\n• Xuất PDF chỉ với 1 click'}</Text>
        </View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>📧 Gửi liên hệ</Text>
        <TextInput style={styles.input} placeholder="Họ tên" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={[styles.input, styles.textArea]} placeholder="Nội dung" value={message} onChangeText={setMessage} multiline />
        <TouchableOpacity style={styles.submitBtn}>
          <Text style={styles.submitText}>Gửi liên hệ</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  contentContainer: { padding: 20, paddingBottom: 32 },
  header: { marginBottom: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#1a3a4a', marginBottom: 6, textAlign: 'center' },
  subtitle: { color: '#666', fontSize: 14, textAlign: 'center' },
  grid: { marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#2C7DA0', marginBottom: 10 },
  cardText: { color: '#555', lineHeight: 22 },
  formCard: { backgroundColor: '#fff', borderRadius: 14, padding: 18, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  formTitle: { fontSize: 20, fontWeight: '700', color: '#2C7DA0', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12, fontSize: 14 },
  textArea: { minHeight: 110, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: '#2C7DA0', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '700' },
});
