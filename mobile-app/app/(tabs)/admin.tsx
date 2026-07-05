import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const initialStats = [
  { icon: '👤', value: '128', label: 'Người dùng' },
  { icon: '📄', value: '342', label: 'CV đã tạo' },
  { icon: '💬', value: '56', label: 'Bình luận' },
  { icon: '👁️', value: '890', label: 'Lượt xem' },
];

const initialTemplates = [
  { id: 1, name: 'Henry Professional', description: 'Mẫu CV hiện đại phù hợp ngành công nghệ' },
  { id: 2, name: 'Henry Simple', description: 'Mẫu tối giản, dễ đọc và chuyên nghiệp' },
];

export default function AdminTabScreen() {
  const [templates, setTemplates] = useState(initialTemplates);

  const updateTemplate = (id: number, field: 'name' | 'description', value: string) => {
    setTemplates((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn đã đăng xuất khỏi giao diện quản trị.', [{ text: 'OK' }]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerBar}>
        <Text style={styles.title}>⚙️ Bảng điều khiển</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.btnText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        {initialStats.map((item, index) => (
          <View key={`${item.label}-${index}`} style={styles.statCard}>
            <Text style={styles.statIcon}>{item.icon}</Text>
            <Text style={styles.statNumber}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✏️ Quản lý mẫu CV</Text>
        {templates.map((template) => (
          <View key={template.id} style={styles.row}>
            <TextInput style={styles.input} value={template.name} onChangeText={(value) => updateTemplate(template.id, 'name', value)} />
            <TextInput style={[styles.input, styles.inputWide]} value={template.description} onChangeText={(value) => updateTemplate(template.id, 'description', value)} />
            <TouchableOpacity style={styles.saveBtn}>
              <Text style={styles.btnText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  contentContainer: { padding: 20, paddingBottom: 32 },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  title: { fontSize: 24, fontWeight: '700', color: '#1a3a4a' },
  logoutBtn: { backgroundColor: '#dc3545', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { width: '48%', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statIcon: { fontSize: 24, marginBottom: 6 },
  statNumber: { fontSize: 22, fontWeight: '700', color: '#1a3a4a' },
  statLabel: { color: '#666', fontSize: 13 },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1a3a4a', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 8, marginRight: 8 },
  inputWide: { flex: 2 },
  saveBtn: { backgroundColor: '#28a745', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 6 },
});
