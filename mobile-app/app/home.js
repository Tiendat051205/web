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
  
  // States quản lý dữ liệu
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [userData, setUserData] = useState({});

  // Hàm kiểm tra Admin giống auth-ui.js
  const isAdminUser = (user) => {
    const role = String(user.role || '').toLowerCase();
    const isAdminFlag = user.isAdmin === true || user.isAdmin === 1 || user.isAdmin === '1';
    return role === 'admin' || isAdminFlag;
  };

  // 1. Logic kiểm tra trạng thái đăng nhập (Đã gộp chuẩn xác)
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

  // Mảng dữ liệu các mẫu CV
  const cvTemplates = [
    {
      id: 'henry_simple',
      name: 'Henry Jones - Simple',
      category: 'Đơn giản · Chuyên nghiệp',
      desc: 'Mẫu CV bố cục 1 cột, rõ ràng, tập trung vào nội dung.',
      img: 'https://picsum.photos/id/20/400/280',
      tags: ['ATS-Friendly', 'Miễn phí']
    },
    {
      id: 'henry_professional',
      name: 'Henry Jones - Professional',
      category: '2 cột · Hiện đại',
      desc: 'Mẫu CV 2 cột, nổi bật kỹ năng và thông tin liên hệ.',
      img: 'https://picsum.photos/id/21/400/280',
      tags: ['ATS-Friendly', 'Miễn phí']
    },
    {
      id: 'henry_traditional',
      name: 'Henry Jones - Traditional',
      category: 'Cổ điển · Trang trọng',
      desc: 'Mẫu CV truyền thống, phù hợp vị trí quản lý cấp cao.',
      img: 'https://picsum.photos/id/22/400/280',
      tags: ['Executive', 'Premium']
    },
    {
      id: 'henry_modern',
      name: 'Henry Jones - Modern',
      category: 'Sáng tạo · Nổi bật',
      desc: 'Mẫu CV màu sắc nổi bật, phù hợp ngành sáng tạo.',
      img: 'https://picsum.photos/id/23/400/280',
      tags: ['Creative', 'Premium']
    }
  ];

  // Khởi chạy khi màn hình load
  useEffect(() => {
    checkLoginStatus();
    checkAdPopup();
  }, []);

  // 2. Logic kiểm tra và hiển thị Popup quảng cáo
  const checkAdPopup = async () => {
    try {
      const isClosed = await AsyncStorage.getItem('popup_closed');
      if (isClosed !== 'true') {
        setTimeout(() => {
          setShowAdPopup(true);
        }, 1500);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Hàm đóng popup
  const closePopup = async () => {
    setShowAdPopup(false);
    await AsyncStorage.setItem('popup_closed', 'true');
  };

  // Hàm đăng xuất
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData'); // Xóa luôn data user
    setIsLoggedIn(false);
    setUserName('');
    setUserData({});
    Alert.alert("Thành công", "Đã đăng xuất khỏi tài khoản.");
  };

  // 3. Logic xử lý khi bấm nút "Tạo CV này"
  const handleSelectTemplate = async (templateId) => {
    const token = await AsyncStorage.getItem('userToken');
    
    if (!token) {
      Alert.alert('Cảnh báo', 'Vui lòng đăng nhập để tạo CV', [
        { text: 'OK', onPress: () => router.push('/') }
      ]);
      return;
    }
    
    // Nếu đã đăng nhập, chuyển hướng sang trang edit
    router.push(`/edit?templateId=${templateId}`);
  };

  return (
    <View style={styles.container}>
      {/* --- THANH ĐIỀU HƯỚNG TOP --- */}
      <View style={styles.topNav}>
        <View style={styles.navLinks}>
          <TouchableOpacity onPress={() => router.push('/home')}>
            <FontAwesome5 name="home" size={18} color="#2C7DA0" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/history')}>
            <FontAwesome5 name="history" size={18} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/about')}>
            <FontAwesome5 name="info-circle" size={18} color="#666" />
          </TouchableOpacity>
          
          {/* NÚT QUẢN TRỊ - CHỈ HIỆN KHI LÀ ADMIN */}
          {isAdminUser(userData) && (
            <TouchableOpacity onPress={() => router.push('/admin')}>
              <FontAwesome5 name="user-shield" size={18} color="#dc3545" />
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
                <Text style={styles.btnLoginText}>Log in</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSignup} onPress={() => router.push('/register')}>
                <Text style={styles.btnSignupText}>Sign up</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- PHẦN HEADER --- */}
        <View style={styles.headerTitle}>
          <View style={styles.titleRow}>
            <FontAwesome5 name="file-alt" size={24} color="#2C7DA0" />
            <Text style={styles.titleText}>Select a job-winning CV template</Text>
          </View>
          <Text style={styles.subtitleText}>
            You can always change your template later. <Text style={styles.highlightText}>✨ Preview: "Professional Modern"</Text>
          </Text>
          <TouchableOpacity style={styles.chooseLaterBtn} onPress={() => Alert.alert('Thông báo', 'You can always customize your CV later.')}>
            <Text style={styles.chooseLaterText}>Choose later →</Text>
          </TouchableOpacity>
        </View>

        {/* --- THANH LỌC TEMPLATE --- */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateFilters}>
          {['Simple', 'Professional', 'Modern', 'ATS', 'Two columns', 'Europass'].map((chip, index) => (
            <TouchableOpacity key={index} style={[styles.templateChip, index === 0 && styles.templateChipActive]}>
              <Text style={[styles.chipText, index === 0 && styles.chipTextActive]}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* --- GRID DANH SÁCH CV --- */}
        <View style={styles.cvGrid}>
          {cvTemplates.map((item) => (
            <View key={item.id} style={styles.cvCard}>
              <Image source={{ uri: item.img }} style={styles.cvThumbnail} />
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
                  <Text style={styles.selectBtnText}>✏️ Tạo CV này</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* --- POPUP QUẢNG CÁO --- */}
      <Modal visible={showAdPopup} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeBtn} onPress={closePopup}>
              <Text style={styles.closeBtnText}>×</Text>
            </TouchableOpacity>
            
            <Image source={{ uri: 'https://picsum.photos/seed/ad/400/200' }} style={styles.adImage} />
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
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginTop: 40,
  },
  navLinks: {
    flexDirection: 'row',
    gap: 20,
  },
  authCorner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userNameText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  btnLogin: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  btnLoginText: {
    color: '#2C7DA0',
    fontWeight: '600',
  },
  btnSignup: {
    backgroundColor: '#2C7DA0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  btnSignupText: {
    color: 'white',
    fontWeight: '600',
  },
  btnLogout: {
    backgroundColor: '#ff4757',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnLogoutText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerTitle: {
    marginTop: 20,
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitleText: {
    color: '#666',
    marginBottom: 15,
  },
  highlightText: {
    color: '#2C7DA0',
    fontWeight: '600',
  },
  chooseLaterBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  chooseLaterText: {
    color: '#555',
    fontWeight: '600',
  },
  templateFilters: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  templateChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  templateChipActive: {
    backgroundColor: '#2C7DA0',
    borderColor: '#2C7DA0',
  },
  chipText: {
    color: '#555',
  },
  chipTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  cvGrid: {
    gap: 20,
  },
  cvCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cvThumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
  },
  cvInfo: {
    padding: 15,
  },
  cvName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cvCategory: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  cvDesc: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 15,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    color: '#1976d2',
    fontSize: 11,
    fontWeight: 'bold',
  },
  selectBtn: {
    backgroundColor: '#2C7DA0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 1,
  },
  closeBtnText: {
    fontSize: 28,
    color: '#999',
  },
  adImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 15,
  },
  adTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C7DA0',
    marginBottom: 10,
  },
  adDesc: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  adActionBtn: {
    backgroundColor: '#2C7DA0',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  adActionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});