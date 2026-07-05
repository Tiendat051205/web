import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageKeys = {
  token: 'jobgenius_token',
  user: 'jobgenius_user',
};

export async function saveAuth(token: string, user: any) {
  await AsyncStorage.setItem(storageKeys.token, token);
  await AsyncStorage.setItem(storageKeys.user, JSON.stringify(user));
}

export async function clearAuth() {
  await AsyncStorage.removeItem(storageKeys.token);
  await AsyncStorage.removeItem(storageKeys.user);
}

export async function getStoredAuth() {
  const [token, userStr] = await Promise.all([
    AsyncStorage.getItem(storageKeys.token),
    AsyncStorage.getItem(storageKeys.user),
  ]);

  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch {
    user = null;
  }

  return { token, user };
}
