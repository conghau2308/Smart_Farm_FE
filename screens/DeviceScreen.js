import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AIO_KEY } from '@env';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { deleteDeviceByNameService, getAllDevicesByZoneNameService } from "../apis/DeviceService";
import { getValueOfListSensorservice } from "../apis/SensorService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SensorContext } from "../Contexts/SensorContext";
export default function DeviceScreen({ navigation }) {
  const [sensorData, setSensorData] = useState([]);
  const iconDevice = {
    "Temperature Sensor": "thermometer-outline",
    "Light Sensor": "sunny-outline",
    "Soil Moisture Sensor": "leaf-outline",
    "Pump": "water-outline",
    "LED Light": "bulb-outline",
    "Humidity Sensor": "cloud-outline"
  }

  const sensorUnits = {
    "Temperature Sensor": "°C",
    "Light Sensor": "lux",
    "Soil Moisture Sensor": "%",
    "Pump": "",
    "LED Light": "",
    "Humidity Sensor": "%"
  };  

  const route = useRoute();
  const { zoneId } = route.params;
  const [SensorValue, setSensorValue] = useState({});
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { updateSoilSensorId, updateLightSensorId } = useContext(SensorContext);

  const fetchAllDeviceByZoneName = async () => {
    try {
      const response = await getAllDevicesByZoneNameService(zoneId);

      if (response) {
        setSensorData(response);
      }
    }
    catch (error) {
      console.log("Error fetching devices:", error);
      Alert.alert("Error", "Failed to fetch devices. Please try again later.");
    }
  }

  useEffect(() => {
    fetchAllDeviceByZoneName();
  }, []);

  const navigate = useNavigation();

  const handleDeleteDevice = async (deviceName) => {
        Alert.alert(
          'Confirm Delete',
          'Are you sure you want to delete this device?',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Delete',
              onPress: async () => {
                try {
                  await deleteDeviceByNameService(deviceName);
                  fetchAllDeviceByZoneName();
                }
                catch (error) {
                  console.log("Error deleting device:", error);
                  Alert.alert("Error", "Failed to delete device. Please try again later.")
                }
              }
            }
          ]
        )
  }

useFocusEffect(
  React.useCallback(() => {
    const fetchSensorData = async () => {
      const device_ids = sensorData.map((sensor) => sensor.device_id);

      try {
        const response = await getValueOfListSensorservice( device_ids, null, null, null, null, null );

        if (response) {
          const updatedSensorValue = response.reduce((acc, sensor) => {
            acc[sensor.device_id] = sensor.value;
            return acc;
          }, {});

          setSensorValue(updatedSensorValue);
          setLastUpdated(new Date());
        }
      }
      catch (error) {
        console.log("Error fetching sensor data:", error);
      }
    }

    fetchSensorData();

    const interval = setInterval(() => {
      fetchSensorData();
    }, 5000);

    return () => clearInterval(interval);

  }, [sensorData])
);

  useEffect(() => {
    const soilSensor = sensorData.find(sensor => sensor.name === "Soil Moisture Sensor");
    const lightSensor = sensorData.find(sensor => sensor.name === "Light Sensor");

    if (soilSensor) {
      updateSoilSensorId(soilSensor.device_id)
    }
    if (lightSensor) {
      updateLightSensorId(soilSensor.device_id)
    }
  }, [sensorData, updateSoilSensorId, updateSoilSensorId]);
 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="arrow-back" style={{ marginRight: 8}} size={24} color="#2e7d32"
            onPress={() => navigate.goBack()}
          />
          <Text style={styles.title}>List Device</Text>
        </View>
        <Text style={styles.subtitle}>
          Last Updated: {lastUpdated.toLocaleTimeString()}
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.gridContainer}>
          {sensorData.map((sensor, index) => (
            <TouchableOpacity key={index} style={styles.card}
              onPress={() => navigation.navigate("Sensor Detail", { deviceId: sensor.device_id, deviceName: sensor.name })}
            >
              <Ionicons name={iconDevice[sensor.name]} size={32} color="#4CAF50" />
              <Text style={styles.sensorName}>{sensor.name}</Text>
              <Text style={styles.sensorValue}> {
                  sensor.name === "LED Light" || sensor.name === "Pump"
                  ? SensorValue[sensor.device_id] === 100 ? "ON" : "OFF"
                  : SensorValue[sensor.device_id]?.toString() || "Loading..."
                }
                {
                  sensorUnits[sensor.name]
                }
                </Text>
              {/* <Text
                style={[
                  styles.sensorStatus,
                  {
                    color:
                      sensor.status === "Normal"
                        ? "#4CAF50"
                        : sensor.status === "High"
                        ? "#FF9800"
                        : "#F44336",
                  },
                ]}
              >
                {sensor.status}
              </Text> */}

              <Text style={{
                height: 2,
                width: "100%",
                backgroundColor: '#4caf50',
                marginVertical: 10
              }} />

              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%'
              }}>
              <TouchableOpacity style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}
                onPress={() => navigation.navigate("Edit Device", { deviceName: sensor.name })}
              >
                <Ionicons name="create-outline" size={15} color="#262626" />
                <Text> Edit </Text>
              </TouchableOpacity>

              <TouchableOpacity style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}
                onPress={() => handleDeleteDevice(sensor.name)}
              >
                <Ionicons name="trash-outline" size={15} color="#262626" />
                <Text> Delete </Text>
              </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.chartButton]}
            onPress={() => navigation.navigate("Add Device")}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.buttonText}>Add Device</Text>
          </TouchableOpacity>
        </View>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
    padding: 10,
    marginBottom: 0,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 5,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    width: "48%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  sensorName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  sensorValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
    color: "#2E7D32",
  },
  sensorStatus: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: "500",
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartButton: {
    backgroundColor: "#4CAF50",
  },
  pumpButton: {
    backgroundColor: "#2E7D32",
  },
  ledButton: {
    backgroundColor: "#2E7D32",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});
