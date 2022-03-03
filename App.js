import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EverythingElseScreen from './screens/EverythingElse';
import LoginScreen from './screens/Login';
import SignupScreen from './screens/Signup';
import MainAppScreen from './screens/MainApp';

const Stack = createNativeStackNavigator();

function App() 
{
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name = "Login" component={LoginScreen} />
        <Stack.Screen name = "Signup" component={SignupScreen} />
        <Stack.Screen name = "EverythingElse" component={EverythingElseScreen}/>
        <Stack.Screen name = "MainApp" component={MainAppScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;