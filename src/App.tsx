/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {type PropsWithChildren} from 'react';
//import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  AsyncStorage,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';


const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [showStarted, setShowStarted] = React.useState(false);
  const [resultsContent, setResultsContent] = React.useState("");
  const [startTime, setStartTime] = React.useState(0);

  const writeTime = (entrantId:string="unknown") => {
        const elapsed = new Date(Date.now() - startTime);
        const timeString = `${entrantId} - ${elapsed.getHours()}:${elapsed.getMinutes()}:${elapsed.getSeconds()}`;
        setResultsContent(`${resultsContent}\n${timeString}`);
    }
  const startEvent = () => {
      setStartTime(Date.now());
      setShowStarted(true);
      //NfcManager.requestTechnology(NfcTech.Ndef).then(()=> {NfcManager.getTag().then( (event)=>writeTime())};
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
          {showStarted ?
           <Button
                      onPress={() => {
                          writeTime();
                      }}
                      title="Record a finish"
                     />
           :
          <Button
            onPress={() => startEvent()}
            title="Start"
          />}

        <Text name="startTime">{startTime ? new Date(startTime).toLocaleString() : ''}</Text>
        <Text name="resultsPane">{resultsContent}</Text>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
