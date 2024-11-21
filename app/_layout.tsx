import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginForm from '../app/login';
import authprof from '../app/authprof';
import forgot from '../app/forgot';
import newpass from '../app/newpass';
import dashboardProf from '../app/dashboardProf'; 


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator >
        <Stack.Screen 
          name="Login" 
          component={LoginForm} 
          options={{headerShown:false}}
         
        />
        <Stack.Screen 
          name="Instructor" 
          component={authprof} 
          options={{headerShown:false}}
        />
        <Stack.Screen 
          name="Forgot" 
          component={forgot} 
          options={{headerShown:false}}
        />
        <Stack.Screen 
          name="DashboardProf" 
          component={dashboardProf} 
          options={{headerShown:false}}
        />
        <Stack.Screen 
          name="New Password" 
          component={newpass} 
          options={{headerShown:false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
