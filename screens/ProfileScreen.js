import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
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
  const [selectedTab, setSelectedTab] = useState('posts');
  const [username, setUsername] = useState('Loading...');
  const [profileImage, setProfileImage] = useState(require('../assets/default-avatar.png'));

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUsername(data.username || "Unknown User");

          if (data.profileImage) {
            setProfileImage({ uri: data.profileImage });
          } else {
            setProfileImage(require('../assets/default-avatar.png'));
          }
        }
      }
    };

    fetchUserData();
  }, []);

  const pickAndUploadAvatarToImgur = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "Please allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      const base64Image = result.assets[0].base64;

      try {
        const response = await fetch('https://api.imgur.com/3/image', {
          method: 'POST',
          headers: {
            Authorization: 'Client-ID bdb703842250661', // ⬅️ 你的 Imgur Client ID
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64Image,
            type: 'base64',
          }),
        });

        const data = await response.json();
        if (!data.success) {
          console.error('Imgur upload failed:', data);
          Alert.alert('❌ Failed to upload image to Imgur');
          return;
        }

        const imageUrl = data.data.link;
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { profileImage: imageUrl });

        setProfileImage({ uri: imageUrl });
        Alert.alert("✅ Avatar uploaded successfully!");
      } catch (error) {
        console.error("Upload error:", error);
        Alert.alert("Error", "Failed to upload to Imgur.");
      }
    }
  };

  const handleSignOut = () => {
    if (!auth.currentUser) {
      Alert.alert("登出失敗", "目前沒有已登入的帳戶");
      return;
    }

    signOut(auth)
      .then(() => {
        Alert.alert("已登出", "您已成功登出", [
          { text: "OK", onPress: () => navigation.replace("SignIn") },
        ]);
      })
      .catch((error) => {
        Alert.alert("登出失敗", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={{ alignItems: 'center' }}>
          <Image source={profileImage} style={styles.profileAvatar} />
          <TouchableOpacity style={styles.changeButton} onPress={pickAndUploadAvatarToImgur}>
            <Text style={styles.changeButtonText}>Change Portrait</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginLeft: 15 }}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.bio}>
            Powered by Strength!{"\n"}Strong mind, strong body. Pushing limits every day!
          </Text>
        </View>
      </View>

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

      <View style={styles.tabContainer}>
        {["posts", "likes", "chats", "settings"].map(tab => (
          <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)}>
            <Text style={[styles.tabButton, selectedTab === tab && styles.activeTab]}>
              {tab === 'posts' && '🏞️'}
              {tab === 'likes' && '❤️'}
              {tab === 'chats' && '💬'}
              {tab === 'settings' && '⚙️'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
                  <Text style={styles.messageName}>
                    {msg.name} - <Text style={styles.messageTime}>{msg.time}</Text>
                  </Text>
                  <Text style={styles.messageText}>{msg.message}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        {selectedTab === 'settings' && (
          <View style={styles.settingsContainer}>
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
  container: { flex: 1, backgroundColor: '#1A120B', padding: 15 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', paddingBottom: 30, marginTop: 60 },
  profileAvatar: { width: 80, height: 80, borderRadius: 40 },
  changeButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E87E27',
    borderRadius: 20,
  },
  changeButtonText: {
    color: '#E87E27',
    fontSize: 12,
    fontWeight: 'bold',
  },
  username: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  bio: { fontSize: 14, color: '#aaa', marginTop: 10 },
  userStats: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 12, color: '#aaa' },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: '#444', paddingBottom: 10 },
  tabButton: { fontSize: 24, color: '#777' },
  activeTab: { color: '#E87E27', borderBottomWidth: 3, borderBottomColor: '#E87E27', paddingBottom: 5 },
  contentContainer: { flex: 1, marginTop: 10 },
  postImage: { width: '48%', height: 150, marginBottom: 10, marginRight: '4%', borderRadius: 10 },
  messageItem: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#333', marginVertical: 5, borderRadius: 8 },
  messageAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  messageName: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  messageTime: { fontSize: 12, color: '#aaa' },
  messageText: { fontSize: 14, color: '#ddd' },
  settingsContainer: { marginTop: 30 },
  settingItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#444' },
  settingText: { fontSize: 16, color: '#fff' },
  signOutButton: { marginTop: 30, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#E87E27', padding: 15, alignItems: 'center', borderRadius: 30 },
  signOutText: { color: '#E87E27', fontSize: 16, fontWeight: 'bold' },
});

export default ProfileScreen;
