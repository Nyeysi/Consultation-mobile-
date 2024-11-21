import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import head from '../assets/images/Capture.png'; // Ensure this path is correct
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library

const CreateNewPassword = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false); // State to toggle visibility of new password

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      Alert.alert('Error', 'Please fill in the new password.');
      return;
    }

    if (!verificationCode) {
      Alert.alert('Error', 'Please enter the verification code.');
      return;
    }

    // Prepare data for API call
    const payload = {
      new_password: newPassword,
      reset_token: verificationCode,
    };

    try {
      const response = await fetch('https://consultationapi-production.up.railway.app/api/v1/professor/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Password updated successfully!');
        navigation.navigate('Login'); // Navigate to login screen
      } else {
        Alert.alert('Error', data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('Error', 'Failed to update password. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={head} style={styles.headerImage} />
      <Text style={styles.headerText}>Consultation Management System</Text>
      <Text style={styles.helperText}>
        Your new password must be at least 8 characters long.
      </Text>

      {/* Verification Code Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Verification Code (Sent to your email)"
          value={verificationCode}
          onChangeText={setVerificationCode}
        />
      </View>

      {/* New Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={!showNewPassword} // Toggle visibility based on state
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowNewPassword(!showNewPassword)}
        >
          <Icon name={showNewPassword ? 'eye-slash' : 'eye'} size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Submit Button to Update Password */}
      <TouchableOpacity style={styles.submitButton} onPress={handleUpdatePassword}>
        <Text style={styles.submitButtonText}>Update Password</Text>
      </TouchableOpacity>

      {/* Link to Navigate Back to Login */}
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
    marginBottom: 10,
    color: 'black',
  },
  helperText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 20,
    textAlign: 'center',
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
    backgroundColor: '#f9f9f9',
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
  switchMode: {
    color: '#007bff',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default CreateNewPassword;
