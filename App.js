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
import MainScreen from "./screens/MainScreen";
import ZoneScreen from "./screens/ZoneScreen";
import DeviceScreen from "./screens/DeviceScreen";
import EditDeviceScreen from "./screens/EditDeviceScreen";
import AddDeviceScreen from "./screens/AddDeviceScreen";
import DetailSensorScreen from "./screens/SensorDetailScreen";
import { AuthProvider } from "./Contexts/AuthContext";
import AddZoneScreen from "./screens/AddZoneScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <AuthProvider>
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
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Zone" component={ZoneScreen} />
        <Stack.Screen name="Device" component={DeviceScreen} />
        <Stack.Screen name="Edit Device" component={EditDeviceScreen} />
        <Stack.Screen name="Add Device" component={AddDeviceScreen} />
        <Stack.Screen name="Sensor Detail" component={DetailSensorScreen} />
        <Stack.Screen name="Add Zone" component={AddZoneScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </AuthProvider>
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
