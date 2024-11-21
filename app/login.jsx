import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import head from '../assets/images/Capture.png'; // Ensure the image path is correct
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const LoginForm = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    const loginData = { email, password };
  
    try {
      setLoading(true);
  
      const response = await fetch('https://consultationapi-production.up.railway.app/api/v1/professor/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response Error:', errorText);
        Alert.alert('Error', 'Failed to log in. ' + errorText);
        return;
      }
  
      let responseData;
      try {
        responseData = await response.json();
        console.log('Response Data:', responseData); // Log response data
      } catch (error) {
        console.error('Error parsing JSON:', error);
        Alert.alert('Error', 'Failed to parse response. Please try again.');
        return;
      }
  
      // Ensure responseData has the expected structure
      if (response.status === 200) {
        Alert.alert('Success', 'Login successful!');
        // Store professor.id in localStorage as 'professor_id'
        await AsyncStorage.setItem('professor_id', responseData.professor.id);
        navigation.navigate('DashboardProf', { user: responseData.professor });
      } else {
        Alert.alert('Error', `Login failed with status code: ${response.status}`);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Image source={head} style={styles.headerImage} />
      <Text style={styles.headerText}>Consultation Management System</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword} // Toggle password visibility
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#999" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleLogin} disabled={loading}>
        <Text style={styles.submitButtonText}>
          {loading ? 'Loading...' : 'Log In'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Instructor')} style={styles.registerButton}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles (same as before)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  headerImage: {
    alignItems: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
    position: 'relative', // To position the icon over the input
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
  },
  submitButton: {
    backgroundColor: '#276630',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  forgotPassword: {
    color: '#007bff',
    marginTop: 10,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: 20,
  },
  registerText: {
    color: '#007bff',
    textAlign: 'center',
  },
});

export default LoginForm;
