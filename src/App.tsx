/**

 */

import Timing from './components/Timing';
import Identify from './components/Identify';
import Registration from './components/Registration';

import * as React from 'react';
import { View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//eslint-disable-next-line
function RegistrationScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Registration />
    </View>
  );
}

//eslint-disable-next-line
function TimingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Timing />
    </View>
  );
}

//eslint-disable-next-line
function IdentifyScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Identify />
    </View>
  );
}

function LogoTitle() {
  return (
    <Image
      style={{ width: 200, height: 80 }}
      source={require('./ORT_Header.png')}
    />
  );
}

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Registration"
          component={Registration}
          options={{
            headerStyle: { height: 80 },
            headerTitle: (props) => <LogoTitle {...props} />,
          }}
        />
        <Tab.Screen
          name="Timing"
          component={Timing}
          options={{
            headerStyle: { height: 80 },
            headerTitle: (props) => <LogoTitle {...props} />,
          }}
        />
        <Tab.Screen
          name="Identify"
          component={Identify}
          options={{
            headerStyle: { height: 80 },
            headerTitle: (props) => <LogoTitle {...props} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
