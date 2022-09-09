/**

 */

import Timing from './components/Timing';
import Identify from './components/Identify';
import Registration from './components/Registration';

import * as React from 'react';
import { View } from 'react-native';
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

const Tab = createBottomTabNavigator();

const App = () => {
	return (
		<NavigationContainer>
			<Tab.Navigator>
				<Tab.Screen name="Registration" component={Registration} />
				<Tab.Screen name="Timing" component={Timing} />
				<Tab.Screen name="Identify" component={Identify} />
			</Tab.Navigator>
		</NavigationContainer>
	);
};

export default App;
