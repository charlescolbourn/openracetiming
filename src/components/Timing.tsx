/**

 */

import React, {type PropsWithChildren} from 'react';
import NfcManager, {NfcTech, NfcEvents,Ndef} from 'react-native-nfc-manager';
import {
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  AsyncStorage,
  Alert,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const Timing = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [showStarted, setShowStarted] = React.useState(false);
  const [startTime, setStartTime] = React.useState(0);
  const [resultsContent, setResultsContent] = React.useState("");

  const initialiseFromLocalStorage = () => {
    getStartTimeLocalStorage().then( (timestamp: string|null) => {
    if (timestamp) setStartTime(parseInt(timestamp));
    if (startTime) {
     setShowStarted(true);
    }
    }).catch( (e) => Alert.alert(e));
  }


  const setStartTimeLocalStorage = (timestamp:number) => {
    return AsyncStorage.setItem('@ORT_starttimes:default',`${timestamp}`);
  }
  const removeStartTimeLocalStorage = () => {
    return AsyncStorage.removeItem('@ORT_starttimes:default');
  }
  const getStartTimeLocalStorage = () => {
    return AsyncStorage.getItem('@ORT_starttimes:default');
  }

  const writeFinishTimeLocalStorage = (timestamp:number, id: string) => {
    return AsyncStorage.setItem(`@ORT_finishtimes:${id}`,`${timestamp}`);
  }

  const displayResultsFromLocalContent = () => {
    AsyncStorage.getAllKeys().then( (arrayOfKeys) => {
      arrayOfKeys.forEach( (key) => {
        if (key.startsWith('@ORT_finishtimes')) {
          const id = key.substring(17, key.length);
          const time = AsyncStorage.getItem(key).then( (item) => {
            if (!item) throw 'Stored finish time is null';
            const elapsed = new Date(item);
            const timeString = `${elapsed.getHours()}:${elapsed.getMinutes()}:${elapsed.getSeconds()}`;
            setResultsContent(resultsContent + "\n" + id + " - " + timeString);
            }).catch( (e) => Alert.alert(e));
        }
      });
    });
  }

  const writeTime = (entrantId:string="unknown") => {
        const timeNow = Date.now();
        //getStartTimeLocalStorage().then( (startTime) => {
          const elapsed = new Date(timeNow - startTime);
          writeFinishTimeLocalStorage(elapsed.getTime(),entrantId).then( () => {
            const timeString = `${elapsed.getHours()}:${elapsed.getMinutes()}:${elapsed.getSeconds()}`;
            setResultsContent(`${resultsContent}\n${entrantId} - ${timeString}`);
            }).catch( (e) => Alert.alert(e));
          //}).catch( (e) => Alert.alert(e));
    }


  React.useEffect( () => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag:any) => {
        if (showStarted) {
          writeTime(tag.id);

        }
        else {
            setResultsContent("Testing NFC tag: " + tag.id);
        }
    });
  });

  const startEvent = () => {
      const now = Date.now();
      setStartTime(now);
      setStartTimeLocalStorage(now);
      setShowStarted(true);
  }

  const finishRace = () => {
    setShowStarted(false);
    setStartTime(0);
    setStartTimeLocalStorage(0);
    NfcManager.cancelTechnologyRequest().catch((e)=>Alert.alert(e));
    displayResultsFromLocalContent();
  }



  const resetSession = () => {
    setShowStarted(false);
    setResultsContent("");
    setStartTime(0);
    AsyncStorage.clear();
    NfcManager.cancelTechnologyRequest().catch((e)=>Alert.alert(e));
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  React.useEffect( ()=> {

    const initNfc = async () => { await NfcManager.registerTagEvent()};
    initNfc().catch( (e) => Alert.alert(e));
  });

  if (!showStarted) {initialiseFromLocalStorage();}
  return (<View>
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

        <Text>{startTime ? new Date(startTime).toLocaleString() : ''}</Text>
        <Text>{resultsContent}</Text>
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
        </View>
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

export default Timing;
