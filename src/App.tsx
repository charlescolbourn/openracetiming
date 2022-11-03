/**

 */

import Settings from './components/Settings';
import Timing from './components/Timing';
import Results from './components/Results';
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
function ResultsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Results />
    </View>
  );
}

//eslint-disable-next-line
function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Settings />
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
    <>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{
              headerStyle: { height: 80 },
              headerTitle: (props) => <LogoTitle {...props} />,
              //                       headerRight: () => (
              //                         <Button
              //                           onPress={() => setShowSettingsModal(true)}
              //                           title="Info"
              //                           color="#fff"
              //                         />
              //                       ),
            }}
          />
          <Tab.Screen
            name="Registration"
            component={Registration}
            options={{
              headerStyle: { height: 80 },
              headerTitle: (props) => <LogoTitle {...props} />,
              //               headerRight: () => (
              //                 <Button
              //                   onPress={() => setShowSettingsModal(true)}
              //                   title="Info"
              //                   color="#fff"
              //                 />
              //               ),
            }}
          />
          <Tab.Screen
            name="Timing"
            component={Timing}
            options={{
              headerStyle: { height: 80 },
              headerTitle: (props) => <LogoTitle {...props} />,
              //               headerRight: () => (
              //                 <Button
              //                   onPress={() => setShowSettingsModal(true)}
              //                   title="Info"
              //                   color="#fff"
              //                 />
              //               ),
            }}
          />
          <Tab.Screen
            name="Results"
            component={Results}
            options={{
              headerStyle: { height: 80 },
              headerTitle: (props) => <LogoTitle {...props} />,
              //               headerRight: () => (
              //                 <Button
              //                   onPress={() => setShowSettingsModal(true)}
              //                   title="Info"
              //                   color="#fff"
              //                 />
              //               ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      {/*       <Modal */}
      {/*         animationType="slide" */}
      {/*         transparent={false} */}
      {/*         visible={showSettingsModal} */}
      {/*         onRequestClose={() => { */}
      {/*           setShowSettingsModal(!showSettingsModal); */}
      {/*         }} */}
      {/*       > */}
      {/*         <Settings /> */}
      {/*       </Modal> */}
    </>
  );
};

export default App;
