import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from "../firebaseConfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

// 📸 貼文數據（本地靜態數據）
const localMomentsData = [
  { id: '1', user: 'EmilyW', image: require('../assets/post1.png'), avatar: require('../assets/user1.png') },
  { id: '2', user: 'Jessica', image: require('../assets/post2.png'), avatar: require('../assets/user2.png') },
  { id: '3', user: 'Will', image: require('../assets/post3.png'), avatar: require('../assets/user3.png') },
  { id: '4', user: 'Johnny', image: require('../assets/post4.png'), avatar: require('../assets/user4.png') },
];

// 👥 好友故事（Story）
const storyUsers = [
  { id: '1', avatar: require('../assets/user1.png') },
  { id: '2', avatar: require('../assets/user2.png') },
  { id: '3', avatar: require('../assets/user3.png') },
  { id: '4', avatar: require('../assets/user4.png') },
];

const ShareMomentsScreen = () => {
  const navigation = useNavigation();
  const [firebaseMoments, setFirebaseMoments] = useState([]);

  // 🔥 監聽 Firebase 貼文變化
  useEffect(() => {
    const q = query(collection(db, "moments"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const moments = snapshot.docs.map((doc) => ({
        id: doc.id,
        user: doc.data().userName || "Unknown",
        image: doc.data().imageUrl,
        avatar: require('../assets/default-avatar.png'), // 🔹 Firebase 上傳的圖片沒有對應的使用者頭像，預設一個
      }));
      setFirebaseMoments(moments);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 合併本地數據與 Firebase 數據
  const combinedMoments = [...firebaseMoments, ...localMomentsData];

  return (
    <View style={styles.container}>
      
      {/* 🔍 搜索欄 & 訊息按鈕 */}
      <View style={styles.header}>
        <Text style={styles.logo}>FitTalk</Text>
        <TextInput 
          style={styles.searchBar} 
          placeholder="Search..." 
          placeholderTextColor="#aaa"
        />
        {/* 透明訊息按鈕 */}
        <TouchableOpacity 
          style={styles.messageButton} 
          onPress={() => navigation.navigate('MessageScreen')}
        />
      </View>

      {/* 🔄 好友故事 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storyContainer}>
        <TouchableOpacity style={styles.storyAdd}>
          <Text style={styles.storyPlus}>+</Text>
        </TouchableOpacity>
        {storyUsers.map((item) => (
          <Image key={item.id} source={item.avatar} style={styles.storyAvatar} />
        ))}
      </ScrollView>

      {/* 📸 貼文動態列表（顯示本地 + Firebase 上傳的貼文） */}
      <FlatList
        data={combinedMoments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Image source={item.avatar} style={styles.avatar} />
              <Text style={styles.username}>{item.user}</Text>
            </View>
            {/* 🔹 如果是 Firebase 上傳的圖片，使用 URL 加載 */}
            {typeof item.image === "string" ? (
              <Image source={{ uri: item.image }} style={styles.postImage} />
            ) : (
              <Image source={item.image} style={styles.postImage} />
            )}
            <View style={styles.postActions}>
              <TouchableOpacity>
                <Image source={require('../assets/heart.png')} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image source={require('../assets/comment.png')} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A120B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 10,
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  searchBar: {
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 35,
    color: '#fff',
    flex: 3,
  },
  messageButton: {
    width: 40,
    height: 40,
    marginLeft: 10,
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 15,
    top: 40,
  },
  storyContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  storyAdd: {
    width: 50,
    height: 50,
    backgroundColor: 'orange',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  storyPlus: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  storyAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  postContainer: {
    backgroundColor: '#2D2A32',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 15,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  postActions: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
});

export default ShareMomentsScreen;
