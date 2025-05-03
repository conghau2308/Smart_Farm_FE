import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AIO_KEY } from '@env';
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { WebView } from 'react-native-webview';
import { getValueOfListSensorservice } from "../apis/SensorService";
import { TextInput } from "react-native-paper";
import { ledControlService } from "../apis/DeviceControlService";

export default function DetailSensorScreen({ navigation }) {
    const route = useRoute();
    const { deviceId, sensorId } = route.params;
    const [dashboardUrl, setDashboardUrl] = useState(`http://10.0.2.2:3000/d-solo/bekqce3yrnlkwe/smart-farm-dashboard?orgId=1&from=now-1m&to=now&var-device_id=${deviceId}&refresh=5s&panelId=1&fullscreen&theme=light`);
    const isDevice = sensorId === "led" || sensorId === "pump" ? true : false;
    const [sensorValue, setSensorValue] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const [fromDate, setFromDate] = useState("");

    const handleHistory = () => {
      if (!fromDate) {
        Alert.alert("Warning", "Please enter a time duration (e.g., 1s, 2m, 3h, ...)");
        return;
      }
      const url = `http://10.0.2.2:3000/d-solo/bekqce3yrnlkwe/smart-farm-dashboard?orgId=1&from=now-${fromDate}&to=now&var-device_id=${deviceId}&refresh=5s&panelId=1&fullscreen&theme=light`;
      setDashboardUrl(url);
    }

    useFocusEffect(
      React.useCallback(() => {
        const fetchSensorValue = async () => {
          const device_ids = [deviceId];
          try {
            const response = await getValueOfListSensorservice(device_ids);
  
            if (response.length > 0) {
              setSensorValue(response);
              setLastUpdated(new Date());
            }
            else {
              Alert.alert("No data found", "Please check your device or try again later.");
            }
          }
          catch (error) {
            console.error("Error fetching sensor value:", error);
          }
        };
  
        fetchSensorValue();

        const interval = setInterval(() => {
          fetchSensorValue();
        }, 5000);

        return () => clearInterval(interval);
      }, [])
    )

    const handleLight = async () => {
      try {
        const response = await ledControlService(true);

        if (response) {
          console.log("resopnse", response);
        }
      }
      catch (error) {
        console.log("Error turning on Light:", error);
      }
    }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { flexDirection: 'column'}]}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.title}>{sensorId} Insights</Text>
        </View>
        <Text style={styles.subtitle}>
          Last Updated: {lastUpdated.toLocaleTimeString()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Dashboard</Text>
        <View style={styles.lightStatus}>
          <Ionicons
            name={true ? "bulb" : "bulb-outline"}
            size={48}
            color={true ? "#FFD700" : "#666"}
          />
          <Text
            style={[styles.statusText, { color: true ? "#2E7D32" : "#666" }]}
          >
            {isDevice ? (
                <Text>
                    {sensorId} is {true ? "ON" : "OFF"}
                </Text>
            ) : (
                <Text>
                    {sensorId} value is: {sensorValue.map((sensor) => sensor.value) || "N/A"}
                </Text>
            )}
          </Text>

          {deviceId === 5 && (
            <TouchableOpacity style={{
                width: '50%',
                backgroundColor: '#2E7D32',
                borderRadius: 10,
                padding: 10,
                marginTop: 10,
            }}
                onPress={() => navigation.navigate(sensorId === "led"
                    ? "LedControl"
                    : "PumpControl",
                    { sensorId })}
            >
                <Text style={{
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}> {sensorId} Control </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      justifyContent: 'space-evenly',
      height: 90
    }}>
      <TextInput
        style={styles.input}
        value={fromDate}
        onChangeText={setFromDate}
        placeholder="Enter time (e.g., 1s, 2m, 3h, 4d, 5w ...)"
      />

      <TouchableOpacity onPress={handleHistory} style={{
        width: '20%',
        backgroundColor: '#2e7d32',
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
      }}>
        <Ionicons name="time-outline" size={20} color='#fff' />
        <Text style={{ fontSize: 18, color: '#fff', textAlign: 'center' }}> View </Text>
      </TouchableOpacity>
    </View>
    <View style={{flex: 1}}>
    <WebView
          source={{ uri: dashboardUrl }}
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  section: {
    backgroundColor: "white",
    margin: 10,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  lightStatus: {
    alignItems: "center",
    marginBottom: 20,
  },
  statusText: { 
    fontSize: 16,fontWeight: "bold",
    marginTop: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    width: "70%",
    height: 40,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    // marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});