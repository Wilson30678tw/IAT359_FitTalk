import React, { useEffect, useState } from 'react';
import { View,Text,StyleSheet,FlatList,Image,TouchableOpacity,ScrollView,TextInput,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { getAuth } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

// Local posts
const localMomentsData = [
  { id: '1', user: 'EmilyW', image: require('../assets/post1.png'), avatar: require('../assets/user1.png') },
  { id: '2', user: 'Jessica', image: require('../assets/post2.png'), avatar: require('../assets/user2.png') },
  { id: '3', user: 'Will', image: require('../assets/post3.png'), avatar: require('../assets/user3.png') },
  { id: '4', user: 'Johnny', image: require('../assets/post4.png'), avatar: require('../assets/user4.png') },
];

const storyUsers = [
  { id: '1', avatar: require('../assets/user1.png') },
  { id: '2', avatar: require('../assets/user2.png') },
  { id: '3', avatar: require('../assets/user3.png') },
  { id: '4', avatar: require('../assets/user4.png') },
];

const ShareMomentsScreen = () => {
  const navigation = useNavigation();
  const [firebaseMoments, setFirebaseMoments] = useState([]);

  // 🔥 Real-time listener for Firestore posts
  useEffect(() => {
    const q = query(collection(db, "moments"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const moments = snapshot.docs.map((doc) => ({
        id: doc.id,
        user: doc.data().userName || "Unknown",
        image: doc.data().imageUrl,
        avatar: require('../assets/default-avatar.png'),
      }));
      setFirebaseMoments(moments);
    });

    return () => unsubscribe();
  }, []);

  const combinedMoments = [...firebaseMoments, ...localMomentsData];

  // 🔽 Unified picker for camera or gallery
  const handleImagePick = async () => {
    Alert.alert(
      'Post a Moment',
      'Choose a source',
      [
        { text: 'Camera', onPress: () => pickImage('camera') },
        { text: 'Gallery', onPress: () => pickImage('gallery') },
        { text: 'Cancel', style: 'cancel' }
      ],
      { cancelable: true }
    );
  };

  const pickImage = async (source) => {
    try {
      // Ask for permissions
      if (source === 'camera') {
        const { granted } = await ImagePicker.requestCameraPermissionsAsync();
        if (!granted) {
          alert('Camera access is required!');
          return;
        }
      } else {
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!granted) {
          alert('Gallery access is required!');
          return;
        }
      }

      const result = await (source === 'camera'
        ? ImagePicker.launchCameraAsync()
        : ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
          }));

      if (!result.canceled) {
        const image = result.assets[0];
        const response = await fetch(image.uri);
        const blob = await response.blob();

        const filename = `${Date.now()}_moment.jpg`;
        const storage = getStorage();
        const storageRef = ref(storage, `moments/${filename}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          alert("You need to be logged in to post!");
          return;
        }

        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const userName = userData.username || "Anonymous";

            await addDoc(collection(db, "moments"), {
              userName: userName,
              imageUrl: downloadURL,
              timestamp: serverTimestamp()
            });

            alert("Posted successfully!");
          } else {
            alert("User data not found!");
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          alert("Could not fetch user data.");
        }



        alert("Posted successfully!");
      }
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔍 Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>FitTalk</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          style={styles.messageButton}
          onPress={() => navigation.navigate('MessageScreen')}
        />
      </View>

      {/* 📸 Upload Button */}
      <TouchableOpacity
        onPress={handleImagePick}
        style={styles.postButton}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
          Post a Moment
        </Text>
      </TouchableOpacity>

      {/* 👥 Stories
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storyContainer}>
        <TouchableOpacity style={styles.storyAdd}>
          <Text style={styles.storyPlus}>+</Text>
        </TouchableOpacity>
        {storyUsers.map((item) => (
          <Image key={item.id} source={item.avatar} style={styles.storyAvatar} />
        ))}
      </ScrollView> */}

      {/* 📸 Posts List */}
      <FlatList
        data={combinedMoments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Image source={item.avatar} style={styles.avatar} />
              <Text style={styles.username}>{item.user}</Text>
            </View>
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
  postButton: {
    backgroundColor: '#E07C24',
    marginHorizontal: 15,
    marginBlock: 15,
    padding: 12,
    borderRadius: 10,
  },
});

export default ShareMomentsScreen;
