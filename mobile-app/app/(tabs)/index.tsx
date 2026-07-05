import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { clearAuth, getStoredAuth } from '@/services/storage';
import { buildApiUrl } from '@/config/api';

const initialStats = [
  { icon: '👤', value: '128', label: 'Người dùng' },
  { icon: '📄', value: '342', label: 'CV đã tạo' },
  { icon: '💬', value: '56', label: 'Bình luận' },
  { icon: '👁️', value: '890', label: 'Lượt xem' },
];

const initialTemplates = [
  {
    id: 1,
    name: 'Henry Professional',
    description: 'Mẫu CV hiện đại phù hợp ngành công nghệ',
  },
  {
    id: 2,
    name: 'Henry Simple',
    description: 'Mẫu tối giản, dễ đọc và chuyên nghiệp',
  },
];

const initialComments = [
  { id: 1, author: 'Minh', content: 'Giao diện đẹp và dễ dùng.', date: '20/06/2026' },
  { id: 2, author: 'Lan', content: 'Mẫu CV rất chuyên nghiệp.', date: '22/06/2026' },
];

const initialContacts = [
  {
    id: 1,
    author: 'An',
    subject: 'Hỗ trợ đăng nhập',
    message: 'Tôi không thể đăng nhập vào tài khoản.',
    status: 'Chưa đọc',
  },
  {
    id: 2,
    author: 'Bình',
    subject: 'Yêu cầu mẫu CV',
    message: 'Cho tôi xin mẫu CV phù hợp kinh doanh.',
    status: 'Đã đọc',
  },
];

export default function AdminScreen() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [comments, setComments] = useState(initialComments);
  const [contacts, setContacts] = useState(initialContacts);
  const [userName, setUserName] = useState('Admin');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadAuth = async () => {
      const { token: storedToken, user } = await getStoredAuth();
      setToken(storedToken);
      setUserName(user?.fullName || 'Admin');
      if (!storedToken) {
        router.replace('/login' as never);
      }
    };

    loadAuth();
  }, []);

  const handleLogout = async () => {
    await clearAuth();
    Alert.alert('Đăng xuất', 'Bạn đã đăng xuất khỏi giao diện quản trị.', [{ text: 'OK' }]);
    router.replace('/login' as never);
  };

  const updateTemplate = (id: number, field: 'name' | 'description', value: string) => {
    setTemplates((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const deleteComment = (id: number) => {
    setComments((current) => current.filter((item) => item.id !== id));
  };

  const deleteContact = (id: number) => {
    setContacts((current) => current.filter((item) => item.id !== id));
  };

  const markContactRead = (id: number) => {
    setContacts((current) =>
      current.map((item) => (item.id === id ? { ...item, status: 'Đã đọc' } : item)),
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.logoWrapper}>
          <Text style={styles.logo}>📄 JobGenius Admin</Text>
        </View>
        <View style={styles.navMenu}>
          <Text style={styles.navLink}>Trang chủ</Text>
          <Text style={styles.navLink}>Lịch sử CV</Text>
          <Text style={styles.navLink}>Giới thiệu</Text>
          <Text style={[styles.navLink, styles.navLinkActive]}>Quản trị</Text>
        </View>
        <View style={styles.authSection}>
          <Text style={styles.userName}>👤 {userName}</Text>
          <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
            <Text style={styles.btnText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.adminContainer}>
        <View style={styles.adminHeader}>
          <Text style={styles.adminTitle}>⚙️ Bảng điều khiển</Text>
          <Text style={styles.adminSubtitle}>Chào mừng Admin!</Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnPrimary]}
            onPress={async () => {
              if (!token) {
                router.replace('/login' as never);
                return;
              }
              try {
                const res = await fetch(buildApiUrl('/cv/create'), {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ templateId: 'henry_simple' }),
                });
                const data = await res.json();
                if (data.success) {
                  router.push('/(tabs)/history' as never);
                }
              } catch (error) {
                Alert.alert('Lỗi', 'Không thể tạo CV mới.');
              }
            }}>
            <Text style={styles.actionBtnText}>➕ Tạo CV mới</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>🕘 Xem lịch sử CV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>🧩 Chọn mẫu CV</Text>
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

        <View style={styles.adminSection}>
          <Text style={styles.sectionTitle}>✏️ Quản lý mẫu CV</Text>
          {templates.map((template) => (
            <View key={template.id} style={styles.templateRow}>
              <TextInput
                style={styles.input}
                value={template.name}
                onChangeText={(value) => updateTemplate(template.id, 'name', value)}
              />
              <TextInput
                style={[styles.input, styles.inputWide]}
                value={template.description}
                onChangeText={(value) => updateTemplate(template.id, 'description', value)}
              />
              <TouchableOpacity style={styles.btnSave}>
                <Text style={styles.btnText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.adminSection}>
          <Text style={styles.sectionTitle}>💬 Quản lý bình luận</Text>
          {comments.map((comment) => (
            <View key={comment.id} style={styles.listCard}>
              <View style={styles.listHeader}>
                <Text style={styles.cardTitle}>{comment.author}</Text>
                <Text style={styles.cardDate}>{comment.date}</Text>
              </View>
              <Text style={styles.cardText}>{comment.content}</Text>
              <TouchableOpacity style={styles.btnDanger} onPress={() => deleteComment(comment.id)}>
                <Text style={styles.btnText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.adminSection}>
          <Text style={styles.sectionTitle}>📧 Quản lý liên hệ</Text>
          {contacts.map((contact) => (
            <View key={contact.id} style={styles.listCard}>
              <View style={styles.listHeader}>
                <Text style={styles.cardTitle}>{contact.author}</Text>
                <Text style={styles.badge}>{contact.status}</Text>
              </View>
              <Text style={styles.cardText}>{contact.subject}</Text>
              <Text style={styles.cardText}>{contact.message}</Text>
              <View style={styles.rowActions}>
                {contact.status !== 'Đã đọc' ? (
                  <TouchableOpacity style={styles.btnRead} onPress={() => markContactRead(contact.id)}>
                    <Text style={styles.btnText}>Đọc</Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity style={styles.btnDanger} onPress={() => deleteContact(contact.id)}>
                  <Text style={styles.btnText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  logoWrapper: {
    flex: 1,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C7DA0',
  },
  navMenu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    flex: 2,
  },
  navLink: {
    color: '#333333',
    fontWeight: '500',
    marginHorizontal: 8,
    marginBottom: 4,
  },
  navLinkActive: {
    color: '#2C7DA0',
    borderBottomWidth: 2,
    borderBottomColor: '#2C7DA0',
    paddingBottom: 4,
  },
  authSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  userName: {
    color: '#333333',
    fontWeight: '500',
    marginRight: 10,
  },
  btnLogout: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnSave: {
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  btnRead: {
    backgroundColor: '#2C7DA0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  btnDanger: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  adminContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  adminHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  adminTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a3a4a',
  },
  adminSubtitle: {
    color: '#666666',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  actionBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dfe8ef',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    marginRight: 10,
    marginBottom: 10,
  },
  actionBtnPrimary: {
    backgroundColor: '#2C7DA0',
    borderColor: '#2C7DA0',
  },
  actionBtnText: {
    color: '#1a3a4a',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    width: '48%',
    marginRight: '2%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 3,
  },
  statIcon: {
    fontSize: 28,
    color: '#2C7DA0',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a3a4a',
    marginBottom: 4,
  },
  statLabel: {
    color: '#666666',
    fontSize: 14,
  },
  adminSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a3a4a',
    marginBottom: 12,
  },
  templateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
  },
  inputWide: {
    flex: 2,
  },
  listCard: {
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: '600',
    color: '#1a3a4a',
  },
  cardDate: {
    color: '#666666',
    fontSize: 12,
  },
  cardText: {
    color: '#444444',
    marginBottom: 6,
  },
  badge: {
    backgroundColor: '#ffc107',
    color: '#856404',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    overflow: 'hidden',
  },
  rowActions: {
    flexDirection: 'row',
    marginTop: 6,
  },
});
