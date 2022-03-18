import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EditViewDetailsScreen from './EditViewDetails';
import CameraScreen from './Camera';

const Stack = createNativeStackNavigator();

function App2()
{
  return (
      <Stack.Navigator>
        <Stack.Screen name = "EditViewDetails" component={EditViewDetailsScreen} options={{headerShown:false}} />
        <Stack.Screen name = "Camera" component={CameraScreen} />
      </Stack.Navigator>
  );
}

export default App2;