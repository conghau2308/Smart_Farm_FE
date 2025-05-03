import { useRoute } from "@react-navigation/native";
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { WebView } from 'react-native-webview';

export default function ZoneScreen ({ navigation }) {
    const route = useRoute();
    const { zoneId } = route.params;
    const dashboardUrl = "https://demo.thingsboard.io/dashboard/ab7c9c00-f8c9-11ef-9dbc-834dadad7dd9?publicId=41a9ff80-f8af-11ef-9dbc-834dadad7dd9";

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Chart { zoneId }</Text>
                <Text style={styles.subtitle}>
                      Last Updated: {new Date().toLocaleTimeString()}
                </Text>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.gridContainer}>
                <WebView
                    source={{ uri: dashboardUrl }}
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
                        {/* <Ionicons name="bar-chart-outline" size={20} color="white" /> */}
                            <Text style={styles.buttonText}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.chartButton]}
                        onPress={() => navigation.navigate("Device", { zoneId })}
                    >
                        {/* <Ionicons name="bulb-outline" size={20} color="white" /> */}
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
        height: 1500,
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