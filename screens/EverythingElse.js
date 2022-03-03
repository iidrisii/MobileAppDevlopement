import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MainAppScreen from './MainApp';
import EditViewDetailsScreen from './EditViewDetails';

const Tab = createBottomTabNavigator();

function EverythingElseScreen() 
{
  return (
      <Tab.Navigator>
        <Tab.Screen name = "MainApp" component={MainAppScreen} />
        <Tab.Screen name = "EditViewDetails" component={EditViewDetailsScreen} />
      </Tab.Navigator>
  );
}

export default EverythingElseScreen;