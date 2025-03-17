import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig'; // 確保 Firebase 正確導入
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Firestore 讀取數據
import { useNavigation } from '@react-navigation/native';

const userPosts = [
  { id: '1', image: require('../assets/post1.png') },
  { id: '2', image: require('../assets/post2.png') },
  { id: '3', image: require('../assets/post3.png') },
  { id: '4', image: require('../assets/post4.png') },
];

const likedPosts = [
  { id: '1', image: require('../assets/post1.png') },
  { id: '2', image: require('../assets/post2.png') },
];

const messages = [
  { id: '1', name: 'Johnny', time: 'Just now', message: 'Sure! See you later!', avatar: require('../assets/user1.png') },
  { id: '2', name: 'Will', time: '1h ago', message: "That's cool!", avatar: require('../assets/user2.png') },
  { id: '3', name: 'Jessica', time: '2h ago', message: 'Just let me know then!', avatar: require('../assets/user3.png') },
  { id: '4', name: 'Will', time: 'Yesterday', message: 'Excited!!', avatar: require('../assets/user1.png') },
];

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('posts'); // 預設顯示自己的貼文
  const [username, setUsername] = useState('Loading...'); // 🔹 預設為 Loading...
  const [profileImage, setProfileImage] = useState(require('../assets/user1.png')); // 🔹 預設頭像

  // 🔥 從 Firestore 讀取用戶數據
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setUsername(userDocSnap.data().username || "Unknown User"); // 更新用戶名
          setProfileImage({ uri: userDocSnap.data().profileImage || "https://example.com/default-avatar.png" });
        }
      }
    };

    fetchUserData();
  }, []);
  const handleSignOut = () => {
    console.log("🔴 Sign Out 按鈕被點擊");
    if (!auth.currentUser) {
      console.log("❌ 沒有已登入的用戶");
      Alert.alert("登出失敗", "目前沒有已登入的帳戶");
      return;
    }

    signOut(auth)
      .then(() => {
        console.log("✅ 已成功登出");
        Alert.alert("已登出", "您已成功登出", [
          { text: "OK", onPress: () => navigation.replace("SignIn") } // ✅ 修正導航
        ]);
      })
      .catch((error) => {
        console.log("❌ 登出失敗:", error.message);
        Alert.alert("登出失敗", error.message);
      });
  };

  return (
    <View style={styles.container}>
      
      {/* 🏷️ 頭像 & 個人資訊 */}
      <View style={styles.profileHeader}>
        <Image source={require('../assets/user1.png')} style={styles.profileAvatar} />
        <View>
        <View style={{ marginTop: 15 }}> 
          <Text style={styles.username}>{username}</Text>
        </View>
        <View style={{ marginTop: 15 }}> <Text style={styles.bio}>Powered by Strength! {"\n"}Strong mind, strong body. Pushing limits every day!</Text>
        </View>
        </View>
      </View>

            {/* 📊 用戶統計數據 */}
            <View style={styles.userStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>42</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>68</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>139</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {/* 🔘 四個切換按鈕 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setSelectedTab('posts')}>
          <Text style={[styles.tabButton, selectedTab === 'posts' && styles.activeTab]}>🏞️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('likes')}>
          <Text style={[styles.tabButton, selectedTab === 'likes' && styles.activeTab]}>❤️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('chats')}>
          <Text style={[styles.tabButton, selectedTab === 'chats' && styles.activeTab]}>💬</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('settings')}>
          <Text style={[styles.tabButton, selectedTab === 'settings' && styles.activeTab]}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* 📌 切換顯示不同的內容 */}
      <View style={styles.contentContainer}>
        {selectedTab === 'posts' && (
          <FlatList
            data={userPosts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => <Image source={item.image} style={styles.postImage} />}
          />
        )}

        {selectedTab === 'likes' && (
          <FlatList
            data={likedPosts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => <Image source={item.image} style={styles.postImage} />}
          />
        )}

        {selectedTab === 'chats' && (
          <View>
            {messages.map((msg) => (
              <View key={msg.id} style={styles.messageItem}>
                <Image source={msg.avatar} style={styles.messageAvatar} />
                <View>
                  <Text style={styles.messageName}>{msg.name} - <Text style={styles.messageTime}>{msg.time}</Text></Text>
                  <Text style={styles.messageText}>{msg.message}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

{selectedTab === 'settings' && ( 
  <View style={styles.settingsContainer}>
    
    {/* 設定選單項目 */}
    <TouchableOpacity style={styles.settingItem}>
      <Text style={styles.settingText}>⚙️ Setting</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.settingItem}>
      <Text style={styles.settingText}>ℹ️ Help & Feedback</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.settingItem}>
      <Text style={styles.settingText}>📜 Privacy & Legal</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.settingItem}>
      <Text style={styles.settingText}>🏛 About FitTalk</Text>
    </TouchableOpacity>

    {/* 🔴 登出按鈕 (Firebase Sign Out) */}
    <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
      <Text style={styles.signOutText}>Sign Out</Text>
    </TouchableOpacity>

  </View>
)}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A120B',
    padding: 15,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 30,
    marginTop: 60,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    marginTop: 60,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 80,
  },
  bio: {
    
    fontSize: 14,
    color: '#aaa',
    marginTop:20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingBottom: 10,
  },
  tabButton: {
    fontSize: 24,
    color: '#777',
  },
  activeTab: {
    color: '#E87E27',
    borderBottomWidth: 3,
    borderBottomColor: '#E87E27',
    paddingBottom: 5,
  },
  contentContainer: {
    flex: 1,
    marginTop: 10,
  },
  postImage: {
    width: '48%',
    height: 150,
    marginBottom: 10,
    marginRight: '4%',
    borderRadius: 10,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333',
    marginVertical: 5,
    borderRadius: 8,
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  messageTime: {
    fontSize: 12,
    color: '#aaa',
  },
  messageText: {
    fontSize: 14,
    color: '#ddd',
  },
  settingsText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  settingsContainer: {
    marginTop: 30,  // 🔴 這裡控制 settings 頁面的間距
  },
  settingItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  settingText: {
    fontSize: 16,
    color: '#fff',
  },
  signOutButton: {
    marginTop: 30,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E87E27',
    padding: 15,
    alignItems: 'center',
    borderRadius: 30,
  },
  signOutText: {
    color: '#E87E27',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;