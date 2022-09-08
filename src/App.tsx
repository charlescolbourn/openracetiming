/**

 */




import Timing from "./components/Timing";
import Identify from "./components/Identify";

import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function TimingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Timing/>
    </View>
  );
}

function IdentifyScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Identify/>
    </View>
  );
}

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Timing" component={Timing} />
        <Tab.Screen name="Identify" component={Identify} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


export default App;
