import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Switch
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AIO_KEY } from '@env';
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { getValueOfListSensorservice } from "../apis/SensorService";
import { getThresholdByDeviceAndParam } from "../apis/Thresholdservice";
import { getModeByDeviceIdService, updateModeDeviceService } from "../apis/DeviceControlService";
import { SensorContext } from "../Contexts/SensorContext";
import axios from "axios";
import { ActivityIndicator } from "react-native-paper";

export default function LightControlScreen({ navigation }) {
  const [isLightOn, setIsLightOn] = useState(null);
  const route = useRoute();
  const { deviceId } = route.params;
  const [threshold, setThreshold] = useState(0);
  const [modeDevice, setModeDevice] = useState("");
  const [switchValue, setSwitchValue] = useState(false);
  const { lightSensorId } = useContext(SensorContext);
  const [sensorValue, setSensorValue] = useState(0);
  const apiUrl = 'https://io.adafruit.com/api/v2/hoangvyne/feeds/led/data';
  const [loading, setLoading] = useState(false);

  // // Hàm lấy trạng thái đèn LED từ API khi màn hình được load lần đầu tiên
  // useEffect(() => {
  //   const fetchLightStatus = async () => {
  //     try {
  //       const apiUrl = 'https://io.adafruit.com/api/v2/hoangvyne/feeds/led/data';
  //       const response = await fetch(apiUrl, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'X-AIO-Key': AIO_KEY,
  //         },
  //       });
  //       const data = await response.json();
  //       if (data && data[0] && data[0].value > "0") {
  //         setIsLightOn(true); // Nếu giá trị là lớn hơn hoặc bằng "1", đèn LED đang bật
  //       } else {
  //         setIsLightOn(false); // Nếu giá trị là "0", đèn LED đang tắt
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi lấy trạng thái đèn LED:", error);
  //     }
  //   };

  //   fetchLightStatus();
  // }, []); // Chỉ chạy một lần khi component được mount

  const fetchLightValue = async () => {
    try {
      const res = await getValueOfListSensorservice([deviceId]);

      if (res) {
        const value = res[0].value;

        if (value > 0) {
          setIsLightOn(true);
        }
        else {
          setIsLightOn(false);
        }
      }
    }
    catch (error) {
      console.log("Error fetching LED Light value: ", error);
    }
  }

  const fetchThreshold = async () => {
    try {
      const res = await getThresholdByDeviceAndParam(deviceId, null);

      if(res) {
        setThreshold(res[0]?.max_value);
      }
    }
    catch (error) {
      console.log("Error fetching threshold of Lux sensor: ", error);
    }
  }

  const fetchModeDevice = async () => {
    try {
      const res = await getModeByDeviceIdService(deviceId);

      if(res) {
        setModeDevice(res[0]?.mode);
        setSwitchValue(res[0]?.mode === "auto");
      }
    }
    catch (error) {
      console.log("Error fetching mode of device: ", error);
    }
  }

  useEffect(() => {
    fetchLightValue();
    fetchThreshold();
    fetchModeDevice();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchSensorValue = async () => {
        try {
          const res = await getValueOfListSensorservice([lightSensorId]);

          if (res) {
            setSensorValue(res[0]?.value);
          }
        }
        catch (error) {
          console.log("Error fetching Lux sensor value: ", error);
        }
      }
      
      fetchSensorValue();

      const interval = setInterval(() => {
        fetchSensorValue();
      }, 5000);

      return () => clearInterval(interval);

    }, [])
  )

  // Hàm bật/tắt đèn LED
  const toggleLightt = async () => {
    try {
      const apiUrl = 'https://io.adafruit.com/api/v2/hoangvyne/feeds/led/data';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AIO-Key': AIO_KEY,
        },
        body: JSON.stringify({ value: isLightOn ? "0" : "100" }), // Gửi giá trị "0" hoặc "1"
      });

      if (response.ok) {
        setIsLightOn(!isLightOn); // Chuyển đổi trạng thái đèn LED
      } else {
        console.error("Không thể bật/tắt đèn LED");
      }
    } catch (error) {
      console.error("Lỗi khi điều khiển đèn LED:", error);
    }
  };

// Hàm điều khiển bật/tắt đèn LED
// true sẽ bật đèn, false sẽ tắt đèn
  const toggleLight = async (isLightOn) => {
    try {
      const response = await axios.post(
        apiUrl,
        { value: isLightOn ? '100' : '0' }, // Gửi giá trị "0" hoặc "100"
        {
          headers: {
            'Content-Type': 'application/json',
            'X-AIO-Key': AIO_KEY,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error controlling light:", error);
      throw new Error("Không thể điều khiển đèn");
    }
  };

  const handleManualLight = async () => {
    try {
      await toggleLight(!isLightOn);
      setIsLightOn(!isLightOn);
    }
    catch (error) {
      console.log("Cannot control Led Light device");
    }
  }

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
            fetchLightValue();
          }, 9000)
        }
      }
    }
    catch (error) {
      console.log("Error change mode led light device: ", error);
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
        <Text style={styles.title}>Light Control</Text>
      </View>

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
          <View style={styles.lightStatus}>
          <Ionicons
            name={isLightOn ? "bulb" : "bulb-outline"}
            size={48}
            color={isLightOn ? "#FFD700" : "#666"}
          />
          <Text
            style={[styles.statusText, { color: isLightOn ? "#2E7D32" : "#666" }]}
          >
            Light is {isLightOn ? "ON" : "OFF"}
          </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: isLightOn ? "#F44336" : "#2E7D32" }]}
          onPress={() => handleManualLight()}
          disabled={loading || switchValue}
        >
          <Text style={styles.buttonText}>
            {isLightOn ? "Turn Off Light" : "Turn On Light"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Light Control</Text>
          <View style={styles.automationContainer}>
            <Text style={styles.automationText}>Enable Light Control</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={switchValue ? "#4CAF50" : "#f4f3f4"}
              onValueChange={ handleChangeMode }
              value={switchValue}
            />
          </View>
          <Text style={styles.statusText}>
                Threshold Of Light is: {threshold} lux
          </Text>
          <Text style={styles.statusText}>
                Current Light: {sensorValue} lux
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
  lightStatus: {
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