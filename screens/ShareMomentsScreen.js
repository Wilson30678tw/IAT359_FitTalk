import React from 'react';
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

// 📸 貼文數據（確保 PNG 圖片引用正確）
const momentsData = [
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

const MomentsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      
      {/* 🔍 搜索欄 & 訊息按鈕（透明按鈕） */}
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

      {/* 📸 貼文動態列表 */}
      <FlatList
        data={momentsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Image source={item.avatar} style={styles.avatar} />
              <Text style={styles.username}>{item.user}</Text>
            </View>
            <Image source={item.image} style={styles.postImage} />
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
    width: 40, // 設定按鈕範圍
    height: 40,
    marginLeft: 10,
    backgroundColor: 'transparent', // 透明背景
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

export default MomentsScreen;
