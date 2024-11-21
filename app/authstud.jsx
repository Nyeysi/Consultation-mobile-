
import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import head from '../assets/images/Capture.png';

const LoginScreen = ({ navigation }) => {
  // State for email, password, name, student number, department, and loading status
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [student_no, setStudentNumber] = useState('');
  const [dept, setDepartment] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleRegister = async () => {
    // Example validation (you can customize it as needed)
    if (!email || !password || !name || !student_no || !dept) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const userData = {
      name,
      email,
      password,
      student_no,
      dept,
    };

    try {
      setLoading(true); // Start loading indicator

      // Sending POST request to your backend to register the user
      const response = await fetch('http://192.168.0.103:5003/addOther', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      setLoading(false); // Stop loading indicator after response

      if (response.ok) {
        Alert.alert('Success', 'User registered successfully!');
        // Clear the form fields
        setName('');
        setStudentNumber('');
        setDepartment('');
        setEmail('');
        setPassword('');
        navigation.navigate('Login'); // Navigate to the login page after successful registration
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to register user.');
      }
    } catch (error) {
      setLoading(false); // Stop loading indicator in case of error
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={head} />
        <Text style={styles.headerText}>Appointment Management System</Text>
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
          placeholder="Student Number"
          value={student_no}
          onChangeText={setStudentNumber}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Department"
          value={dept}
          onChangeText={setDepartment}
        />
      </View>
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
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Register</Text>
        )}
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
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
    marginTop: 10,
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

export default LoginScreen;