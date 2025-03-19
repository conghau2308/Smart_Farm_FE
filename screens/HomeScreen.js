import { Text, SafeAreaView, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import AssetExample from "../components/AssetExample";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.paragraph}>
        Change code in the editor and watch it change on your phone! Save to get
        a shareable url.
      </Text>
      <Card>
        <AssetExample />
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    color: "#666",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
    width: "80%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
