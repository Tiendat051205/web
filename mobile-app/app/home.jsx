import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [userData, setUserData] = useState({});
  const [activeFilter, setActiveFilter] = useState('all'); 
  
  const [adImageSource, setAdImageSource] = useState(null);

  const isAdminUser = (user) => {
    const role = String(user.role || '').toLowerCase();
    const isAdminFlag = user.isAdmin === true || user.isAdmin === 1 || user.isAdmin === '1';
    return role === 'admin' || isAdminFlag;
  };

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userStr = await AsyncStorage.getItem('userData');
      if (token && userStr) {
        const user = JSON.parse(userStr);
        setIsLoggedIn(true);
        setUserData(user);
        setUserName(user.fullName || 'Admin'); 
      }
    } catch (error) { 
      console.error(error); 
    }
  };

  // Mảng gốc chứa đúng 4 ảnh CV
  const cvTemplates = [
    {
      id: 'henry_simple',
      name: 'Henry Jones - Simple',
      category: 'Đơn giản · Chuyên nghiệp',
      desc: 'Mẫu CV bố cục 1 cột, rõ ràng, tập trung vào nội dung.',
      img: require('../assets/images/Simple.jpeg'), 
      tags: ['ATS-Friendly', 'Miễn phí']
    },
    {
      id: 'henry_professional',
      name: 'Henry Jones - Professional',
      category: '2 cột · Hiện đại',
      desc: 'Mẫu CV 2 cột, nổi bật kỹ năng và thông tin liên hệ.',
      img: require('../assets/images/Professional.jpeg'),
      tags: ['ATS-Friendly', 'Miễn phí']
    },
    {
      id: 'henry_traditional',
      name: 'Henry Jones - Traditional',
      category: 'Cổ điển · Trang trọng',
      desc: 'Mẫu CV truyền thống, phù hợp vị trí quản lý cấp cao.',
      img: require('../assets/images/Tranditional.jpeg'),
      tags: ['Executive', 'Premium']
    },
    {
      id: 'henry_modern',
      name: 'Henry Jones - Modern',
      category: 'Sáng tạo · Nổi bật',
      desc: 'Mẫu CV màu sắc nổi bật, phù hợp ngành sáng tạo.',
      img: require('../assets/images/Modern.jpeg'),
      tags: ['Creative', 'Premium']
    }
  ];

  const filters = [
    { id: 'all', label: 'Tất cả' },
    { id: 'henry_simple', label: 'Simple' },
    { id: 'henry_professional', label: 'Professional' },
    { id: 'henry_traditional', label: 'Traditional' },
    { id: 'henry_modern', label: 'Modern' }
  ];

 useEffect(() => {
    // 👇 Thêm dòng này để XÓA TRÍ NHỚ TẠM THỜI (Luôn hiện Popup để test)
    AsyncStorage.removeItem('popup_closed'); 
    
    checkLoginStatus();
    checkAdPopup();
  }, []);

  const checkAdPopup = async () => {
    try {
      const isClosed = await AsyncStorage.getItem('popup_closed');
      if (isClosed !== 'true') {
        
        // BỐC THĂM TRỰC TIẾP TỪ MẢNG CV_TEMPLATES 
        // Tránh tình trạng require nhầm file của Expo
        const randomIndex = Math.floor(Math.random() * cvTemplates.length);
        setAdImageSource(cvTemplates[randomIndex].img);

        setTimeout(() => {
          setShowAdPopup(true);
        }, 1500);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closePopup = async () => {
    setShowAdPopup(false);
    await AsyncStorage.setItem('popup_closed', 'true');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserName('');
    setUserData({});
    Alert.alert("Thành công", "Đã đăng xuất khỏi tài khoản.");
  };

  const handleSelectTemplate = async (templateId) => {
    const token = await AsyncStorage.getItem('userToken');
    
    if (!token) {
      Alert.alert('Cảnh báo', 'Vui lòng đăng nhập để tạo CV', [
        { text: 'OK', onPress: () => router.push('/') }
      ]);
      return;
    }
    router.push(`/edit?templateId=${templateId}`);
  };

  const filteredTemplates = activeFilter === 'all' 
    ? cvTemplates 
    : cvTemplates.filter(item => item.id === activeFilter);

  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
        <View style={styles.navLinks}>
          <TouchableOpacity onPress={() => router.push('/home')}>
            <FontAwesome5 name="home" size={20} color="#2C7DA0" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/history')}>
            <FontAwesome5 name="history" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/about')}>
            <FontAwesome5 name="info-circle" size={20} color="#666" />
          </TouchableOpacity>
          
          {isAdminUser(userData) && (
            <TouchableOpacity onPress={() => router.push('/admin')}>
              <FontAwesome5 name="user-shield" size={20} color="#dc3545" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.authCorner}>
          {isLoggedIn ? (
            <>
              <Text style={styles.userNameText}>Chào, {userName}</Text>
              <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
                <Text style={styles.btnLogoutText}>Đăng xuất</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.btnLogin} onPress={() => router.push('/')}>
                <Text style={styles.btnLoginText}>Đăng nhập</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSignup} onPress={() => router.push('/register')}>
                <Text style={styles.btnSignupText}>Đăng ký</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerTitle}>
          <View style={styles.titleRow}>
            <FontAwesome5 name="file-alt" size={26} color="#2C7DA0" />
            <Text style={styles.titleText}>Chọn mẫu CV yêu thích</Text>
          </View>
          <Text style={styles.subtitleText}>
            Bạn có thể dễ dàng thay đổi mẫu CV bất cứ lúc nào trong quá trình chỉnh sửa.
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateFilters}>
          {filters.map((filter) => (
            <TouchableOpacity 
              key={filter.id} 
              style={[styles.templateChip, activeFilter === filter.id && styles.templateChipActive]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text style={[styles.chipText, activeFilter === filter.id && styles.chipTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.cvGrid}>
          {filteredTemplates.map((item) => (
            <View key={item.id} style={styles.cvCard}>
              <View style={styles.imageContainer}>
                <Image source={item.img} style={styles.cvThumbnail} resizeMode="cover" />
              </View>
              
              <View style={styles.cvInfo}>
                <Text style={styles.cvName}>{item.name}</Text>
                <Text style={styles.cvCategory}>{item.category}</Text>
                <Text style={styles.cvDesc} numberOfLines={2}>{item.desc}</Text>
                
                <View style={styles.tagsContainer}>
                  {item.tags.map((tag, idx) => (
                    <View key={idx} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity 
                  style={styles.selectBtn} 
                  onPress={() => handleSelectTemplate(item.id)}
                >
                  <Text style={styles.selectBtnText}>✏️ Bắt đầu với mẫu này</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* --- POPUP QUẢNG CÁO CẬP NHẬT --- */}
      <Modal visible={showAdPopup} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeBtn} onPress={closePopup}>
              <Text style={styles.closeBtnText}>×</Text>
            </TouchableOpacity>
            
            {/* Ảnh Random an toàn từ mảng cvTemplates */}
            {adImageSource && (
              <Image 
                source={adImageSource} 
                style={styles.adImage} 
                resizeMode="cover" 
              />
            )}
            
            <Text style={styles.adTitle}>🎯 Tạo CV Chuyên Nghiệp</Text>
            <Text style={styles.adDesc}>
              Nhận ngay ưu đãi đặc biệt cho CV của bạn. Hàng trăm mẫu CV đẹp, chuẩn nhà tuyển dụng.
            </Text>
            <TouchableOpacity style={styles.adActionBtn} onPress={closePopup}>
              <Text style={styles.adActionText}>Khám phá ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 15, elevation: 4, marginTop: 40 },
  navLinks: { flexDirection: 'row', gap: 25 },
  authCorner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  userNameText: { fontSize: 14, color: '#333', fontWeight: 'bold' },
  btnLogin: { paddingHorizontal: 12, paddingVertical: 8 },
  btnLoginText: { color: '#2C7DA0', fontWeight: 'bold', fontSize: 15 },
  btnSignup: { backgroundColor: '#2C7DA0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  btnSignupText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  btnLogout: { backgroundColor: '#ff4d4f', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  btnLogoutText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  
  headerTitle: { marginTop: 25, marginBottom: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  titleText: { fontSize: 24, fontWeight: 'bold', color: '#1a3a4a' },
  subtitleText: { color: '#555', fontSize: 15, lineHeight: 22 },
  
  templateFilters: { flexDirection: 'row', marginBottom: 25 },
  templateChip: { backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, marginRight: 12, borderWidth: 1, borderColor: '#ddd', elevation: 2 },
  templateChipActive: { backgroundColor: '#2C7DA0', borderColor: '#2C7DA0' },
  chipText: { color: '#666', fontWeight: '600' },
  chipTextActive: { color: 'white' },
  
  cvGrid: { gap: 25 },
  cvCard: { backgroundColor: 'white', borderRadius: 15, overflow: 'hidden', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.15, shadowRadius: 10 },
  
  imageContainer: {
      width: '100%',
      height: 380, 
      backgroundColor: '#e9ecef',
      padding: 10, 
  },
  cvThumbnail: {
      width: '100%',
      height: '100%',
      borderRadius: 8, 
      borderWidth: 1,
      borderColor: '#e0e0e0',
  },
  
  cvInfo: { padding: 20 },
  cvName: { fontSize: 20, fontWeight: 'bold', color: '#1a3a4a', marginBottom: 6 },
  cvCategory: { fontSize: 13, color: '#888', marginBottom: 10, fontWeight: '600' },
  cvDesc: { fontSize: 15, color: '#555', marginBottom: 15, lineHeight: 22 },
  tagsContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  tag: { backgroundColor: '#e3f2fd', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  tagText: { color: '#1976d2', fontSize: 12, fontWeight: 'bold' },
  selectBtn: { backgroundColor: '#2C7DA0', paddingVertical: 15, borderRadius: 10, alignItems: 'center' },
  selectBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '88%', backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center' },
  closeBtn: { position: 'absolute', top: 10, right: 15, zIndex: 1, padding: 10 },
  closeBtnText: { fontSize: 28, color: '#999', fontWeight: 'bold' },
  
  adImage: { 
    width: '100%', 
    height: 250, 
    borderRadius: 12, 
    marginBottom: 20, 
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#eee'
  },
  adTitle: { fontSize: 22, fontWeight: 'bold', color: '#2C7DA0', marginBottom: 10 },
  adDesc: { textAlign: 'center', color: '#555', marginBottom: 25, lineHeight: 24, fontSize: 15 },
  adActionBtn: { backgroundColor: '#2C7DA0', paddingHorizontal: 35, paddingVertical: 14, borderRadius: 12 },
  adActionText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});