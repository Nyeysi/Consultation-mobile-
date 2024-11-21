import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

// Drawer Navigator
const Drawer = createDrawerNavigator();

const StudentDashboard = () => (
    <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome to the Student Dashboard!</Text>
    </View>
);

const Appointment = () => {
    const [student, setStudentName] = useState('');
    const [email, setInstructor] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [reason, setReason] = useState('');
    const [status, setStatus] = useState('');

    const handleAppointment = async () => {
        try {
            const response = await fetch('http://192.168.0.103:5003/setAppointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    student,
                    email,
                    date,
                    time,
                    reason,
                    status,
                }),
            });
            const result = await response.json();
            if (response.status === 200) {
                setStatus("Your appointment has been scheduled successfully.");
            } else {
                setStatus(result.message || "There was an error scheduling your appointment. Please try again.");
            }
        } catch (error) {
            setStatus("There was an error scheduling your appointment. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionHeader}>Appointment Management</Text>
            <TextInput
                style={styles.input}
                placeholder="Student Name"
                value={student}
                onChangeText={setStudentName}
            />
            <TextInput
                style={styles.input}
                placeholder="Instructor Email"
                value={email}
                onChangeText={setInstructor}
            />
            <TextInput
                style={styles.input}
                placeholder="Date (YYYY-MM-DD)"
                value={date}
                onChangeText={setDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Time (HH:MM)"
                value={time}
                onChangeText={setTime}
            />
            <TextInput
                style={styles.input}
                placeholder="Reason"
                value={reason}
                onChangeText={setReason}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleAppointment}>
                <Text style={styles.submitButtonText}>Schedule Appointment</Text>
            </TouchableOpacity>
            {status ? <Text style={styles.statusText}>{status}</Text> : null}
        </View>
    );
};

const Attendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    useEffect(() => {
        const fetchAttendanceRecords = async () => {
            try {
                const response = await fetch('https://your-api-endpoint.com/attendance');
                const data = await response.json();
                setAttendanceRecords(data);
            } catch (error) {
                console.error("Error fetching attendance records:", error);
            }
        };

        fetchAttendanceRecords();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.sectionHeader}>Attendance Management</Text>
            {attendanceRecords.length > 0 ? (
                attendanceRecords.map((record, index) => (
                    <Text key={index}>{record.date}: {record.status}</Text>
                ))
            ) : (
                <Text>No attendance records found.</Text>
            )}
        </View>
    );
};

const ProfileScreen = ({ navigation, name, onProfileUpdate }) => {
    const [editName, setEditName] = useState(name);

    const handleSave = () => {
        onProfileUpdate(editName);
        Alert.alert("Profile Updated", "Your profile has been updated successfully.", [
            {
                text: "OK",
                onPress: () => navigation.navigate('Home'),
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionHeader}>Profile</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={editName}
                onChangeText={setEditName}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
                <Text style={styles.submitButtonText}>Save Profile</Text>
            </TouchableOpacity>
        </View>
    );
};

// Custom Drawer Content to include Logout button
const CustomDrawerContent = (props) => {
    const { onLogout, navigation } = props;

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <View style={styles.logoutContainer}>
                <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
};

const DashboardStudent = ({ name, onProfileUpdate }) => {
    const handleLogout = (navigation) => {
        // Perform any logout logic if needed
        navigation.navigate('Login'); // Navigate to the Login screen
    };

    return (
        <NavigationContainer independent={true}>
            <Drawer.Navigator
                initialRouteName="Student Dashboard"
                drawerContent={(props) => <CustomDrawerContent {...props} onLogout={() => handleLogout(props.navigation)} />}
            >
                <Drawer.Screen name="Student Dashboard" component={StudentDashboard} />
                <Drawer.Screen name="Appointment" component={Appointment} />
                <Drawer.Screen name="Attendance" component={Attendance} />
                <Drawer.Screen name="Profile">
                    {({ navigation }) => (
                        <ProfileScreen
                            navigation={navigation}
                            name={name}
                            onProfileUpdate={onProfileUpdate}
                        />
                    )}
                </Drawer.Screen>
            </Drawer.Navigator>
        </NavigationContainer>
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
    sectionHeader: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    welcomeText: {
        fontSize: 20,
        margin: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: '100%',
    },
    submitButton: {
        backgroundColor: '#276630',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    statusText: {
        marginTop: 20,
        fontSize: 16,
        color: 'green',
        textAlign: 'center',
    },
    logoutContainer: {
        marginTop: 550, // Adjust as needed
        paddingHorizontal: 20,
        borderColor: '#ccc',
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default DashboardStudent;