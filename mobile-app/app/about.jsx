import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
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

// 🔴 CẬP NHẬT API Ở ĐÂY: Sửa IP và Port
const API_URL = 'http://192.190.20.103:3000/api';

export default function AboutScreen() {
  const router = useRouter();
  
  // Dữ liệu User
  const [userEmail, setUserEmail] = useState('');
  
  // Dữ liệu Form Liên hệ
  const [subject, setSubject] = useState('Góp ý');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  // ĐÃ SỬA LẠI HÀM NÀY ĐỂ LẤY EMAIL THẬT
  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userStr = await AsyncStorage.getItem('userData');

      if (!token) {
        Alert.alert('Thông báo', 'Vui lòng đăng nhập để gửi liên hệ');
        router.replace('/');
        return;
      }
      
      // Lấy thông tin user đã lưu và set Email
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.email) {
          setUserEmail(user.email); 
        } else {
          setUserEmail('Chưa có dữ liệu email');
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu user:", error);
    }
  };

  const handleContactSubmit = async () => {
    if (!message.trim()) {
      return Alert.alert('Lỗi', 'Vui lòng nhập nội dung!');
    }

    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subject, message })
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Thành công', 'Cảm ơn bạn! Tin nhắn đã được gửi.');
        setMessage(''); // Xóa form
      } else {
        Alert.alert('Lỗi', data.error || 'Gửi thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi mạng', 'Không thể kết nối đến server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        {/* Top Nav */}
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => router.push('/home')} style={styles.navItem}>
            <FontAwesome5 name="home" size={18} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/history')} style={styles.navItem}>
            <FontAwesome5 name="history" size={18} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/about')} style={styles.navItem}>
            <FontAwesome5 name="info-circle" size={18} color="#2C7DA0" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}><FontAwesome5 name="info-circle" color="#2C7DA0" /> Giới thiệu JobGenius</Text>
            <Text style={styles.subtitle}>Tạo CV chuyên nghiệp, dễ dàng và nhanh chóng</Text>
          </View>

          {/* Form Liên hệ */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}><FontAwesome5 name="envelope" color="#2C7DA0" /> Liên hệ với chúng tôi</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email của bạn (Đã khóa)</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: '#f5f5f5', color: '#999' }]} 
                value={userEmail} 
                editable={false} 
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Chủ đề</Text>
              <TextInput 
                style={styles.input} 
                value={subject} 
                onChangeText={setSubject} 
                placeholder="VD: Góp ý, Báo lỗi..." 
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nội dung *</Text>
              <TextInput 
                style={[styles.input, styles.textArea,]} 
                value={message} 
                onChangeText={setMessage} 
                placeholder="Nhập nội dung của bạn..." 
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity 
              style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]} 
              onPress={handleContactSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitBtnText}>
                {isSubmitting ? 'Đang gửi...' : 'Gửi liên hệ'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  topNav: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white', paddingVertical: 15, marginTop: 40, borderBottomWidth: 1, borderColor: '#eee' },
  navItem: { padding: 10 },
  content: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a3a4a', marginBottom: 10 },
  subtitle: { color: '#666', textAlign: 'center' },
  formContainer: { backgroundColor: 'white', padding: 25, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, elevation: 5 },
  formTitle: { fontSize: 20, fontWeight: 'bold', color: '#2C7DA0', marginBottom: 20 },
  inputGroup: { marginBottom: 15 },
  label: { fontWeight: 'bold', marginBottom: 8, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, backgroundColor: 'white', fontSize: 14 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: '#2C7DA0', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});