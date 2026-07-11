import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { getCVHtml } from './pdfGenerator';

const API_URL = 'http://192.190.20.103:3000/api'; 

export default function EditCVScreen() {
  const router = useRouter();
  
  const { templateId: urlTemplateId, id: cvId } = useLocalSearchParams();
  
  const [currentTemplateId, setCurrentTemplateId] = useState(urlTemplateId || '');
  const [currentCVId, setCurrentCVId] = useState(cvId || null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('form');

  const [formData, setFormData] = useState({
    fullName: '', jobTitle: '', phone: '', email: '', location: '', summary: '', skills: '',
    exp1_title: '', exp1_date: '', exp1_company: '', exp1_desc: '',
    exp2_title: '', exp2_date: '', exp2_company: '', exp2_desc: '',
    edu_degree: '', edu_date: '', edu_school: ''
  });

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5); 
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập');
      router.replace('/');
      return;
    }

    const userStr = await AsyncStorage.getItem('userData');
    const user = userStr ? JSON.parse(userStr) : {};
    setCurrentUser(user); 

    let activeTemplateId = currentTemplateId;

    if (currentCVId) {
      await loadCVFromServer(currentCVId, token);
      if (!activeTemplateId) {
        activeTemplateId = await getTemplateIdFromCV(currentCVId, token);
        setCurrentTemplateId(activeTemplateId);
      }
    } 

    if (activeTemplateId) {
      await loadComments(activeTemplateId);
    }
    setIsLoading(false);
  };

  const getTemplateIdFromCV = async (id, token) => {
    try {
      const res = await fetch(`${API_URL}/cv/${id}/template`, { headers: { 'Authorization': `Bearer ${token}` }});
      const data = await res.json();
      return data.success ? data.templateId : null;
    } catch (e) { return null; }
  };

  const loadCVFromServer = async (id, token) => {
    try {
      const res = await fetch(`${API_URL}/cv/${id}`, { headers: { 'Authorization': `Bearer ${token}` }});
      const result = await res.json();
      if (result.success && result.cv.content) {
        const content = typeof result.cv.content === 'string' ? JSON.parse(result.cv.content) : result.cv.content;
        
        const formattedData = { ...formData, ...content };
        if (Array.isArray(content.skills)) formattedData.skills = content.skills.join(', ');
        if (Array.isArray(content.exp1_desc)) formattedData.exp1_desc = content.exp1_desc.join('\n');
        if (Array.isArray(content.exp2_desc)) formattedData.exp2_desc = content.exp2_desc.join('\n');
        
        setFormData(formattedData);
      }
    } catch (e) { console.error(e); }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveCV = async () => {
    setIsSaving(true);
    const token = await AsyncStorage.getItem('userToken');
    
    const contentToSave = { ...formData };
    contentToSave.skills = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
    contentToSave.exp1_desc = formData.exp1_desc.split('\n').filter(Boolean);
    contentToSave.exp2_desc = formData.exp2_desc.split('\n').filter(Boolean);

    try {
      if (!currentCVId && currentTemplateId) {
        const res = await fetch(`${API_URL}/cv/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ templateId: currentTemplateId, content: contentToSave })
        });
        const data = await res.json();
        if (data.success) {
          setCurrentCVId(data.cvId);
          Alert.alert('Thành công', 'Đã tạo và lưu CV thành công!');
        } else Alert.alert('Lỗi', data.error);
      } else if (currentCVId) {
        const res = await fetch(`${API_URL}/cv/${currentCVId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ content: contentToSave })
        });
        const data = await res.json();
        if (data.success) Alert.alert('Thành công', 'Đã cập nhật CV thành công!');
        else Alert.alert('Lỗi', data.error);
      }
    } catch (e) { Alert.alert('Lỗi mạng', 'Lỗi kết nối server'); }
    setIsSaving(false);
  };

  // HÀM TIỆN ÍCH: CHÈN CSS ÉP CV VỪA VẶN 1 TRANG A4 
  const prepareHtmlForPrint = (rawHtml) => {
    return rawHtml + `
      <style>
        @page { size: A4; margin: 0; }
        body { 
            width: 210mm !important; 
            height: 297mm !important; 
            overflow: hidden !important; 
            margin: 0 !important; 
            padding: 0 !important;
            background-color: white !important;
        }
        /* Bao lô các ID và Class thường dùng bọc CV để thu nhỏ */
        #cvCard, .cv-container, .cv-wrapper, .cv-document-wrapper {
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            zoom: 0.75 !important;
            -webkit-transform: scale(0.75);
            -webkit-transform-origin: top left;
        }
      </style>
    `;
  };

  // HÀM XEM TRƯỚC CV
  const handlePreviewCV = async () => {
    try {
      const rawHtml = getCVHtml(currentTemplateId, formData);
      const printHtml = prepareHtmlForPrint(rawHtml); // Ép khung A4
      
      await Print.printAsync({
        html: printHtml
      });
    } catch (error) {
      // Đã xóa Alert báo lỗi. Giờ bạn bấm nút Cancel/Tắt máy in sẽ không bị báo lỗi mệt mỏi nữa.
      console.log('Đã đóng bản xem trước');
    }
  };

  // HÀM TẢI PDF
  const handleDownloadPDF = async () => {
    try {
      setIsSaving(true);
      const rawHtml = getCVHtml(currentTemplateId, formData);
      const printHtml = prepareHtmlForPrint(rawHtml); // Ép khung A4
      
      const { uri } = await Print.printToFileAsync({ 
        html: printHtml,
        base64: false
      });
      
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
      } else {
        Alert.alert('Lỗi', 'Thiết bị của bạn không hỗ trợ chia sẻ file.');
      }
      
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi xuất PDF', 'Đã xảy ra lỗi khi tạo file. Hãy thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const loadComments = async (templateId) => {
    try {
      const res = await fetch(`${API_URL}/public/template/${templateId}/comments`);
      const data = await res.json();
      if (data.success) setComments(data.comments);
    } catch (e) { console.error(e); }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return Alert.alert('Cảnh báo', 'Vui lòng nhập nội dung bình luận!');
    const token = await AsyncStorage.getItem('userToken');
    try {
      const res = await fetch(`${API_URL}/template/${currentTemplateId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ text: newComment, content: newComment, rating: rating })
      });
      const data = await res.json();
      if (data.success) {
        setNewComment('');
        setRating(5); 
        Alert.alert('Thành công', 'Đã gửi bình luận');
        loadComments(currentTemplateId);
      } else {
        Alert.alert('Lỗi', data.error || 'Gửi bình luận thất bại');
      }
    } catch (e) { Alert.alert('Lỗi mạng', 'Không thể gửi bình luận'); }
  };

  const handleDeleteComment = async (commentId) => {
    const token = await AsyncStorage.getItem('userToken');
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa bình luận này?', [
      { text: 'Hủy' },
      { text: 'Xóa', style: 'destructive', onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/comments/${commentId}`, {
              method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
              Alert.alert('Thành công', 'Đã xóa bình luận');
              loadComments(currentTemplateId);
            }
          } catch (e) {}
      }}
    ]);
  };

  if (isLoading) return <View style={styles.loadingCenter}><ActivityIndicator size="large" color="#2C7DA0" /></View>;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <FontAwesome5 name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa CV</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'form' && styles.activeTab]} onPress={() => setActiveTab('form')}>
          <Text style={[styles.tabText, activeTab === 'form' && styles.activeTabText]}>Nội dung CV</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'comments' && styles.activeTab]} onPress={() => setActiveTab('comments')}>
          <Text style={[styles.tabText, activeTab === 'comments' && styles.activeTabText]}>Bình luận</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'form' && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
            <TextInput style={styles.input} placeholderTextColor="#888" placeholder="Họ và Tên" value={formData.fullName} onChangeText={(v) => updateField('fullName', v)} />
            <TextInput style={styles.input} placeholderTextColor="#888" placeholder="Vị trí ứng tuyển" value={formData.jobTitle} onChangeText={(v) => updateField('jobTitle', v)} />
            <TextInput style={styles.input} placeholderTextColor="#888" placeholder="Số điện thoại" value={formData.phone} onChangeText={(v) => updateField('phone', v)} keyboardType="phone-pad" />
            <TextInput style={styles.input} placeholderTextColor="#888" placeholder="Email" value={formData.email} onChangeText={(v) => updateField('email', v)} keyboardType="email-address" />
            <TextInput style={styles.input} placeholderTextColor="#888" placeholder="Địa chỉ" value={formData.location} onChangeText={(v) => updateField('location', v)} />

            <Text style={styles.sectionTitle}>Tóm tắt (Summary)</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholderTextColor="#888" placeholder="Giới thiệu bản thân..." value={formData.summary} onChangeText={(v) => updateField('summary', v)} multiline />

            <Text style={styles.sectionTitle}>Kỹ năng (Skills)</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholderTextColor="#888" placeholder="Cách nhau bằng dấu phẩy" value={formData.skills} onChangeText={(v) => updateField('skills', v)} multiline />

            <Text style={styles.sectionTitle}>Kinh nghiệm làm việc 1</Text>
            <TextInput style={styles.input} placeholderTextColor="#888" placeholder="Chức danh" value={formData.exp1_title} onChangeText={(v) => updateField('exp1_title', v)} />
            <TextInput style={styles.input} placeholderTextColor="#888" placeholder="Công ty & Địa điểm" value={formData.exp1_company} onChangeText={(v) => updateField('exp1_company', v)} />
            <TextInput style={styles.input} placeholderTextColor="#888" placeholder="Thời gian" value={formData.exp1_date} onChangeText={(v) => updateField('exp1_date', v)} />
            <TextInput style={[styles.input, styles.textArea]} placeholderTextColor="#888" placeholder="Mô tả công việc" value={formData.exp1_desc} onChangeText={(v) => updateField('exp1_desc', v)} multiline />

            <Text style={styles.sectionTitle}>Học vấn</Text>
            <TextInput style={styles.input} placeholderTextColor="#888" placeholder="Bằng cấp" value={formData.edu_degree} onChangeText={(v) => updateField('edu_degree', v)} />
            <TextInput style={styles.input} placeholderTextColor="#888" placeholder="Trường học" value={formData.edu_school} onChangeText={(v) => updateField('edu_school', v)} />
            <TextInput style={styles.input} placeholderTextColor="#888" placeholder="Thời gian" value={formData.edu_date} onChangeText={(v) => updateField('edu_date', v)} />

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveCV} disabled={isSaving}>
                <Text style={styles.btnTextWhite}>{isSaving ? '⏳' : '💾 Lưu'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.previewBtn} onPress={handlePreviewCV} disabled={isSaving}>
                <Text style={styles.btnTextWhite}>👁️ Xem</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.downloadBtn} onPress={handleDownloadPDF} disabled={isSaving}>
                <Text style={styles.btnTextWhite}>📄 PDF</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}

        {activeTab === 'comments' && (
          <View style={styles.commentsSection}>
            <View style={styles.commentInputContainer}>
              <Text style={{fontWeight: 'bold', color: '#111', fontSize: 16, marginBottom: 12}}>Đánh giá mẫu CV này:</Text>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <FontAwesome5 
                      name="star" 
                      solid={star <= rating} 
                      size={28} 
                      color={star <= rating ? "#FFD700" : "#d3d3d3"} 
                      style={{marginRight: 10}} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.commentInputArea}>
                <TextInput 
                  style={styles.commentInput} 
                  placeholderTextColor="#888" 
                  placeholder="Viết bình luận..." 
                  value={newComment} 
                  onChangeText={setNewComment} 
                  multiline 
                />
                <TouchableOpacity style={styles.sendBtn} onPress={handleAddComment}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Gửi</Text>
                </TouchableOpacity>
              </View>
            </View>

            {comments.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#666', marginTop: 20, fontSize: 16 }}>Chưa có bình luận nào</Text>
            ) : (
              comments.map((c) => {
                const isAdmin = String(currentUser.role || '').toLowerCase() === 'admin' || currentUser.isAdmin == 1;
                const canManage = isAdmin || Number(c.userId) === Number(currentUser.id);
                const displayName = c.authorName || c.authorname || c.fullName || c.fullname || c.name || 'Người dùng';
                const ratingValue = c.rating || 5;

                return (
                  <View key={c.id} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <View style={styles.commentAvatar}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>{displayName.charAt(0).toUpperCase()}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.commentName}>{displayName}</Text>
                        
                        <View style={{flexDirection: 'row', marginTop: 4}}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <FontAwesome5 key={s} name="star" solid={s <= ratingValue} size={12} color={s <= ratingValue ? "#FFD700" : "#d3d3d3"} style={{marginRight: 3}} />
                          ))}
                        </View>

                        <Text style={styles.commentTime}>{new Date(c.createdAt).toLocaleDateString('vi-VN')}</Text>
                      </View>
                      {canManage && (
                        <TouchableOpacity style={{padding: 5}} onPress={() => handleDeleteComment(c.id)}>
                          <FontAwesome5 name="trash" size={16} color="#ff4d4f" />
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text style={styles.commentText}>{c.content}</Text>
                  </View>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, elevation: 2 },
  backBtn: { paddingRight: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1a3a4a' },
  tabContainer: { flexDirection: 'row', backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#ddd' },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderColor: '#2C7DA0' },
  tabText: { color: '#666', fontWeight: 'bold', fontSize: 16 },
  activeTabText: { color: '#2C7DA0' },
  content: { padding: 15 },
  formSection: { backgroundColor: 'white', padding: 20, borderRadius: 12, elevation: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2C7DA0', marginTop: 15, marginBottom: 12, textTransform: 'uppercase' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 14, marginBottom: 15, fontSize: 16, backgroundColor: '#fff', color: '#000' },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginTop: 20 },
  saveBtn: { flex: 1, backgroundColor: '#2C7DA0', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  previewBtn: { flex: 1, backgroundColor: '#f39c12', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  downloadBtn: { flex: 1, backgroundColor: '#6c757d', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  btnTextWhite: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  commentsSection: { flex: 1 },
  commentInputContainer: { backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 20, elevation: 1 },
  starRow: { flexDirection: 'row', marginBottom: 15 },
  commentInputArea: { flexDirection: 'row', gap: 10 },
  commentInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, minHeight: 50, fontSize: 16, color: '#000', backgroundColor: '#fff' },
  sendBtn: { backgroundColor: '#2C7DA0', justifyContent: 'center', paddingHorizontal: 20, borderRadius: 8 },
  commentItem: { backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 1 },
  commentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  commentAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#2C7DA0', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  commentName: { fontWeight: 'bold', color: '#111', fontSize: 16 },
  commentTime: { fontSize: 13, color: '#888', marginTop: 4 },
  commentText: { color: '#222', fontSize: 16, lineHeight: 24, marginTop: 5 }
});