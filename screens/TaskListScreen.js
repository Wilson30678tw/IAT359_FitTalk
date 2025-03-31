import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 任務池
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
  const navigation = useNavigation();

  // 每日任務初始化
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

      // 隨機選 4 個任務
      const shuffled = allTasks.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 4).map((title, index) => ({
        id: `task-${Date.now()}-${index}`, // 加前綴和時間戳，保證唯一
        title,
        completed: false,
      }));

      await AsyncStorage.setItem(
        'daily-tasks',
        JSON.stringify({ date: today, tasks: selected })
      );
      setTasks(selected);
    };

    loadDailyTasks();
  }, []);

  // 切換完成狀態
  const toggleComplete = async (id) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);

    const today = new Date().toDateString();
    await AsyncStorage.setItem(
      'daily-tasks',
      JSON.stringify({ date: today, tasks: updated })
    );
  };
  const clearTodayTasks = async () => {
    await AsyncStorage.removeItem('daily-tasks');
    setTasks([]); // 清空當前畫面顯示
    Alert.alert('已清除今日任務', '返回畫面時會重新生成任務');
  };

  // 單項渲染
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
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 返回按鈕 */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
  style={{
    alignSelf: 'center',
    backgroundColor: '#D9534F',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    }}
  onPress={clearTodayTasks}
    >
  <Text style={{ color: 'white', fontWeight: 'bold' }}>🧹 清除今日任務</Text>
    </TouchableOpacity>*/}


      <Text style={styles.header}>Today's Tasks</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
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
  completeLabel: {
    backgroundColor: '#4CAF50',
    color: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    marginRight: 10,
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TaskListScreen;
