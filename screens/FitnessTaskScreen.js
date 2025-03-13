import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';

const ShareMomentsScreen = () => {
  // 模擬數據
  const data = {
    labels: ["Task Complete", "Calorie Burn"],
    data: [0.65, 0.48] // 65% 和 48%
  };

  return (
    <ImageBackground 
      source={require('../assets/FitTaskBG.png')} // 你的背景圖
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* 環形圖表與統計數據 */}
        <View style={styles.progressContainer}>
          <ProgressChart
            data={data}
            width={200}
            height={120}
            strokeWidth={8}
            radius={30}
            chartConfig={{
              backgroundColor: "transparent",
              backgroundGradientFrom: "transparent",
              backgroundGradientTo: "transparent",
              color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            hideLegend={true}
          />
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>Task Complete{"\n"}<Text style={styles.percentage}>65%</Text></Text>
            <Text style={styles.progressText}>Calorie Burn{"\n"}<Text style={styles.percentage}>48%</Text></Text>
          </View>
        </View>

        {/* 統計數據 */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>42 mins{"\n"}Time</Text>
          <Text style={styles.statsText}>2920{"\n"}Steps</Text>
          <Text style={styles.statsText}>2.7 km{"\n"}Distance</Text>
        </View>

        {/* 任務列表 */}
        <Text style={styles.taskListHeader}>Task List</Text>
        <View style={styles.taskContainer}>
          <Text style={styles.taskStatus}>Complete</Text>
          <View style={styles.taskItem}>
            <Text style={styles.taskTitle}>Abdominal training</Text>
          </View>
          <View style={styles.taskItem}>
            <Text style={styles.taskTitle}>Upper limb training</Text>
          </View>
          <View style={styles.taskItem}>
            <Text style={styles.taskTitle}>Total Body Fat Burning</Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingTop: 80, // **向下移動整個內容**
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50, // **往下移動**
  },
  progressTextContainer: {
    marginLeft: 10,
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'left',
  },
  percentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'orange',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20, // **往下移動**
  },
  statsText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  taskListHeader: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 10,
    marginTop: 20, // **往下移動**
  },
  taskContainer: {
    width: '90%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 10,
    marginTop: 20, // **往下移動**
  },
  taskStatus: {
    fontSize: 16,
    color: 'orange',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  taskTitle: {
    color: 'white',
    fontSize: 14,
  },
});

export default ShareMomentsScreen;
