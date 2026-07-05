import Constants from 'expo-constants';
import { Platform } from 'react-native';

const defaultApiUrl = Platform.select({
  web: 'http://localhost:3000/api',
  ios: 'http://localhost:3000/api',
  default: Constants.isDevice ? 'http://192.168.0.104:3000/api' : 'http://10.0.2.2:3000/api',
});

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || defaultApiUrl || 'http://192.168.0.104:3000/api';

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
