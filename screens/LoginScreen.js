import axios from "axios";
import { useCallback, useContext, useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { loginService } from "../apis/UserService";
import { AuthContext } from "../Contexts/AuthContext";


export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // const loginUser = useCallback(async () => {
  //   console.log('username', username);
  //   console.log('password', password);
  //   navigation.navigate('Main');
  //   // try {
  //   //   const response = await axios.post('http://10.0.2.2:8080/api/auth/login', {
  //   //     username, password
  //   //   });
  //   //   const { data } = response;
  //   //   if (data.success) {
  //   //     navigation.navigate('Sensors')
  //   //   } else {
  //   //     alert('Login failed: ' + data.message);
  //   //   }
  //   // } catch (error) {
  //   //   console.log(error);
  //   // }
  // }, [username, password])
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Warning", "Plaese fill all fields");
      return;
    }
    
    try {
      const token = await loginService(username, password);

      if (token) {
        login(token);
        navigation.navigate("Main");
      }
    }
    catch (error) {
      console.log("Login failed:", error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
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
    marginBottom: 40,
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
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 10,
  },
  linkText: {
    color: "#4CAF50",
    fontSize: 16,
  },
});
