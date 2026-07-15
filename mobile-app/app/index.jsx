import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Cảnh báo", "Vui lòng nhập đủ Email và Mật khẩu!");
    }

    try {
      const response = await fetch('http://192.190.20.103:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.token);
        if (data.user) {
          await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        }
        Alert.alert("Thành công", "Đăng nhập thành công!");
        router.replace('/home'); 
      } else {
        Alert.alert("Đăng nhập thất bại", data.message || "Sai tài khoản hoặc mật khẩu");
      }
    } catch (error) {
      Alert.alert("Lỗi mạng", "Không thể kết nối đến Server. Hãy kiểm tra lại IP LAN.");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.topNav}>
            <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
              <FontAwesome5 name="home" size={14} color="#1f4d6b" />
              <Text style={styles.navText}>Trang chủ</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.title}>Đăng nhập</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mật khẩu</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
              <Text style={styles.loginBtnText}>Đăng nhập</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.registerLink}>Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradientBackground: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 40 },
  topNav: { flexDirection: 'row', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 20, marginBottom: 30, elevation: 5 },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  navText: { color: '#1f4d6b', fontWeight: 'bold', fontSize: 14 },
  loginContainer: { width: '100%', maxWidth: 400, backgroundColor: 'white', padding: 30, borderRadius: 15, elevation: 10 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#333' },
  inputGroup: { marginBottom: 20 },
  label: { marginBottom: 8, color: '#555', fontWeight: 'bold', fontSize: 14 },
  input: { width: '100%', padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, fontSize: 16, color: '#333' },
  loginBtn: { width: '100%', padding: 15, backgroundColor: '#4facfe', borderRadius: 8, alignItems: 'center', marginTop: 10 },
  loginBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerText: { color: '#666', fontSize: 14 },
  registerLink: { color: '#2196f3', fontWeight: 'bold', fontSize: 14 }
});