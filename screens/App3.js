import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DisplayAcceptedFriendsScreen from './DisplayAcceptedFreinds';

const Stack = createNativeStackNavigator();

function App3()
{
  return (
      <Stack.Navigator>
        <Stack.Screen name = "DisplayAcceptedFriends" component={DisplayAcceptedFriendsScreen} options={{headerShown:false}} />
      </Stack.Navigator>
  );
}

export default App3;