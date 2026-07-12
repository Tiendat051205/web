import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// 🔴 CẬP NHẬT API Ở ĐÂY: Sửa IP và Port theo Backend của bạn
const API_URL = 'http://192.168.2.45:3000/api'; 

export default function HistoryScreen() {
  const router = useRouter();
  const [cvList, setCvList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCVHistory();
  }, []);

  const loadCVHistory = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Thông báo', 'Vui lòng đăng nhập để xem lịch sử CV');
        router.replace('/');
        return;
      }

      // 🔴 GỌI API: Lấy danh sách CV
      const response = await fetch(`${API_URL}/cvs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();

      if (result.success) {
        setCvList(result.cvs || []);
      } else {
        Alert.alert('Lỗi', result.error || 'Không tải được danh sách CV');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi mạng', 'Không thể kết nối server');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCV = async (cvId) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa CV này?', [
      { text: 'Hủy', style: 'cancel' },
      { 
        text: 'Xóa', 
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
            
            // 1. Dọn dẹp token đề phòng bị dính dấu ngoặc kép khi lưu vào máy
            const cleanToken = token ? token.replace(/^"|"$/g, '') : '';

            // 2. Gọi API với đầy đủ Headers
            const response = await fetch(`${API_URL}/cv/${cvId}`, {
              method: 'DELETE',
              headers: { 
                'Authorization': `Bearer ${cleanToken}`,
                'Content-Type': 'application/json' 
              }
            });
            const result = await response.json();
            
            if (response.ok && result.success) {
              Alert.alert('Thành công', 'Đã xóa CV');
              loadCVHistory(); // Tải lại danh sách
            } else {
              // In ra console để biết chính xác Backend đang từ chối vì lý do gì
              console.log('Lỗi từ Backend:', result);
              Alert.alert('Xóa thất bại', result.error || 'Server từ chối yêu cầu.');
            }
          } catch (error) {
            console.error(error);
            Alert.alert('Lỗi mạng', 'Không thể kết nối server để xóa.');
          }
        }
      }
    ]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <View style={styles.container}>
      {/* Top Nav */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.push('/home')} style={styles.navItem}>
          <FontAwesome5 name="home" size={18} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/history')} style={styles.navItem}>
          <FontAwesome5 name="history" size={18} color="#2C7DA0" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/about')} style={styles.navItem}>
          <FontAwesome5 name="info-circle" size={18} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}><FontAwesome5 name="history" color="#2C7DA0" /> Lịch sử CV của tôi</Text>
        <Text style={styles.pageSubtitle}>Những CV bạn đã tạo và chỉnh sửa trước đây.</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#2C7DA0" style={{ marginTop: 50 }} />
        ) : cvList.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="file-alt" size={50} color="#ccc" style={{ marginBottom: 20 }} />
            <Text style={styles.emptyTitle}>Bạn chưa có CV nào</Text>
            <TouchableOpacity style={styles.btnCreate} onPress={() => router.push('/home')}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>+ Tạo CV ngay</Text>
            </TouchableOpacity>
          </View>
        ) : (
          cvList.map(cv => {
            const content = typeof cv.content === 'string' ? JSON.parse(cv.content) : (cv.content || {});
            return (
              <View key={cv.id} style={styles.cvCard}>
                <View style={styles.cvHeaderInfo}>
                  <View style={styles.badge}><Text style={styles.badgeText}>📄 {cv.templateId || 'Mẫu CV'}</Text></View>
                  <Text style={styles.dateText}>🕒 {formatDate(cv.updatedAt || cv.createdAt)}</Text>
                </View>
                <Text style={styles.cvName}>{content.fullName || 'Chưa có tên'}</Text>
                <Text style={styles.cvTitle}>{content.title || 'Chưa có tiêu đề'}</Text>
                <Text style={styles.cvPreview} numberOfLines={2}>{content.summary || ''}</Text>
                
                <View style={styles.cvActions}>
                  <TouchableOpacity style={styles.btnEdit} onPress={() => router.push(`/edit?id=${cv.id}`)}>
                    <Text style={{ color: 'white' }}>✏️ Sửa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnDelete} onPress={() => deleteCV(cv.id)}>
                    <Text style={{ color: 'white' }}>🗑️ Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  topNav: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white', paddingVertical: 15, marginTop: 40, borderBottomWidth: 1, borderColor: '#eee' },
  navItem: { padding: 10 },
  content: { padding: 20 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 5 },
  pageSubtitle: { color: '#666', marginBottom: 20 },
  emptyState: { alignItems: 'center', backgroundColor: 'white', padding: 40, borderRadius: 12, marginTop: 20 },
  emptyTitle: { fontSize: 18, color: '#666', marginBottom: 20 },
  btnCreate: { backgroundColor: '#2C7DA0', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  cvCard: { backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#2C7DA0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, elevation: 3 },
  cvHeaderInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  badge: { backgroundColor: '#e8f4f8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#2C7DA0', fontSize: 12, fontWeight: 'bold' },
  dateText: { color: '#999', fontSize: 12 },
  cvName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  cvTitle: { color: '#666', fontSize: 14, marginBottom: 10 },
  cvPreview: { color: '#888', fontSize: 13, marginBottom: 15 },
  cvActions: { flexDirection: 'row', gap: 10, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15 },
  btnEdit: { flex: 1, backgroundColor: '#2C7DA0', padding: 10, borderRadius: 6, alignItems: 'center' },
  btnDelete: { backgroundColor: '#dc3545', padding: 10, borderRadius: 6, alignItems: 'center', paddingHorizontal: 20 }
});