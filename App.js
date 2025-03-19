import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import WelcomeScreen from "./screens/WelcomeScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import SensorScreen from "./screens/SensorScreen";
import ChartScreen from "./screens/ChartScreen";
import PumpControlScreen from "./screens/PumpControlScreen";
import LedControlScreen from "./screens/Ledcontrol";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Sensors" component={SensorScreen} />
        <Stack.Screen name="Charts" component={ChartScreen} />
        <Stack.Screen name="PumpControl" component={PumpControlScreen} />
        <Stack.Screen name="LedControl" component={LedControlScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
