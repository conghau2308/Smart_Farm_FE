import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useCallback, useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import { Menu } from "react-native-paper";

export default function AddDeviceScreen() {

    const [nameDevice, setNameDevice] = useState("");
    const [threshold, setThresHold] = useState(0);
    const navigation = useNavigation();

    const [menuVisible, setMenuVisible] = useState(false);
const [selectedDevice, setSelectedDevice] = useState("");

const openMenu = () => setMenuVisible(true);
const closeMenu = () => setMenuVisible(false);


    const [sensorData, setSensorData] = useState([
        {
          id: "pump",
          name: "Pump",
          value: "Loading...",
          icon: "water-outline",
          status: "Normal",
        },
        {
          id: "led",
          name: "LED",
          value: "Loading...",
          icon: "bulb-outline",
          status: "Normal",
        }
      ]);

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
                <Text style={styles.title}>Add new device</Text>
        </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.formContent}>

      <TextInput
        style={styles.input}
        placeholder="Name of device"
        autoCapitalize="words"
        value={nameDevice}
        onChangeText={setNameDevice}
      />

      <TextInput
        style={styles.input}
        placeholder="Threshold"
        keyboardType="numeric"
        value={threshold}
        onChangeText={setThresHold}
      />

      <TouchableOpacity
        style={styles.changeButton}
      >
        <Text style={styles.buttonText}>Change</Text>
      </TouchableOpacity>
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
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ddd",
      },
  });
  