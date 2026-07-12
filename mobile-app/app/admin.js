import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const API_URL = 'http://192.168.2.45:3000/api';

export default function AdminScreen() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('stats'); 

  const [stats, setStats] = useState({ totalUsers: 0, totalCVs: 0, totalComments: 0, totalViews: 0 });
  const [templates, setTemplates] = useState([]);
  const [comments, setComments] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const checkAdminAndLoadData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userStr = await AsyncStorage.getItem('userData'); 
      const user = userStr ? JSON.parse(userStr) : null;

      if (!token || user?.role !== 'admin') {
        Alert.alert('Từ chối truy cập', 'Chỉ Quản trị viên mới có quyền vào trang này.');
        router.replace('/home');
        return;
      }

      await fetchAllData(token);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xác thực quyền truy cập.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllData = async (token) => {
    await Promise.all([
      loadStats(token),
      loadTemplates(token),
      loadComments(token),
      loadContacts(token)
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const token = await AsyncStorage.getItem('userToken');
    await fetchAllData(token);
    setRefreshing(false);
  };

  // Tải Thống kê
  const loadStats = async (token) => {
    try {
      const res = await fetch(`${API_URL}/admin/stats`, { headers: { 'Authorization': `Bearer ${token}` }});
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (e) { console.error(e); }
  };

  // Tải & Cập nhật Mẫu CV
  const loadTemplates = async (token) => {
    try {
      const res = await fetch(`${API_URL}/admin/templates`, { headers: { 'Authorization': `Bearer ${token}` }});
      const data = await res.json();
      if (data.success) setTemplates(data.templates);
    } catch (e) { console.error(e); }
  };

  const handleUpdateTemplate = async (templateId, name, description) => {
    if (!name.trim()) return Alert.alert('Cảnh báo', 'Tên không được để trống');
    const token = await AsyncStorage.getItem('userToken');
    try {
      const res = await fetch(`${API_URL}/admin/template/${templateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, description })
      });
      const data = await res.json();
      if (data.success) Alert.alert('Thành công', 'Cập nhật mẫu CV thành công!');
      else Alert.alert('Lỗi', data.error);
    } catch (e) { Alert.alert('Lỗi mạng', 'Không thể cập nhật'); }
  };

  const updateTemplateState = (id, field, value) => {
    setTemplates(templates.map(t => t.templateId === id ? { ...t, [field]: value } : t));
  };

  // Tải & Xóa Bình luận
  const loadComments = async (token) => {
    try {
      const res = await fetch(`${API_URL}/admin/comments`, { headers: { 'Authorization': `Bearer ${token}` }});
      const data = await res.json();
      if (data.success) setComments(data.comments);
    } catch (e) { console.error(e); }
  };

  const handleDeleteComment = async (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa bình luận này?', [
      { text: 'Hủy' },
      { text: 'Xóa', style: 'destructive', onPress: async () => {
        const token = await AsyncStorage.getItem('userToken');
        try {
          const res = await fetch(`${API_URL}/admin/comments/${id}`, {
            method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            Alert.alert('Thành công', 'Đã xóa bình luận!');
            loadComments(token);
            loadStats(token);
          } else Alert.alert('Lỗi', data.error);
        } catch (e) { Alert.alert('Lỗi', 'Không thể xóa'); }
      }}
    ]);
  };

  // Tải, Đọc & Xóa Liên hệ
  const loadContacts = async (token) => {
    try {
      const res = await fetch(`${API_URL}/admin/contacts`, { headers: { 'Authorization': `Bearer ${token}` }});
      const data = await res.json();
      if (data.success) setContacts(data.contacts);
    } catch (e) { console.error(e); }
  };

  const handleMarkRead = async (id) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const res = await fetch(`${API_URL}/admin/contacts/${id}/read`, {
        method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) loadContacts(token);
    } catch (e) {}
  };

  const handleDeleteContact = async (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa liên hệ này?', [
      { text: 'Hủy' },
      { text: 'Xóa', style: 'destructive', onPress: async () => {
        const token = await AsyncStorage.getItem('userToken');
        try {
          const res = await fetch(`${API_URL}/admin/contacts/${id}`, {
            method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            Alert.alert('Thành công', 'Đã xóa liên hệ!');
            loadContacts(token);
          } else Alert.alert('Lỗi', data.error);
        } catch (e) { Alert.alert('Lỗi', 'Không thể xóa'); }
      }}
    ]);
  };

  if (isLoading) return <View style={styles.loadingCenter}><ActivityIndicator size="large" color="#2C7DA0" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/home')} style={styles.backBtn}>
          <FontAwesome5 name="arrow-left" size={18} color="#1a3a4a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}><FontAwesome5 name="cog" /> Bảng điều khiển</Text>
      </View>

      <View style={styles.tabsMenu}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { id: 'stats', icon: 'chart-bar', label: 'Thống kê' },
            { id: 'templates', icon: 'edit', label: 'Mẫu CV' },
            { id: 'comments', icon: 'comments', label: 'Bình luận' },
            { id: 'contacts', icon: 'envelope', label: 'Liên hệ' }
          ].map(tab => (
            <TouchableOpacity 
              key={tab.id} 
              style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <FontAwesome5 name={tab.icon} size={14} color={activeTab === tab.id ? 'white' : '#666'} />
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        
        {/* --- TAB THỐNG KÊ --- */}
        {activeTab === 'stats' && (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <FontAwesome5 name="users" size={28} color="#2C7DA0" />
              <Text style={styles.statNumber}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Người dùng</Text>
            </View>
            <View style={styles.statCard}>
              <FontAwesome5 name="file-alt" size={28} color="#2C7DA0" />
              <Text style={styles.statNumber}>{stats.totalCVs}</Text>
              <Text style={styles.statLabel}>CV đã tạo</Text>
            </View>
            <View style={styles.statCard}>
              <FontAwesome5 name="comments" size={28} color="#2C7DA0" />
              <Text style={styles.statNumber}>{stats.totalComments}</Text>
              <Text style={styles.statLabel}>Bình luận</Text>
            </View>
            <View style={styles.statCard}>
              <FontAwesome5 name="eye" size={28} color="#2C7DA0" />
              <Text style={styles.statNumber}>{stats.totalViews}</Text>
              <Text style={styles.statLabel}>Lượt xem</Text>
            </View>
          </View>
        )}

        {/* --- TAB MẪU CV --- */}
        {activeTab === 'templates' && (
          <View style={styles.sectionCard}>
            {templates.length === 0 ? <Text style={styles.emptyText}>Chưa có mẫu CV nào</Text> : 
              templates.map(tpl => (
                <View key={tpl.templateId} style={styles.itemCard}>
                  <Text style={styles.itemTitle}>Mã: {tpl.templateId}</Text>
                  <TextInput 
                    style={styles.input} 
                    value={tpl.name} 
                    onChangeText={(val) => updateTemplateState(tpl.templateId, 'name', val)}
                    placeholder="Tên mẫu CV"
                  />
                  <TextInput 
                    style={styles.input} 
                    value={tpl.description || ''} 
                    onChangeText={(val) => updateTemplateState(tpl.templateId, 'description', val)}
                    placeholder="Mô tả"
                  />
                  <TouchableOpacity style={styles.btnSuccess} onPress={() => handleUpdateTemplate(tpl.templateId, tpl.name, tpl.description)}>
                    <Text style={styles.btnText}><FontAwesome5 name="save" /> Lưu thay đổi</Text>
                  </TouchableOpacity>
                </View>
              ))
            }
          </View>
        )}

        {/* --- TAB BÌNH LUẬN --- */}
        {activeTab === 'comments' && (
          <View style={styles.sectionCard}>
            {comments.length === 0 ? <Text style={styles.emptyText}>Chưa có bình luận</Text> : 
              comments.map(c => {
                const displayName = c.authorName || c.authorname || c.fullName || c.fullname || c.name || 'Người dùng';
                return (
                  <View key={c.id} style={styles.itemCard}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{displayName}</Text>
                      <Text style={styles.itemDate}>{new Date(c.createdAt).toLocaleDateString('vi-VN')}</Text>
                    </View>
                    <Text style={styles.itemBody}>{c.content}</Text>
                    <TouchableOpacity style={styles.btnDanger} onPress={() => handleDeleteComment(c.id)}>
                      <Text style={styles.btnText}>Xóa bình luận</Text>
                    </TouchableOpacity>
                  </View>
                )
              })
            }
          </View>
        )}

        {/* --- TAB LIÊN HỆ --- */}
        {activeTab === 'contacts' && (
          <View style={styles.sectionCard}>
            {contacts.length === 0 ? <Text style={styles.emptyText}>Chưa có liên hệ</Text> : 
              contacts.map(c => (
                <View key={c.id} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{c.subject || 'Khác'} ({c.fullName || 'Ẩn danh'})</Text>
                    <View style={[styles.badge, c.isRead ? styles.badgeRead : styles.badgeUnread]}>
                      <Text style={styles.badgeText}>{c.isRead ? 'Đã đọc' : 'Chưa đọc'}</Text>
                    </View>
                  </View>
                  <Text style={styles.itemBody}>{c.message}</Text>
                  <View style={styles.actionRow}>
                    {!c.isRead && (
                      <TouchableOpacity style={[styles.btnSuccess, {flex: 1, marginRight: 10}]} onPress={() => handleMarkRead(c.id)}>
                        <Text style={styles.btnText}>Đánh dấu Đã đọc</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={[styles.btnDanger, {flex: 1}]} onPress={() => handleDeleteContact(c.id)}>
                      <Text style={styles.btnText}>Xóa</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            }
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, elevation: 3 },
  backBtn: { marginRight: 15 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1a3a4a' },
  tabsMenu: { backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 10, paddingHorizontal: 10 },
  tabItem: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, backgroundColor: '#f0f2f5' },
  tabItemActive: { backgroundColor: '#2C7DA0' },
  tabText: { color: '#666', fontWeight: '600' },
  tabTextActive: { color: 'white' },
  content: { padding: 15 },
  
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, justifyContent: 'space-between' },
  statCard: { width: '47%', backgroundColor: 'white', padding: 20, borderRadius: 12, alignItems: 'center', elevation: 2, marginBottom: 15 },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#1a3a4a', marginVertical: 8 },
  statLabel: { color: '#666', fontSize: 13 },
  
  sectionCard: { gap: 15 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },
  itemCard: { backgroundColor: 'white', padding: 15, borderRadius: 12, elevation: 2 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a3a4a' },
  itemDate: { fontSize: 12, color: '#999' },
  itemBody: { fontSize: 14, color: '#555', marginBottom: 15, lineHeight: 20 },
  input: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 10, marginBottom: 10, backgroundColor: '#f9f9f9' },
  
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeRead: { backgroundColor: '#d4edda' },
  badgeUnread: { backgroundColor: '#fff3cd' },
  badgeText: { fontSize: 11, fontWeight: 'bold', color: '#555' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  btnDanger: { backgroundColor: '#dc3545', padding: 10, borderRadius: 8, alignItems: 'center' },
  btnSuccess: { backgroundColor: '#28a745', padding: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 13 }
});