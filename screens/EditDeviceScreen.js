import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  ScrollView,
  Alert
} from "react-native";
import { updateDeviceByDeviceId, updateDeviceByNameService } from "../apis/DeviceService";
import { getThresholdByDeviceAndParam, updateThresHoldByDeviceId } from "../apis/Thresholdservice";

export default function EditDeviceScreen() {
    const route = useRoute();
    const { deviceId, deviceName, deviceType, deviceDataType } = route.params;

    const [nameDevice, setNameDevice] = useState("");
    const [threshold, setThresHold] = useState(0);
    const navigation = useNavigation();
    const [newThreshold, setNewThreshold] = useState(0);

    const isDevice = (type) => {
      return type === "device" ? true : false;
    }

    const handleUpdate = async () => {
      if (!nameDevice) {
        Alert.alert("Warning", "Please fill in name field to change information.");
        return;
      }

      try {
        const res = await updateDeviceByDeviceId(deviceId, {
          device_id: deviceId,
          zone_id: 1,
          name: nameDevice,
          data_type: deviceDataType,
          device_type: deviceType,
          status: "on"
        });

        console.log(deviceId);

        if (res) {
          Alert.alert("Success", `Change name of ${deviceType} successfully.`);
          setNameDevice("");
        }
        else {
          Alert.alert("Error", "Failed to change name. Please try again later.")
        }
      }
      catch (error) {
        console.log("Error to change name: ", error);
      }
    }

      const fetchThreshold = async () => {
        try {
          const res = await getThresholdByDeviceAndParam(deviceId, null);

          if(res) {
            setThresHold(res[0]?.max_value);
          }
        }
        catch (error) {
          console.log("Error fetching threshold of device: ", error);
        }
      }

    useEffect(() => {
      fetchThreshold();
    }, []);

    const handleUpdateThreshold = async () => {
      if(threshold === newThreshold) {
        Alert.alert("New threshold value is the same as the current one. Please enter a different value.");
        return;
      }

      if(!isFinite(newThreshold)) {
        Alert.alert("Please enter only integer or float values.");
        return;
      }

      try {
        const value = Number(newThreshold);
        const res = await updateThresHoldByDeviceId(deviceId, value);

        if (res) {
          Alert.alert("Update threshold successfully");
          setNewThreshold(0);
          fetchThreshold();
        }
      }
      catch (error) {
        console.log("Error update threshold: ", error);
      }
    }

  return (
    <SafeAreaView style={styles.container}>
        <View style={[styles.header, {display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }]}>
        <TouchableOpacity
          style={{ marginRight: 15}}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit {deviceName}</Text>
        </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.formContent}>
      <TextInput
        style={[styles.input, { marginBottom: 15}]}
        placeholder={isDevice(deviceType) ? "Name of device" : "Name of Sensor"}
        autoCapitalize="words"
        value={nameDevice}
        onChangeText={setNameDevice}
      />

      <TouchableOpacity
        style={styles.changeButton}
        onPress={handleUpdate}
      >
        <Text style={styles.buttonText}>Change</Text>
      </TouchableOpacity>

      {isDevice(deviceType) && (
        <View>
        <Text style={{
          fontSize: 16,
          marginBottom: 5
        }}>
          Update Threshold for device:
        </Text>
        <View style={{
          flexDirection: 'row',
          width: '80%',
          alignItems: 'center'
        }}>
        <TextInput
        style={[styles.input, {marginRight: 10}]}
        placeholder={`Current threshold ${threshold}`}
        keyboardType="numeric"
        value={newThreshold}
        onChangeText={setNewThreshold}
        />

        <TouchableOpacity style={{
          backgroundColor: '#237d32',
          height: 40,
          justifyContent: 'center',
          padding: 5,
          borderRadius: 10
        }}
          onPress={handleUpdateThreshold}
        >
          <Text style={{
            fontSize: 15,
            color: '#fff',
            fontWeight: 'bold'
          }}> Submit </Text>
        </TouchableOpacity>
        </View>
        </View>
      )}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.chartButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancel</Text>
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
      marginBottom: 0
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
      width: "100%",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
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
    changeButton: {
            backgroundColor: "#2E7D32",
            padding: 15,
            borderRadius: 8,
            width: "80%",
            marginBottom: 15,
            alignItems: 'center'
    },
    chartButton: {
      backgroundColor: "#f44336",
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
    formContent: {
        flexGrow: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingBottom: 100,
  paddingHorizontal: 20,
      },      
      input: {
        width: "80%",
        height: 50,
        backgroundColor: "white",
        borderRadius: 8,
        padding: 10,
        // marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ddd",
      },
  });
  