import { Text, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Smart Farm</Text>
      <Text style={styles.subtitle}>Manage your farm smarter, not harder</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.signupButton]}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
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
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    marginBottom: 15,
  },
  signupButton: {
    backgroundColor: "#2E7D32",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
