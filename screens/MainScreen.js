import { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { deleteZoneByNameService, getAllZonesService } from "../apis/ZoneService";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";


export default function MainScreen({ navigation }) {
    const [zone, setZone] = useState([]);
    const route = useRoute();
    const { zoneAdded } = route.params || false;

    const fetchAllZones = async () => {
      try {
        const response = await getAllZonesService();
        setZone(response);
      }
      catch (error) {
        console.error("Error fetching zones:", error);
        Alert.alert("Error", "Failed to fetch zones. Please try again later.");
      }
    };

    useEffect(() => {
        fetchAllZones();

        if (zoneAdded) {
          fetchAllZones();
        }
    }, [zoneAdded]);

    const handleDeleteZone = async (zoneName) => {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this zone?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Delete',
            onPress: async () => {
              try {
                await deleteZoneByNameService(zoneName);
                fetchAllZones();
              }
              catch (error) {
                console.log("Error deleting zone:", error);
                Alert.alert("Error", "Failed to delete zone. Please try again later.")
              }
            }
          }
        ]
      )
    }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Zone</Text>
        <Text style={styles.subtitle}>
          Time: {new Date().toLocaleTimeString()}
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.gridContainer}>
          {zone.map((zone, id) => (
            <TouchableOpacity
            key={id}
            style={styles.card}
            onPress={() => navigation.navigate("Zone", { zoneId: zone.name })}
            >
                <View style={{
                  width: '100%',
                  height: 170
                }}>
              <Ionicons name='leaf' style={{textAlign: 'center'}} size={32} color="#4CAF50" />
              <Text style={[styles.sensorValue, {textAlign: 'center'}]}>{zone.name}</Text>

              <Text style={styles.description}> {zone.description}</Text>

              <Text style={{
                fontSize: 14,
                color: '#666'
              }}>
                Updated at: {new Date(zone.updatedAt).toLocaleTimeString()}
              </Text>

              <Text style={{
                fontSize: 14,
                color: '#666'
              }}>
                Created at: {new Date(zone.createdAt).toLocaleTimeString()}
              </Text>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end'
              }}>
              <TouchableOpacity onPress={() => handleDeleteZone(zone.name)} style={{
                width: 20,
              }}>
                <Ionicons name="trash" style={{textAlign: 'right'}} size={20} color="#262626"/>
              </TouchableOpacity>
              </View>
            </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.chartButton]}
            onPress={() => navigation.navigate("Add Zone")}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.buttonText}>Add Zone</Text>
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
  description: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    height: 50
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
    width: "100%",
    alignItems: "center",
    shadowColor: "#4caf50",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#4caf50'
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
