import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 📸 貼文數據（用來顯示過去的活動記錄）
const userPosts = [
  { id: '1', image: require('../assets/post1.png') },
  { id: '2', image: require('../assets/post2.png') },
  { id: '3', image: require('../assets/post3.png') },
  { id: '4', image: require('../assets/post4.png') },
];

// 👥 好友列表
const friendsList = [
  { id: '1', avatar: require('../assets/user1.png') },
  { id: '2', avatar: require('../assets/user2.png') },
  { id: '3', avatar: require('../assets/user3.png') },
];

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      
      {/* 🏷️ 頭像 & 個人資訊（增加 marginTop） */}
      <View style={styles.profileHeader}>
        <Image source={require('../assets/user1.png')} style={styles.profileAvatar} />
        <View>
          <Text style={styles.username}>EmilyW</Text>
          <Text style={styles.bio}>Fitness Enthusiast | Healthy Living</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* 👥 好友列表 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.friendsContainer}>
        {friendsList.map((item) => (
          <Image key={item.id} source={item.avatar} style={styles.friendAvatar} />
        ))}
      </ScrollView>

      {/* 🏆 過去貼文（健身記錄） */}
      <Text style={styles.sectionTitle}>My Activities</Text>
      <FlatList
        data={userPosts}
        keyExtractor={(item) => item.id}
        numColumns={2} // 兩列顯示
        renderItem={({ item }) => (
          <Image source={item.image} style={styles.postImage} />
        )}
      />
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
    paddingBottom: 20,
    marginTop: 80, // **將帳號資訊下移**
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  bio: {
    fontSize: 14,
    color: '#aaa',
  },
  settingsButton: {
    position: 'absolute',
    right: 10,
    top: 20,
  },
  settingsText: {
    fontSize: 24,
    color: '#fff',
  },
  friendsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  postImage: {
    width: '48%',
    height: 150,
    marginBottom: 10,
    marginRight: '4%',
    borderRadius: 10,
  },
});

export default ProfileScreen;
