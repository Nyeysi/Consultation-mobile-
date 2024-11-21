import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import head from '../assets/images/Capture.png'; // Ensure this path is correct

const AuthProf = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');

  // Function to handle user registration with API
  const handleRegister = async () => {
    // Check if all fields are filled
    if (!email || !name || !password  || !department) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const userData = {
      name,
      email,
      password,
      department,
    };

    try {
      // Sending POST request to the API
      const response = await fetch(
        'https://consultationapi-production.up.railway.app/api/v1/professor/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData), // Convert userData to JSON
        }
      );

      // Handle response
      if (response.ok) {
        Alert.alert('Success', 'User registered successfully!');
        navigation.navigate('Login'); // Navigate to the login page
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
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
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Department"
          value={department}
          onChangeText={setDepartment}
        />
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
        <Text style={styles.submitButtonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.switchMode}>Already have an Account?</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  headerImage: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
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
  switchMode: {
    color: '#007bff',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default AuthProf;
