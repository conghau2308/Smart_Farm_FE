import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { AIO_KEY } from '@env';
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { getValueOfListSensorservice } from "../apis/SensorService";
import { SensorContext } from "../Contexts/SensorContext";
import { getModeByDeviceIdService, updateModeDeviceService } from "../apis/DeviceControlService";
import axios from "axios";
import { getThresholdByDeviceAndParam } from "../apis/Thresholdservice";
import { ActivityIndicator } from "react-native-paper";
export default function PumpControlScreen({ navigation }) {
  const [isPumpOn, setIsPumpOn] = useState(null);
  const route = useRoute();
  const { deviceId } = route.params;
  const [sensorValue, setSensorValue] = useState([]);
  const { soilSensorId } = useContext(SensorContext);
  const apiUrl = "https://io.adafruit.com/api/v2/hoangvyne/feeds/may-bom/data";
  const [threshold, setThreshold] = useState(0);
  const [modeDivice, setModeDevice] = useState("");
  const [switchValue, setSwitchValue] = useState(false);
  const [loading, setLoading] = useState(false);


  const fetchPumpValue = async () => {
    try {
      const res = await getValueOfListSensorservice([deviceId]);

      if (res) {
        setIsPumpOn(res[0].value);
      }
    }
    catch (error) {
      alert("failed to fetching value of Pump device");
      console.log("Error fetching value of Pump device: ", error);
    }
  }

  const fetchThreshold = async () => {
    try {
      const res = await getThresholdByDeviceAndParam(deviceId, null);

      if (res) {
        setThreshold(res[0].max_value);
      }
    }
    catch (error) {
      console.log("Error fetching threshold: ", error);
    }
  }

  const fetchModeDevice = async () => {
    try {
      const res = await getModeByDeviceIdService(deviceId);

      if (res) {
        setModeDevice(res[0].mode)
        setSwitchValue(res[0].mode === "auto")
      }
    }
    catch (error) {
      console.log("Error fetching mode device: ", error);
    }
  }

  useEffect(() => {
    fetchPumpValue();
    fetchThreshold();
    fetchModeDevice();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchSensorValue = async () => {
        if (soilSensorId === null) {
          console.log("No soil moisture id found");
          return;
        }

        try {
          const response = await getValueOfListSensorservice([soilSensorId]);

          if (response) {
            setSensorValue(response);
          }
          else {
            alert("No data found. Please try again later.")
          }
        }
        catch (error) {
          console.log("Error fetching data:", error)
        }
      }

      fetchSensorValue();

      const interval = setInterval(() => {
        fetchSensorValue();
      }, 5000);

      return () => clearInterval(interval);
    }, [])
  )

  const handleManualPump = async () => {
    try {
      await togglePump(!isPumpOn);
      setIsPumpOn(!isPumpOn);
    }
    catch (error) {
      alert("Cannot control Pump device");
    }
  }

  const togglePump = async (isPumpOn) => {
    try {
        const response = await axios.post(
            apiUrl, {
                value: isPumpOn ? '1' : '0'
            }, // Gửi giá trị "1" để bật, "0" để tắt
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-AIO-Key': AIO_KEY,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error controlling pump:", error);
        throw new Error("Không thể điều khiển máy bơm");
    }
  };

  const handleChangeMode = async (value) => {
    setSwitchValue(value);
    const newMode = value ? "auto" : "manual";
    setModeDevice(newMode);

    try {
      const res = await updateModeDeviceService(deviceId, newMode, "on");

      if (res) {
        Alert.alert("Change mode successfully");

        if (value) {
          setLoading(true);

          setTimeout(() => {
            setLoading(false);
            fetchPumpValue();
          }, 9000)
        }
      }
    }
    catch (error) {
      console.log("Error updating mode:", error);
    }
  }

  const handleAlert = () => {
    Alert.alert("You are in auto mode. To switch to manual, please turn off auto mode.")
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.title}>Pump Control</Text>
      </View>

      {/* Điều khiển thủ công */}
      <View style={styles.section}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.sectionTitle}>Manual Control</Text>
          {switchValue && 
            <TouchableOpacity onPress={() => handleAlert()}>
              <Ionicons name="information-circle" size={24} color="#ff9800" />
            </TouchableOpacity>
          }
        </View>
        {loading ? (
          <View style={{
            height: 100,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{
              fontSize: 16, marginBottom: 10
            }}> Updating value... Please wait.</Text>
            <ActivityIndicator size={30} color="#2e7d32" />
          </View>
        ) : (
        <View style={styles.pumpStatus}>
          <Ionicons
            name={isPumpOn ? "water" : "water-outline"}
            size={48}
            color={isPumpOn ? "#4CAF50" : "#666"}
          />
          <Text
            style={[styles.statusText, { color: isPumpOn ? "#4CAF50" : "#666" }]}
          >
            Pump is {isPumpOn ? "ON" : "OFF"}
          </Text>
        </View>
        )}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isPumpOn ? "#F44336" : "#4CAF50" },
          ]}
          onPress={() => handleManualPump()}
          disabled={loading || switchValue}
        >
          <Text style={styles.buttonText}>
            {isPumpOn ? "Turn Off Pump" : "Turn On Pump"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Kiểm soát độ ẩm đất */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Soil Moisture Control</Text>
        <View style={styles.automationContainer}>
          <Text style={styles.automationText}>Enable Soil Moisture Control</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={switchValue ? "#4CAF50" : "#f4f3f4"}
            onValueChange={ handleChangeMode }
            value={switchValue}
          />
        </View>
        <Text style={styles.statusText}>
          Threshold Of Soil Moisture is: {threshold}%
        </Text>
        <Text style={styles.statusText}>
          Current Soil Moisture: {sensorValue.map((sensor) => sensor.value)}%
        </Text>
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
    flexDirection: "row",
    alignItems: "center",
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
  pumpStatus: {
    alignItems: "center",
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
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
  automationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  automationText: {
    fontSize: 16,
    color: "#333",
  },
  scheduleContainer: {
    marginTop: 20,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 10,
  },
  scheduleItemActive: {
    backgroundColor: "#4CAF50",
  },
  scheduleText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#666",
  },
  scheduleTextActive: {
    color: "white",
  },
});
