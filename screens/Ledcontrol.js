import { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AIO_KEY } from '@env';

export default function LightControlScreen({ navigation }) {
  const [isLightOn, setIsLightOn] = useState(false);

  // Hàm lấy trạng thái đèn LED từ API khi màn hình được load lần đầu tiên
  useEffect(() => {
    const fetchLightStatus = async () => {
      try {
        const apiUrl = 'https://io.adafruit.com/api/v2/hoangvyne/feeds/led/data';
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-AIO-Key': AIO_KEY,
          },
        });
        const data = await response.json();
        if (data && data[0] && data[0].value >= "1") {
          setIsLightOn(true); // Nếu giá trị là lớn hơn hoặc bằng "1", đèn LED đang bật
        } else {
          setIsLightOn(false); // Nếu giá trị là "0", đèn LED đang tắt
        }
      } catch (error) {
        console.error("Lỗi khi lấy trạng thái đèn LED:", error);
      }
    };

    fetchLightStatus();
  }, []); // Chỉ chạy một lần khi component được mount

  // Hàm bật/tắt đèn LED
  const toggleLight = async () => {
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
        <Text style={styles.sectionTitle}>Manual Control</Text>
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

        <TouchableOpacity
          style={[styles.button, { backgroundColor: isLightOn ? "#F44336" : "#2E7D32" }]}
          onPress={toggleLight}
        >
          <Text style={styles.buttonText}>
            {isLightOn ? "Turn Off Light" : "Turn On Light"}
          </Text>
        </TouchableOpacity>
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
});