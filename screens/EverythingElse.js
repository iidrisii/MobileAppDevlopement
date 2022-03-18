import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MainAppScreen from './MainApp';
import App2 from './App2';
import App3 from './App3';
//import App4 from './App4'
import ManageFriendshipsScreen from './ManageFriendships';
import Search from './Search';

const Tab = createBottomTabNavigator();

function EverythingElseScreen() 
{
  return (
      <Tab.Navigator>
        <Tab.Screen name = "Homescreen" component={MainAppScreen} />
        <Tab.Screen name = "Search" component={Search}/>
        <Tab.Screen name = "Manage Friendships" component={ManageFriendshipsScreen}/>
        <Tab.Screen name = "Friends" component={App3} />
        <Tab.Screen name = "Account" component={App2} />
      </Tab.Navigator>
  );
}

export default EverythingElseScreen;