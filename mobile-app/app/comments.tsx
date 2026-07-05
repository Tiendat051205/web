import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getStoredAuth } from '@/services/storage';
import { buildApiUrl } from '@/config/api';

export default function CommentsScreen({ route }: any) {
  const templateId = route?.params?.templateId || 'henry_simple';
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const res = await fetch(buildApiUrl(`/template/${templateId}/comments`));
        const data = await res.json();
        if (data.success) setComments(data.comments || []);
      } catch {
        Alert.alert('Lỗi', 'Không thể tải bình luận.');
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [templateId]);

  const addComment = async () => {
    const { token } = await getStoredAuth();
    if (!token) {
      Alert.alert('Cần đăng nhập', 'Vui lòng đăng nhập để bình luận.');
      return;
    }

    try {
      const res = await fetch(buildApiUrl(`/template/${templateId}/comments`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((current) => [data.comment, ...current]);
        setText('');
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể gửi bình luận.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>💬 Bình luận mẫu CV</Text>
      <TextInput style={styles.input} placeholder="Viết bình luận của bạn..." value={text} onChangeText={setText} multiline />
      <TouchableOpacity style={styles.btn} onPress={addComment}>
        <Text style={styles.btnText}>Gửi bình luận</Text>
      </TouchableOpacity>

      {loading ? <Text style={styles.emptyText}>Đang tải...</Text> : null}
      {comments.map((comment) => (
        <View key={comment.id} style={styles.card}>
          <Text style={styles.author}>{comment.authorName || 'Người dùng'}</Text>
          <Text style={styles.content}>{comment.content || comment.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  contentContainer: { padding: 20, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: '#1a3a4a', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, minHeight: 90, marginBottom: 10, textAlignVertical: 'top' },
  btn: { backgroundColor: '#2C7DA0', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  btnText: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  author: { fontWeight: '700', color: '#1a3a4a', marginBottom: 4 },
  content: { color: '#555' },
  emptyText: { color: '#666', marginTop: 8 },
});
