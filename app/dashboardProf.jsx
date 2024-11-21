import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert, TextInput,Button, Switch, FlatList } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

// Instructor Dashboard Component
const InstructorDashboard = () => (
  <View style={styles.container}>
    <Text style={styles.welcomeText}>Welcome to the Instructor Dashboard!</Text>
  </View>
);

// Profile Screen Component
const ProfileScreen = ({ navigation, name, email, department, professor_id }) => {
  const [editName, setEditName] = useState(name);
  const [editEmail, setEditEmail] = useState(email);
  const [editDepartment, setEditDepartment] = useState(department);
  const [isAvailable, setIsAvailable] = useState(false);

  const toggleAvailability = async () => {
    const newAvailability = !isAvailable;

    // Temporarily update UI while processing
    setIsAvailable(newAvailability);

    try {
      const apiUrl = 'https://consultationapi-production.up.railway.app/api/v1/professor/change-availability';

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          professor_id,
          availability: newAvailability,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update availability on the server.');
      }

      // If the API call is successful, save the new availability locally
      await AsyncStorage.setItem('availability', JSON.stringify(newAvailability));
      Alert.alert('Success', `Availability updated to ${newAvailability ? 'Available' : 'Unavailable'}`);
    } catch (error) {
      // Revert to the previous state if the API call fails
      console.error('Error updating availability:', error);
      setIsAvailable(!newAvailability); // Revert UI toggle state
      Alert.alert('Error', 'Failed to update availability. Please try again.');
    }
  };

  // Load saved availability state when the component mounts
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const savedAvailability = await AsyncStorage.getItem('availability');
        if (savedAvailability !== null) {
          setIsAvailable(JSON.parse(savedAvailability));
        }
      } catch (error) {
        console.error('Failed to load availability:', error);
      }
    };

    loadAvailability();
  }, []);

  const handleSave = async () => {
    try {
      const updatedProfile = {
        professor_id,
        name: editName,
        email: editEmail,
        department: editDepartment,
        availability: isAvailable,
      };

      const apiUrl = 'https://consultationapi-production.up.railway.app/api/v1/professor/update';

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        console.error('Error response:', response);
        throw new Error('Failed to update profile');
      }

      Alert.alert('Profile Updated', 'Your profile has been updated successfully.', [
        {
          text: 'OK',
          onPress: () => {
            setTimeout(() => {
              navigation.navigate('Instructor Dashboard');
            }, 200);
          },
        },
      ]);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message, [{ text: 'OK' }]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Availability Toggle Switch */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>{isAvailable ? 'Active' : 'Inactive'}</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isAvailable ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleAvailability}
          value={isAvailable}
        />
      </View>

      <Text style={styles.welcomeText}>Update Profile</Text>

      {/* Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={editName}
        onChangeText={setEditName}
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={editEmail}
        onChangeText={setEditEmail}
      />

      {/* Department Input */}
      <TextInput
        style={styles.input}
        placeholder="Department"
        value={editDepartment}
        onChangeText={setEditDepartment}
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
        <Text style={styles.submitButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

// Consultation Screen with Table
const ConsultationScreen = () => {
    const [consultations, setConsultations] = useState([]);
    const [filteredConsultations, setFilteredConsultations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    useEffect(() => {
        fetchConsultations();
    }, []);

    // Fetch professor ID from AsyncStorage
    const getProfessorId = async () => {
        try {
            const professorId = await AsyncStorage.getItem('professor_id');
            if (professorId !== null) {
                console.log('Professor ID:', professorId);
                return professorId;
            } else {
                console.log('No professor ID found');
                return null;
            }
        } catch (error) {
            console.error('Error retrieving professor_id from AsyncStorage:', error);
        }
    };

    // Fetch consultations data from API
    const fetchConsultations = async () => {
        const professor_id = await getProfessorId();
        try {
            const response = await fetch(`https://consultationapi-production.up.railway.app/api/v1/student/get-consultations?professor_id=${professor_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok && Array.isArray(data.consultations)) {
                setConsultations(data.consultations);
                setFilteredConsultations(data.consultations);
            } else {
                console.error("Error fetching consultations:", data);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    // Filter consultations based on search query
    const searchConsultation = (text) => {
        setSearchQuery(text);
        if (Array.isArray(consultations)) {
            const filtered = consultations.filter(consultation =>
                consultation.professor.prof_name.toLowerCase().includes(text.toLowerCase()) ||
                consultation.purpose.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredConsultations(filtered);
        }
    };

	// Decline Reason Modal Component
	const DeclineReasonModal = ({ visible, onCancel, onSubmit, consultationId }) => {
		const [reason, setReason] = useState('');
	
		return (
			<Modal
				transparent={true}
				visible={visible}
				//animationType="slide"
				onRequestClose={onCancel}
			>
				<View style={styles.modalBackground}>
					<View style={styles.modalContainer}>
						<Text style={styles.modalTitle}>Enter Reason</Text>
						<TextInput
							style={styles.textInput}
							placeholder="Please enter a reason for declining"
							value={reason}
							onChangeText={setReason}
						/>
						<View style={styles.buttonContainer}>
							<Button title="Cancel" onPress={onCancel} />
							<Button
								title="Submit"
								onPress={() => {
									if (reason.trim() === '') {
										Alert.alert('Error', 'Please provide a valid reason.');
									} else {
										onSubmit(consultationId, reason);
										setReason(''); // Reset input after submission
									}
								}}
							/>
						</View>
					</View>
				</View>
			</Modal>
		);
	};

    //decline consultation
	const [modalVisible, setModalVisible] = useState(false);
    const [consultationId, setConsultationId] = useState(null);

    // Handle decline reason modal visibility and state
    const declineReason = (id) => {
        setConsultationId(id); // Set the consultation id
        setModalVisible(true);  // Show the modal
    };

		
    const cancelConsultation = async (id, reason) => {
		setModalVisible(false); // Close the modal
		const professor_id = await getProfessorId();
		console.log(id);
		const apiUrl = 'https://consultationapi-production.up.railway.app/api/v1/professor/decline-consultation';
		const payload = {
			consultation_id: id,
			professor_id: professor_id,
			decline_reason: reason
			
		};

		try {
			console.log("Payload:", JSON.stringify(payload));
			const response = await fetch(apiUrl, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload)
			});
			if (response.status === 200) { // HTTP status code 200 indicates success
				Alert.alert('Success', 'Consultation declined successfully!');
				fetchConsultations(); // Ensure this function exists
			} else {
				const errorMessage = response.statusText || 'Failed to decline consultation.';
				Alert.alert('Error', errorMessage);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	//accept consultation
	const acceptConsultation = async (id) => {
		
		const professor_id = await getProfessorId(); // Assume this function retrieves the professor's ID
		console.log(id);
	
		const apiUrl = 'https://consultationapi-production.up.railway.app/api/v1/professor/confirm-consultation';
		const payload = {
			consultation_id: id,
			professor_id: professor_id
		};
	
		try {
			console.log("Payload:", JSON.stringify(payload));
			const response = await fetch(apiUrl, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json', // Specify the content type as JSON
				},
				body: JSON.stringify(payload) // Convert the payload object to a JSON string
			});
	
			if (response.status === 200) { // HTTP status code 200 indicates success
				Alert.alert('Success', 'Consultation accepted successfully!');
				fetchConsultations(); // Ensure this function exists
			} else {
				const errorMessage = response.statusText || 'Failed to accept consultation.';
				Alert.alert('Error', errorMessage);
			}
	
		} catch (error) {
			// Handle the error case here
			console.error('Error:', error);
		}
	};
	
    // Render individual consultation card
    const renderConsultationCard = ({ item }) => {
        const status = item.status ? 'Completed' : 'Pending';
        return (
            <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.student.student_name}</Text>
                <Text style={styles.cardText}>Date & Time: {item.consultation_time}</Text>
                <Text style={styles.cardText}>Purpose: {item.purpose}</Text>
                <Text style={styles.cardText}>Status: {status}</Text>
                {status === 'Pending' && (
                    <TouchableOpacity style={styles.button} onPress={() => acceptConsultation(item.id)}>
                        <Text style={styles.buttonText}>Accept</Text>
						
                    </TouchableOpacity>
                )}
				 {status === 'Pending' && (
                    <TouchableOpacity style={styles.button} onPress={() => declineReason(item.id)}>
                        <Text style={styles.buttonText}>Decline</Text>
						<DeclineReasonModal
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}  // Close the modal
                onSubmit={cancelConsultation}  // Submit the reason
                consultationId={consultationId}
            />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    // Change page for pagination
    const changePage = (direction) => {
        if (direction === 'next' && (page * rowsPerPage) < filteredConsultations.length) {
            setPage(page + 1);
        } else if (direction === 'prev' && page > 1) {
            setPage(page - 1);
        }
    };

    // Slice the filtered consultations for pagination
    const currentPageData = Array.isArray(filteredConsultations)
        ? filteredConsultations.slice((page - 1) * rowsPerPage, page * rowsPerPage)
        : [];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>View Consultations</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search consultation..."
                value={searchQuery}
                onChangeText={searchConsultation}
            />
            <FlatList
                data={currentPageData}
                renderItem={renderConsultationCard}
                keyExtractor={item => item.id.toString()}
            />
            <View style={styles.paginationControls}>
                <Button title="Previous" onPress={() => changePage('prev')} />
                <Text style={styles.pageInfo}>Page {page}</Text>
                <Button title="Next" onPress={() => changePage('next')} />
            </View>
        </View>
    );
};


// Custom Drawer Content with Logout
const CustomDrawerContent = (props) => {
 	const { navigation } = useNavigation();

	const handleLogout = () => {
		Alert.alert(
		"Log Out",
		"Are you sure you want to log out?",
		[
			{
			text: "Cancel",
			style: "cancel",
			},
			{
			text: "Log Out",
			onPress: async () => {
				try {
				await AsyncStorage.setItem('availability', JSON.stringify(false));
				} catch (error) {
				console.error('Failed to reset availability:', error);
				}

				navigation.reset({
				index: 0,
				routes: [{ name: 'Login' }],
				});
			},
			},
		],
		{ cancelable: false }
		);
	};

	return (
		<DrawerContentScrollView {...props}>
		<DrawerItemList {...props} />
		<View style={styles.logoutContainer}>
			<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
			<Text style={styles.logoutButtonText}>Log Out</Text>
			</TouchableOpacity>
		</View>
		</DrawerContentScrollView>
	);
};

// Main Dashboard Component
const DashboardProf = ({ route }) => {
  const { user } = route.params;

	return (
		<NavigationContainer independent={true}>
		<Drawer.Navigator
			initialRouteName="Instructor Dashboard"
			drawerContent={(props) => <CustomDrawerContent {...props} />}
		>
			<Drawer.Screen name="Instructor Dashboard" component={InstructorDashboard} />
			<Drawer.Screen name="Profile">
			{({ navigation }) => (
				<ProfileScreen
				navigation={navigation}
				name={user.name}
				email={user.email}
				department={user.department}
				professor_id={user.id}
				/>
			)}
			</Drawer.Screen>
			<Drawer.Screen name="Consultation" component={ConsultationScreen} />
		</Drawer.Navigator>
		</NavigationContainer>
	);
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 20,
    margin: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    width: '100%',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#276630',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: '#000',
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f1f1f1',
    marginBottom: 10,
    width: '100%',
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  logoutContainer: {
    paddingTop: 20,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  // Styles for the table header cell
  container: {
	flex: 1,
	padding: 16,
	backgroundColor: '#f5f5f5',
},
title: {
	fontSize: 24,
	fontWeight: 'bold',
	marginBottom: 16,
},
searchInput: {
	borderWidth: 1,
	borderColor: '#ccc',
	borderRadius: 8,
	padding: 8,
	marginBottom: 16,
},
card: {
	backgroundColor: '#fff',
	padding: 16,
	marginBottom: 16,
	borderRadius: 8,
	shadowColor: '#000',
	shadowOffset: { width: 0, height: 2 },
	shadowOpacity: 0.2,
	shadowRadius: 4,
	elevation: 4,
},
cardTitle: {
	fontSize: 18,
	fontWeight: 'bold',
	marginBottom: 8,
},
cardText: {
	fontSize: 14,
	marginBottom: 4,
},
button: {
	backgroundColor: '#007bff',
	paddingVertical: 8,
	paddingHorizontal: 16,
	borderRadius: 4,
	marginTop: 8,
},
buttonText: {
	color: '#fff',
	textAlign: 'center',
},
paginationControls: {
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
	marginTop: 16,
},
pageInfo: {
	fontSize: 16,
},

// Modal styles
modalBackground: {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContainer: {
	width: 300,
	padding: 20,
	backgroundColor: 'white',
	borderRadius: 10,
},
modalTitle: {
	fontSize: 18,
	marginBottom: 10,
	textAlign: 'center',
},
textInput: {
	height: 40,
	borderColor: 'gray',
	borderWidth: 1,
	marginBottom: 20,
	paddingLeft: 10,
},
buttonContainer: {
	flexDirection: 'row',
	justifyContent: 'space-around',
},
});

export default DashboardProf;
