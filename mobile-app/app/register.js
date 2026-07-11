import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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

export default function RegisterScreen() {
  const router = useRouter();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      return Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
    }

    try {
      // Lưu ý: Thay 192.168.1.X bằng địa chỉ IP LAN thực tế của máy tính
      const response = await fetch('http://192.190.20.102:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      });
      
      const data = await response.json();

      if (response.ok) {
        Alert.alert("Thành công", "Tạo tài khoản thành công! Vui lòng đăng nhập.");
        router.push('/');
      } else {
        Alert.alert("Đăng ký thất bại", data.message || "Email đã tồn tại hoặc có lỗi xảy ra");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi mạng", "Không thể kết nối đến Server.");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.topNav}>
            <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
              <FontAwesome5 name="home" size={14} color="#4b3a8b" />
              <Text style={styles.navText}>Trang chủ</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.navItem} onPress={() => router.push('/history')}>
              <FontAwesome5 name="history" size={14} color="#4b3a8b" />
              <Text style={styles.navText}>Lịch sử CV</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => router.push('/about')}>
              <FontAwesome5 name="info-circle" size={14} color="#4b3a8b" />
              <Text style={styles.navText}>Giới thiệu</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.title}>Sign up</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, focusedInput === 'fullName' && styles.inputFocused]}
                placeholder="Enter your name"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
                onFocus={() => setFocusedInput('fullName')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, focusedInput === 'email' && styles.inputFocused]}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, focusedInput === 'password' && styles.inputFocused]}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            <TouchableOpacity onPress={handleRegister} activeOpacity={0.8}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.registerBtn}
              >
                <Text style={styles.registerBtnText}>Register</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginLinkText}>Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push('/')}>
                <Text style={styles.loginLinkHighlight}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    minHeight: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  topNav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 5,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  navText: {
    color: '#4b3a8b',
    fontWeight: '600',
    fontSize: 14,
  },
  registerContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    width: '100%',
    maxWidth: 450,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 60,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    color: '#555',
    fontWeight: '500',
    fontSize: 14,
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputFocused: {
    borderColor: '#667eea',
  },
  registerBtn: {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  registerBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginLinkText: {
    color: '#666',
    fontSize: 14,
  },
  loginLinkHighlight: {
    color: '#667eea',
    fontWeight: '600',
  },
});