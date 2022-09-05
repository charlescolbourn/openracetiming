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
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
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

// async function readNdef() {
//     try {
//       // register for the NFC tag with NDEF in it
//       await NfcManager.requestTechnology(NfcTech.Ndef);
//       // the resolved tag object will contain `ndefMessage` property
//       const tag = await NfcManager.getTag();
//       console.warn('Tag found', tag);
//     } catch (ex) {
//       console.warn('Oops!', ex);
//     } finally {
//       // stop the nfc scanning
//       NfcManager.cancelTechnologyRequest();
//     }




const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [showStarted, setShowStarted] = React.useState(false);
  const [startTime, setStartTime] = React.useState(0);
  const [resultsContent, setResultsContent] = React.useState("");
  let buttonsDisabled=true;

  const initialiseFromLocalStorage = () => {
    AsyncStorage.getItem('@ORT_starttimes:default').then( (timestamp: string) => {
    setStartTime(parseInt(timestamp));
    if (startTime) { setShowStarted(true); }
    });
  }

  const setStartTimeLocalStorage = (timestamp:double) => {
    AsyncStorage.setItem('@ORT_starttimes:default',`${timestamp}`).catch( (e) => alert(e));;
  }
  const removeStartTimeLocalStorage = () => {
    AsyncStorage.removeItem('@ORT_starttimes:default');
  }
  const getStartTimeLocalStorage = () => {
    const timePromise = AsyncStorage.getItem('@ORT_starttimes:default').catch( (e) => alert(e));
    return parseInt(timePromise);
  }
  const writeTime = (entrantId:string="unknown") => {
        const elapsed = new Date(Date.now() - startTime);
        const timeString = `${entrantId} - ${elapsed.getHours()}:${elapsed.getMinutes()}:${elapsed.getSeconds()}`;
        setResultsContent(`${resultsContent}\n${timeString}`);
    }
  const startEvent = () => {
      setStartTimeLocalStorage(Date.now());
      setShowStarted(true);
      //NfcManager.start();

        NfcManager.requestTechnology(NfcTech.Ndef).then( ()=> {
        NfcManager.getTag().then( (event) => {
          writeTime(event.id);
      }).catch( (e) => alert(e));
     }).catch( (e) => alert(e));
  }

  const resetSession = () => {
    setShowStarted(false);
    setResultsContent("");
    setStartTime(0);
    removeStartTimeLocalStorage();
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  initialiseFromLocalStorage();
  NfcManager.registerTagEvent().then( () => { () => buttonsDisabled=false }).catch( (e) alert(e));
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
                      disabled=buttonsDisabled
                     />
           :
          <Button
            onPress={() => startEvent()}
            title="Start"
            disabled=buttonsDisabled
          />}

        <Text name="startTime">{startTime ? new Date(startTime).toLocaleString() : ''}</Text>
        <Text name="resultsPane">{resultsContent}</Text>
        <Button
                      onPress={() => {
                          resetSession();
                      }}
                      title="Reset"
                     />
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
