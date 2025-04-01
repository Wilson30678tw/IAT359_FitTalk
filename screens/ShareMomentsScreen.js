import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';

const ShareMomentsScreen = () => {
  const navigation = useNavigation();
  const [firebaseMoments, setFirebaseMoments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // 🔽 Dropdown state
  const [open, setOpen] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [dropdownItems, setDropdownItems] = useState([
    { label: 'Newest → Oldest', value: 'newest' },
    { label: 'Oldest → Newest', value: 'oldest' },
    { label: 'Username A → Z', value: 'usernameAZ' },
    { label: 'Username Z → A', value: 'usernameZA' },
  ]);

  useEffect(() => {
    const q = query(collection(db, "moments"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const momentPromises = snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        let avatar = require('../assets/default-avatar.png');

        if (data.userId) {
          const userDoc = await getDoc(doc(db, 'users', data.userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.profileImage) {
              avatar = { uri: userData.profileImage };
            }
          }
        }

        return {
          id: docSnap.id,
          user: data.userName || "Unknown",
          image: data.imageUrl,
          avatar,
          timestamp: data.timestamp || { seconds: 0 },
        };
      });

      const resolvedMoments = await Promise.all(momentPromises);
      setFirebaseMoments(resolvedMoments);
    });

    return () => unsubscribe();
  }, []);

  const sortedMoments = [...firebaseMoments].sort((a, b) => {
    switch (sortOption) {
      case 'oldest':
        return a.timestamp.seconds - b.timestamp.seconds;
      case 'usernameAZ':
        return a.user.localeCompare(b.user);
      case 'usernameZA':
        return b.user.localeCompare(a.user);
      case 'newest':
      default:
        return b.timestamp.seconds - a.timestamp.seconds;
    }
  });

  const filteredMoments = sortedMoments.filter(moment =>
    moment.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* 🖼️ Logo Image */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/FitTalk_Logo.png')} style={styles.logo} />
      </View>

      {/* 🔍 Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by username..."
          placeholderTextColor="#aaa"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
      </View>

      {/* 🔽 Custom Sort Dropdown */}
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={open}
          value={sortOption}
          items={dropdownItems}
          setOpen={setOpen}
          setValue={setSortOption}
          setItems={setDropdownItems}
          placeholder="Sort by"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownBox}
          textStyle={{ color: '#fff' }}
          placeholderStyle={{ color: '#aaa' }}
          theme="DARK"
        />
      </View>

      {/* 📸 Posts List */}
      <FlatList
        data={filteredMoments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Image source={item.avatar} style={styles.avatar} />
              <Text style={styles.username}>{item.user}</Text>
            </View>
            <Image source={{ uri: item.image }} style={styles.postImage} />
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
  logoContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 100,
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
  searchBarContainer: {
    paddingHorizontal: 15,
    marginTop: 100,
    paddingTop: 15,
    paddingBottom: 10,
    zIndex: 99,
  },
  searchBar: {
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    height: 40,
    color: '#fff',
  },
  dropdownContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
    zIndex: 2000, // ensures dropdown appears above everything
  },
  dropdown: {
    backgroundColor: '#333',
    borderColor: '#555',
    borderRadius: 8,
  },
  dropdownBox: {
    backgroundColor: '#333',
    borderColor: '#555',
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
    width: 25,
    height: 25,
    tintColor: '#fff',
    resizeMode: 'contain', 
  marginHorizontal: 5,   
  },
});

export default ShareMomentsScreen;
