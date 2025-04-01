import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const SettingScreen = () => {
  const [username, setUsername] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsername(data.username || '');
        setHeight(data.height || '');
        setWeight(data.weight || '');
      }
    };
    loadUserData();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        username,
        height,
        weight,
      });
      Alert.alert('✅ Saved', 'Your profile has been updated.');
    } catch (err) {
      Alert.alert('❌ Error', 'Failed to save your data.');
      console.error(err);
    }
  };


  return (
    
    <View style={styles.container}>

<TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
  <Text style={styles.backButtonText}>← Back</Text>
</TouchableOpacity>

      <Text style={styles.title}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#aaa"
      />

      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        placeholderTextColor="#aaa"
      />

      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>💾 Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A120B',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    color: '#E87E27',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    color: 'black',
  },
  saveButton: {
    backgroundColor: '#E87E27',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10, 
  },
  backButtonText: {
    color: 'white',
    fontSize: 14,
  },
});
