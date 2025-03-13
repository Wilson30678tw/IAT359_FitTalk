import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const messages = [
  { id: '1', user: 'Jessica', avatar: require('../assets/user1.jpg'), lastMessage: 'Hey, how was your workout?' },
  { id: '2', user: 'Will', avatar: require('../assets/user2.jpg'), lastMessage: 'That meal looks amazing!' },
  { id: '3', user: 'Johnny', avatar: require('../assets/user3.jpg'), lastMessage: 'Let’s go for a run tomorrow!' },
];

const MessageScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.messageItem} 
            onPress={() => navigation.navigate('ChatScreen', { user: item.user })}
          >
            <Image source={item.avatar} style={styles.avatar} />
            <View>
              <Text style={styles.username}>{item.user}</Text>
              <Text style={styles.lastMessage}>{item.lastMessage}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A120B',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2A32',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    color: '#aaa',
    fontSize: 14,
  },
});

export default MessageScreen;
