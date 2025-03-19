import axios from "axios";
import { useCallback, useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";

// const registerUser = async (username, email, address, phone, password) => {
//   try {
//     const response = await fetch('https://localhost:8080/api/auth/register', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ username, email, address, phone, password }),
//     });
//     const data = await response.json();
//     if (data.success) {
//       alert('Registration successful!');
//     } else {
//       alert('Registration failed: ' + data.message);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

export default function SignupScreen({ navigation }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const registerUser = useCallback(async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error comfirm password')
    }
    console.log('username', username);
    console.log('password', password);
    console.log('email', email);
    console.log('phone', phone);

    try {
      const response = await axios.post('http://10.0.2.2:8080/api/auth/register', {
        username, password, email, phone
      });
      const { data } = response;
      if (data.success) {
        alert('Registration successful!');
        navigation.navigate('Login');
      } else {
        alert('Registration failed: ' + data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }, [username, password, email, phone]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="User Name"
        autoCapitalize="words"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone number"
        secureTextEntry
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={registerUser}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.linkText}>Already have an account? Login</Text>
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
    backgroundColor: "#2E7D32",
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
