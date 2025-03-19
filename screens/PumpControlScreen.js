import { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function PumpControlScreen({ navigation }) {
  const [isPumpOn, setIsPumpOn] = useState(false);
  const [isAutomationEnabled, setIsAutomationEnabled] = useState(false);
  const [isSoilMoistureControlEnabled, setIsSoilMoistureControlEnabled] =
    useState(false);
  const [soilMoisture, setSoilMoisture] = useState(50);
  const [hasAlerted, setHasAlerted] = useState(false);
  // Hàm đọc dữ liệu độ ẩm đất từ API
  const fetchSoilMoisture = async () => {
    try {
      const apiUrl =
        "https://io.adafruit.com/api/v2/longthangtran/feeds/iot-soil-moisture";
      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          "X-AIO-Key": AIO_KEY ,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const moistureValue = parseFloat(data.last_value);
        setSoilMoisture(moistureValue);

        // Kiểm tra điều kiện bật/tắt máy bơm hoặc cảnh báo
        if (isSoilMoistureControlEnabled) {
          // Tự động bật máy bơm nếu độ ẩm < 15%
          if (moistureValue < 15 && !isPumpOn) {
            turnPumpOn();
            setHasAlerted(false); 
          }
  
          // Hiển thị cảnh báo 1 lần nếu độ ẩm trong khoảng 20% - 30%
          if (moistureValue >= 20 && moistureValue <= 30 && !hasAlerted) {
            alert("Độ ẩm đất đạt mức 20%-30%");
            setHasAlerted(true); // Đặt cờ đã cảnh báo
          }
  
          // Tự động tắt máy bơm nếu độ ẩm > 30%
          if (moistureValue > 30 ) {
            turnPumpOff();
            setHasAlerted(false); 
          }
  
          // Reset cờ cảnh báo nếu độ ẩm ra ngoài khoảng 20%-30%
          if (moistureValue < 20 || moistureValue > 30) {
            setHasAlerted(false);
          }
        }
      } else {
        console.error("Không thể lấy dữ liệu độ ẩm đất");
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu độ ẩm đất:", error);
    }
  };

  // Hàm bật/tắt máy bơm
  const togglePump = async () => {
    try {
      const apiUrl =
        "https://io.adafruit.com/api/v2/longthangtran/feeds/iot-pump/data";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AIO-Key": AIO_KEY,
        },
        body: JSON.stringify({ value: isPumpOn ? "0" : "1" }),
      });

      if (response.ok) {
        const newState = !isPumpOn;
        setIsPumpOn(newState);
        await AsyncStorage.setItem("isPumpOn", JSON.stringify(newState)); // Lưu trạng thái
      } else {
        console.error("Không thể bật/tắt máy bơm");
      }
    } catch (error) {
      console.error("Lỗi khi điều khiển máy bơm:", error);
    }
  };

  const turnPumpOn = async () => {
    try {
      const apiUrl =
        "https://io.adafruit.com/api/v2/longthangtran/feeds/iot-pump/data";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AIO-Key": AIO_KEY,
        },
        body: JSON.stringify({ value: "1" }),
      });
  
      if (response.ok) {
        setIsPumpOn(true);
      } else {
        console.error("Không thể bật máy bơm");
      }
    } catch (error) {
      console.error("Lỗi khi bật máy bơm:", error);
    }
  };
  
  const turnPumpOff = async () => {
    try {
      const apiUrl =
        "https://io.adafruit.com/api/v2/longthangtran/feeds/iot-pump/data";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AIO-Key": AIO_KEY,
        },
        body: JSON.stringify({ value: "0" }),
      });
  
      if (response.ok) {
        setIsPumpOn(false);
      } else {
        console.error("Không thể tắt máy bơm");
      }
    } catch (error) {
      console.error("Lỗi khi tắt máy bơm:", error);
    }
  };

  const fetchPumpStatus = async () => {
    try {
      const apiUrl =
        "https://io.adafruit.com/api/v2/longthangtran/feeds/iot-pump";
      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          "X-AIO-Key": AIO_KEY,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        const pumpStatus = data.last_value === "1"; // Kiểm tra trạng thái máy bơm
        setIsPumpOn(pumpStatus);
      } else {
        console.error("Failed to fetch pump status.");
      }
    } catch (error) {
      console.error("Error fetching pump status:", error);
    }
  };
  useEffect(()=> {
    fetchPumpStatus();
  })
  // Khôi phục trạng thái từ AsyncStorage khi màn hình được tải
  useEffect(() => {
    const loadState = async () => {
      try {
        const pumpState = await AsyncStorage.getItem("isPumpOn");
        const automationState = await AsyncStorage.getItem(
          "isSoilMoistureControlEnabled"
        );

        if (pumpState !== null) setIsPumpOn(JSON.parse(pumpState));
        if (automationState !== null)
          setIsSoilMoistureControlEnabled(JSON.parse(automationState));
      } catch (error) {
        console.error("Lỗi khi tải trạng thái:", error);
      }
    };

    loadState();
  }, []);

  // Lấy dữ liệu độ ẩm đất định kỳ khi màn hình hiển thị
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSoilMoisture();
    }, 5000);

    return () => clearInterval(interval);
  }, [isSoilMoistureControlEnabled]);

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
        <Text style={styles.sectionTitle}>Manual Control</Text>
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
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isPumpOn ? "#F44336" : "#4CAF50" },
          ]}
          onPress={togglePump}
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
            thumbColor={isSoilMoistureControlEnabled ? "#4CAF50" : "#f4f3f4"}
            onValueChange={async () => {
              const newState = !isSoilMoistureControlEnabled;
              setIsSoilMoistureControlEnabled(newState);
              await AsyncStorage.setItem(
                "isSoilMoistureControlEnabled",
                JSON.stringify(newState)
              ); // Lưu trạng thái
            }}
            value={isSoilMoistureControlEnabled}
          />
        </View>
        <Text style={styles.statusText}>
          Current Soil Moisture: {soilMoisture}%
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
