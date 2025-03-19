import { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SensorScreen({ navigation }) {
  const [sensorData, setSensorData] = useState([
    {
      id: "temp",
      name: "Temperature",
      value: "Loading...",
      icon: "thermometer-outline",
      status: "Normal",
    },
    {
      id: "light",
      name: "Light",
      value: "Loading...",
      icon: "sunny-outline",
      status: "Normal",
    },
    {
      id: "soil",
      name: "Soil Moisture",
      value: "Loading...",
      icon: "leaf-outline",
      status: "Normal",
    },
    {
      id: "pump",
      name: "Pump Status",
      value: "Loading...",
      icon: "water-outline",
      status: "Normal",
    },
    {
      id: "led",
      name: "LED Status",
      value: "Loading...",
      icon: "bulb-outline",
      status: "Normal",
    },
    {
      id: "humi",
      name: "Humidity Status",
      value: "Loading...",
      icon: "cloud-outline",
      status: "Normal",
    },
  ]);
  

  const fetchSensorData = async () => {
    try {
      const endpoints = {
        temp: "https://io.adafruit.com/api/v2/longthangtran/feeds/iot-temp/data",
        light:
          "https://io.adafruit.com/api/v2/longthangtran/feeds/iot-light/data",
        soil: "https://io.adafruit.com/api/v2/longthangtran/feeds/iot-soil-moisture/data",
        pump: "https://io.adafruit.com/api/v2/longthangtran/feeds/iot-pump/data",
        led: "https://io.adafruit.com/api/v2/longthangtran/feeds/iot-led/data",
        humi: "https://io.adafruit.com/api/v2/longthangtran/feeds/iot-relay/data",
      };
  
      const responses = await Promise.all(
        Object.values(endpoints).map((url) =>
          fetch(url).then((res) => res.json())
        )
      );
  
      
  
      const [temp, light, soil, pump, led, humi] = responses.map(
        (data) => data[0]?.value || "N/A"
      );
  
     
  
      setSensorData((prev) =>
        prev.map((sensor) => {
          switch (sensor.id) {
            case "temp":
              return { ...sensor, value: `${temp}°C` };
            case "light":
              return { ...sensor, value: `${light} lux` };
            case "soil":
              return { ...sensor, value: `${soil}%` };
            case "pump":
              return { ...sensor, value: pump === "1" ? "ON" : "OFF" };
            case "led":
              return { ...sensor, value: led === "1" ? "ON" : "OFF" };
            case "humi":
              return { ...sensor, value: `${humi}%` };
            default:
              return sensor;
          }
        })
      );
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  useEffect(() => {
    fetchSensorData(); // Initial fetch
    const interval = setInterval(fetchSensorData, 3000); // Fetch every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sensor Data</Text>
        <Text style={styles.subtitle}>
          Last Updated: {new Date().toLocaleTimeString()}
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.gridContainer}>
          {sensorData.map((sensor) => (
            <View key={sensor.id} style={styles.card}>
              <Ionicons name={sensor.icon} size={32} color="#4CAF50" />
              <Text style={styles.sensorName}>{sensor.name}</Text>
              <Text style={styles.sensorValue}>{sensor.value}</Text>
              <Text
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
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.chartButton]}
            onPress={() => navigation.navigate("Charts")}
          >
            <Ionicons name="bar-chart-outline" size={20} color="white" />
            <Text style={styles.buttonText}>View Charts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.chartButton]}
            onPress={() => navigation.navigate("LedControl")}
          >
            <Ionicons name="bulb-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Led Control</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.pumpButton]}
            onPress={() => navigation.navigate("PumpControl")}
          >
            <Ionicons name="water-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Pump Control</Text>
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
