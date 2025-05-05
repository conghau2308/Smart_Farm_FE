import { useFocusEffect, useRoute } from "@react-navigation/native";
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet, ScrollView, ActivityIndicator, Modal, FlatList, Alert } from "react-native";
import { WebView } from 'react-native-webview';
import { getAllDevicesByZoneNameService } from "../apis/DeviceService";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function ZoneScreen ({ navigation }) {
    const route = useRoute();
    const { zoneId } = route.params;
    const [device, setDevice] = useState([]);
    const [gaugeUrl, setGaugeUrl] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVis_1, setModalVis_1] = useState(false);
    const [modalVis_2, setModalVis_2] = useState(false);
    const [barchartUrl, setBarchartUrl] = useState("");
    const [barchartId_1, setBarchartId_1] = useState(null);
    const [barchartId_2, setBarchartId_2] = useState(null);
    const [nameBarchart_1, setNameBarchart_1] = useState("");
    const [nameBarchart_2, setNameBarchart_2] = useState("");

    const handleSelectGauge = (device_id) => {
      setModalVisible(false);
      setGaugeUrl(`http://10.0.2.2:3000/d-solo/bekqce3yrnlkwe/smart-farm-dashboard?orgId=1&from=now-1m&to=now&panelId=2&var-device_ids=${device_id}&refresh=5s&fullscreen&theme=ligh`);
    }

    const handleSelectBarchart_1 = (device_id, name) => {
      setBarchartId_1(device_id);
      setNameBarchart_1(name);
      setModalVis_1(false);
    }

    const handleSelectBarchart_2 = (device_id, name) => {
      setBarchartId_2(device_id);
      setNameBarchart_2(name);
      setModalVis_2(false);
    }

    const handleViewBarchart = () => {
      if(!barchartId_1 || !barchartId_2) {
        Alert.alert("Error", "Please select two device.");
        return;
      }

      setBarchartUrl(`http://10.0.2.2:3000/d-solo/bekqce3yrnlkwe/smart-farm-dashboard?orgId=1&from=now-6s&to=now&panelId=3&var-device_id=${barchartId_1}&var-device_id=${barchartId_2}&refresh=5s&fullscreen&theme=ligh`)
    }

    useEffect(() => {
    }, [gaugeUrl]);

    useEffect(() => {
    }, [barchartUrl])

    const fetchAllDevice = async () => {
      try {
        const res = await getAllDevicesByZoneNameService(zoneId);

        if(res) {
          setDevice(res);
          setGaugeUrl(`http://10.0.2.2:3000/d-solo/bekqce3yrnlkwe/smart-farm-dashboard?orgId=1&from=now-1m&to=now&panelId=2&var-device_ids=${res[0]?.device_id}&refresh=5s&fullscreen&theme=ligh`);

          if(res?.length >= 2) {
            setBarchartUrl(`http://10.0.2.2:3000/d-solo/bekqce3yrnlkwe/smart-farm-dashboard?orgId=1&from=now-6s&to=now&panelId=3&var-device_id=${res[0]?.device_id}&var-device_id=${res[1]?.device_id}&refresh=5s&fullscreen&theme=ligh`)
          }
        }
      }
      catch (error) {
        console.log("Error fetching device of zone: ", error);
      }
    }

    useFocusEffect(
      React.useCallback(() => {
        fetchAllDevice();
      }, [])
    )
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Chart { zoneId }</Text>
                <Text style={styles.subtitle}>
                      Last Updated: {new Date().toLocaleTimeString()}
                </Text>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={[styles.gridContainer, { height: 400 }]}>
                  <TouchableOpacity style={{
                    marginBottom: 10,
                    backgroundColor: '#2e7d32',
                    borderRadius: 10,
                    width: '40%',
                    padding: 5
                  }} onPress={() => setModalVisible(true)}>
                    <Text style={{
                      color: '#fff',
                      fontSize: 18,
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}> Open Device List </Text>
                  </TouchableOpacity>
                  
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                  >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                      <View style={{ width: 360, height: 330, backgroundColor: 'white', padding: 20 }}>
                        <Text style={{ fontSize: 18, marginBottom: 20 }}>Select a Device:</Text>
                      <FlatList
                        data={device}
                        keyExtractor={(item) => item.device_id.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => handleSelectGauge(item.device_id)}
                            style={{
                              backgroundColor: '#2e7d32',
                              marginBottom: 10,
                              padding: 3,
                              borderRadius: 10
                            }}
                          >
                            <Text style={{
                              fontSize: 18,
                              color: '#fff',
                              fontWeight: 'bold',
                              textAlign: 'center'
                            }}> {item.name} ({item.data_type})</Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                    </View>
                  </Modal>
                <WebView
                    source={{ uri: gaugeUrl }}
                    style={{ flex: 1 }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
                />
                </View>

                <View style={[styles.gridContainer, { height: 500 }]}>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                  <TouchableOpacity style={{
                    marginBottom: 10,
                    backgroundColor: '#2e7d32',
                    borderRadius: 10,
                    width: '40%',
                    padding: 5
                  }} onPress={() => setModalVis_1(true)}>
                    <Text style={{
                      color: '#fff',
                      fontSize: 18,
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}> Select Device 1 </Text>
                  </TouchableOpacity>

                  <Text style={{
                    fontSize: 17,
                    marginBottom: 10,
                    marginLeft: 10,
                    fontWeight: 'bold'
                  }}> {nameBarchart_1} </Text>
                  </View>
                  
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVis_1}
                    onRequestClose={() => setModalVis_1(false)}
                  >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                      <View style={{ width: 360, height: 330, backgroundColor: 'white', padding: 20 }}>
                        <Text style={{ fontSize: 18, marginBottom: 20 }}>Select a Device:</Text>
                      <FlatList
                        data={device}
                        keyExtractor={(item) => item.device_id.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => handleSelectBarchart_1(item.device_id, item.name)}
                            style={{
                              backgroundColor: '#2e7d32',
                              marginBottom: 10,
                              padding: 3,
                              borderRadius: 10
                            }}
                          >
                            <Text style={{
                              fontSize: 18,
                              color: '#fff',
                              fontWeight: 'bold',
                              textAlign: 'center'
                            }}> {item.name} ({item.data_type})</Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                    </View>
                  </Modal>

                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                  <TouchableOpacity style={{
                    marginBottom: 10,
                    backgroundColor: '#2e7d32',
                    borderRadius: 10,
                    width: '40%',
                    padding: 5
                  }} onPress={() => setModalVis_2(true)}>
                    <Text style={{
                      color: '#fff',
                      fontSize: 18,
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}> Select Device 2 </Text>
                  </TouchableOpacity>

                  <Text style={{
                    marginBottom: 10,
                    marginLeft: 10,
                    fontSize: 17,
                    fontWeight: 'bold'
                  }}> {nameBarchart_2} </Text>
                  </View>
                  
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVis_2}
                    onRequestClose={() => setModalVis_2(false)}
                  >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                      <View style={{ width: 360, height: 330, backgroundColor: 'white', padding: 20 }}>
                        <Text style={{ fontSize: 18, marginBottom: 20 }}>Select a Device:</Text>
                      <FlatList
                        data={device}
                        keyExtractor={(item) => item.device_id.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => handleSelectBarchart_2(item.device_id, item.name)}
                            style={{
                              backgroundColor: '#2e7d32',
                              marginBottom: 10,
                              padding: 3,
                              borderRadius: 10
                            }}
                          >
                            <Text style={{
                              fontSize: 18,
                              color: '#fff',
                              fontWeight: 'bold',
                              textAlign: 'center'
                            }}> {item.name} ({item.data_type})</Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                    </View>
                  </Modal>

                  <View style={{
                    alignItems: 'center'
                  }}>
                  <TouchableOpacity style={{
                    backgroundColor: '#4caf50',
                    padding: 5,
                    width: '40%',
                    borderRadius: 10,
                    marginBottom: 10,
                  }} onPress={() => handleViewBarchart()}>
                    <Text style={{
                      fontSize: 18,
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}> View bar chart </Text>
                  </TouchableOpacity>
                  </View>


                <WebView
                    source={{ uri: barchartUrl }}
                    style={{ flex: 1 }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
                />
                </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.button, styles.chartButton]}
                        onPress={() => navigation.navigate("Main")}
                    >
                        <Ionicons name="home" size={20} color="white" />
                            <Text style={styles.buttonText}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.chartButton]}
                        onPress={() => navigation.navigate("Device", { zoneId })}
                    >
                        <Ionicons name="hardware-chip" size={20} color="white" />
                    <Text style={styles.buttonText}>Device</Text>
                    </TouchableOpacity>
                </View>
                </View>
        </SafeAreaView>
    )
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
        // height: 400,
        marginBottom: 50
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