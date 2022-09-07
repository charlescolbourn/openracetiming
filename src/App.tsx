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

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [showStarted, setShowStarted] = React.useState(false);
  const [startTime, setStartTime] = React.useState(0);
  const [resultsContent, setResultsContent] = React.useState("");
//   let showStarted = false;
//   let startTime = 0;
//   let resultsContent = "";



  const initialiseFromLocalStorage = () => {
    getStartTimeLocalStorage().then( (timestamp: string) => {
    setStartTime(parseInt(timestamp));
    if (startTime) {
     setShowStarted(true);
     //loadResultsFromLocalStorage();
    }
    }).catch( (e) => alert(e));
  }


  const setStartTimeLocalStorage = (timestamp:double) => {
    return AsyncStorage.setItem('@ORT_starttimes:default',`${timestamp}`);
  }
  const removeStartTimeLocalStorage = () => {
    return AsyncStorage.removeItem('@ORT_starttimes:default');
  }
  const getStartTimeLocalStorage = () => {
    return AsyncStorage.getItem('@ORT_starttimes:default');
  }

  const writeFinishTimeLocalStorage = (timestamp:string, id: string) => {
    return AsyncStorage.setItem(`@ORT_finishtimes:${id}`,`${timestamp}`);
  }

  const displayResultsFromLocalContent = () => {
    AsyncStorage.getAllKeys().then( (arrayOfKeys) => {
      arrayOfKeys.forEach( (key) => {
        if (key.startsWith('@ORT_finishtimes')) {
          const id = key.substring(17, key.length);
          const time = AsyncStorage.getItem(key).then( (item) => {
            const elapsed = new Date(item);
            const timeString = `${elapsed.getHours()}:${elapsed.getMinutes()}:${elapsed.getSeconds()}`;
            setResultsContent(resultsContent + "\n" + id + " - " + timeString);
            }).catch( (e) => alert(e));
        }
      });

    });
  }

  const writeTime = (entrantId:string="unknown") => {
//   alert(resultsContent);
        const timeNow = Date.now();
        entrantId = entrantId + timeNow;
        getStartTimeLocalStorage().then( (startTime) => {
          const elapsed = new Date(timeNow - startTime);
          writeFinishTimeLocalStorage(elapsed.getTime(),entrantId).then( () => {
            const timeString = `${elapsed.getHours()}:${elapsed.getMinutes()}:${elapsed.getSeconds()}`;
            setResultsContent(`${resultsContent}\n${entrantId} - ${timeString}`);
            //displayResultsFromLocalContent();
            }).catch( (e) => alert(e));
          }).catch( (e) => alert(e));
        //});
    }



  const readTag = () => {
    NfcManager.requestTechnology(NfcTech.Ndef).then ( () => {
            NfcManager.getTag().then( (event) => {
              writeTime(event.id);
              NfcManager.cancelTechnologyRequest().then ( () => {readTag()});

          }).catch( (e) => alert(e));
          }).catch( (e) => alert(e));
  }

  const startEvent = () => {
      const now = Date.now();
      setStartTime(now);
      setStartTimeLocalStorage(now);
      setShowStarted(true);
      readTag();


  }

  const finishRace = () => {
    setShowStarted(false);
    setStartTime(0);
    setStartTimeLocalStorage(0);
    NfcManager.cancelTechnologyRequest().catch((e)=>alert(e));
     displayResultsFromLocalContent();
//setResultsContent("");
  }



  const resetSession = () => {
    setShowStarted(false);
    setResultsContent("");
    setStartTime(0);
//     removeStartTimeLocalStorage();
//     removeFinishTimesLocalStorage();
    AsyncStorage.clear();
//     tempRemoveResultContentLocalStorage();
    NfcManager.cancelTechnologyRequest().catch((e)=>alert(e));
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


//   NfcManager.start();


//     NfcManager.requestTechnology(NfcTech.Ndef).catch ( (e) => alert(e));

  React.useEffect( ()=> {
    const initNfc = async () => { await NfcManager.registerTagEvent()};
    initNfc().catch( (e) => alert(e));
  });

  if (!showStarted) {initialiseFromLocalStorage();}
// initialiseFromLocalStorage();
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
//                       disabled={buttonsDisabled}
                     />
           :
          <Button
            onPress={() => startEvent()}
            title="Start"
//             disabled={buttonsDisabled}
          />}

        <Text name="startTime">{startTime ? new Date(startTime).toLocaleString() : ''}</Text>
        <Text name="resultsPane">{resultsContent}</Text>
        <Button
                      onPress={() => {
                          resetSession();
                      }}
                      title="Reset"
                     />
        <Button
                      onPress={() => {
                          finishRace();
                      }}
                      title="Finish"
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
