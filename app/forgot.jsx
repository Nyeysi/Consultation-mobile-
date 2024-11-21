import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import head from '../assets/images/Capture.png'; // Ensure this path is correct

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    try {
      const response = await fetch(
        'https://consultationapi-production.up.railway.app/api/v1/professor/forget-password',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );
      const textResponse = await response.text(); // Get the raw text response
      console.log('Raw Response:', textResponse);

      if (response.headers.get('Content-Type')?.includes('application/json')) {
        // Attempt to parse JSON
        const jsonResponse = JSON.parse(textResponse);
        if (response.ok) {
          Alert.alert('Success', 'Password reset email sent successfully!');
          navigation.navigate('New Password');
        } else {
          Alert.alert('Error', jsonResponse.message || 'Failed to send reset email.');
        }
      } else {
        Alert.alert('Error', 'Unexpected server response.');
        console.log('Non-JSON response received:', textResponse);
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
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleForgotPassword}>
        <Text style={styles.submitButtonText}>Send Reset Email</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.switchMode}>Back to Login</Text>
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
    color: 'black',
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
    backgroundColor: '#f9f9f9',
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

export default ForgotPassword;
