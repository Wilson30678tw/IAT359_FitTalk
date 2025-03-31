import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const allTasks = [
  '10 min warm-up jog',
  'Ab workout (15 reps x 3)',
  'Push-ups (20 reps x 3)',
  'Stretch and cooldown (5 min)',
  '30s jumping jacks',
  'Wall sit (1 min)',
  'Yoga pose (3 min)',
  'Plank hold (45 sec)',
  'Glute bridge (20 reps)',
  'Arm circles (1 min)',
  'Squats (20 reps x 2)',
];

const TaskListScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const loadDailyTasks = async () => {
      const today = new Date().toDateString();
      const stored = await AsyncStorage.getItem('daily-tasks');

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          setTasks(parsed.tasks);
          return;
        }
      }

      const shuffled = allTasks.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 4).map((title) => ({
        id: title,
        title,
        completed: false,
        custom: false, // 系統任務
      }));

      await AsyncStorage.setItem(
        'daily-tasks',
        JSON.stringify({ date: today, tasks: selected })
      );
      setTasks(selected);
    };

    loadDailyTasks();
  }, []);

  const saveTasks = async (updatedTasks) => {
    const today = new Date().toDateString();
    setTasks(updatedTasks);
    await AsyncStorage.setItem(
      'daily-tasks',
      JSON.stringify({ date: today, tasks: updatedTasks })
    );
  };

  const toggleComplete = async (id) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    await saveTasks(updated);
  };

  const handleAddTask = async () => {
    const trimmed = newTask.trim();
    if (!trimmed) return;

    if (tasks.find((task) => task.id === trimmed)) {
      Alert.alert('Duplicate Task', 'This task already exists.');
      return;
    }

    const newTaskObj = {
      id: trimmed,
      title: trimmed,
      completed: false,
      custom: true,
    };

    const updatedTasks = [...tasks, newTaskObj];
    setNewTask('');
    await saveTasks(updatedTasks);
  };

  const handleDeleteTask = (id) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updatedTasks = tasks.filter((task) => task.id !== id);
          await saveTasks(updatedTasks);
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.taskBox, item.completed && styles.taskCompleted]}>
      <View style={styles.taskRow}>
        <Image
          source={
            item.completed
              ? require('../assets/checked.png')
              : require('../assets/uncheck.png')
          }
          style={styles.icon}
        />
        <Text style={styles.taskText}>{item.title}</Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={item.completed ? styles.undoButton : styles.completeButton}
          onPress={() => toggleComplete(item.id)}
        >
          <Text style={styles.buttonText}>
            {item.completed ? 'Undo' : 'Complete'}
          </Text>
        </TouchableOpacity>

        {item.custom && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteTask(item.id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Today's Tasks</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add your custom task"
          placeholderTextColor="#888"
          value={newTask}
          onChangeText={setNewTask}
        />
        <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks found.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A120B',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'orange',
    marginBottom: 20,
    textAlign: 'center',
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
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    color: 'black',
  },
  addButton: {
    backgroundColor: 'orange',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
    marginLeft: 8,
  },
  taskBox: {
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    marginBottom: 10,
  },
  taskCompleted: {
    backgroundColor: '#94683C',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  taskText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  completeButton: {
    backgroundColor: '#F68B1F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  undoButton: {
    backgroundColor: '#888',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#D9534F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default TaskListScreen;
