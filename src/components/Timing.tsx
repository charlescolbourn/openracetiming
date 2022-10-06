/**

 */

import React from 'react';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';
import { Text, View, Button, Alert } from 'react-native';
import { DataTable } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';

import EntrantRecordLine from './EntrantRecordLine';

const Timing = ({ navigation }) => {
  const [showStarted, setShowStarted] = React.useState(false);
  const [startTime, setStartTime] = React.useState(0);
  const [resultsContent, setResultsContent] = React.useState('');
  const [displayButtons, setDisplayButtons] = React.useState(false);
  const [finished, setFinished] = React.useState(false);
  const [finishrows, setFinishrows] = React.useState('');

  const initialiseFromLocalStorage = () => {
    //need to handle case where race is finished
    getStartTimeLocalStorage()
      .then((timestamp: string | null) => {
        if (timestamp) {
          setStartTime(parseInt(timestamp));
          if (!finished) {
            setShowStarted(true);
            setDisplayButtons(true);
          }
        }
      })
      .catch((e) => Alert.alert(JSON.stringify(e)));
  };

  const setStartTimeLocalStorage = (timestamp: number) => {
    return AsyncStorage.setItem('@ORT_starttimes:default', `${timestamp}`);
  };
  //   const removeStartTimeLocalStorage = () => {
  //     return AsyncStorage.removeItem('@ORT_starttimes:default');
  //   }
  const getStartTimeLocalStorage = () => {
    return AsyncStorage.getItem('@ORT_starttimes:default');
  };

  const writeFinishTimeLocalStorage = (timestamp: number, id: string) => {
    return AsyncStorage.setItem(`@ORT_finishtimes:${id}`, `${timestamp}`);
  };

  // 	const displayResultsFromLocalContent = () => {
  // 		AsyncStorage.getAllKeys().then((arrayOfKeys) => {
  // 			arrayOfKeys.forEach((key) => {
  // 				if (key.startsWith('@ORT_finishtimes')) {
  // 					const id = key.substring(17, key.length);
  // 					AsyncStorage.getItem(key)
  // 						.then((item) => {
  // 							if (!item) {
  // 								throw 'Stored finish time is null';
  // 							}
  // 							const elapsed = new Date(item);
  // 							const timeString = `${elapsed.getHours()}:${elapsed.getMinutes()}:${elapsed.getSeconds()}`;
  // 							setResultsContent(
  // 								resultsContent + '\n' + id + ' - ' + timeString
  // 							);
  // 						})
  // 						.catch((e) => Alert.alert(JSON.stringify(e)));
  // 				}
  // 			});
  // 		});
  // 	};

  const writeTime = (entrantId: string = 'unknown') => {
    const timeNow = Date.now();
    const elapsed = new Date(timeNow - startTime);

    writeFinishTimeLocalStorage(elapsed.getTime(), entrantId)
      .then(() => {
        getEntrantFromLocalStorage(entrantId)
          .then((entrant) => {
            let entrantObj = JSON.parse(entrant);

            const timeString = `${elapsed.getHours()}:${elapsed.getMinutes()}:${elapsed.getSeconds()}`;
            entrantObj.finishtime = timeString;
            const newFinishrows = [
              ...finishrows,
              <EntrantRecordLine
                record={entrantObj}
                fieldsToDisplay={[
                  ...Object.keys(entrantObj).slice(0, 2),
                  'finishtime',
                ]}
              />,
            ];
            setFinishrows(newFinishrows);
          })
          .catch((e) => setResultsContent(JSON.stringify(e.message)));
      })

      .catch((e) => Alert.alert(JSON.stringify(e)));
  };

  const getEntrantFromLocalStorage = (entrantId) => {
    return AsyncStorage.getItem(`@ORT_registeredEntrants:${entrantId}`);
  };

  React.useEffect(() => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: any) => {
      if (showStarted) {
        writeTime(tag.id);
      } else {
        setResultsContent('Testing NFC tag: ' + tag.id);
      }
    });
  });

  const startEvent = () => {
    const now = Date.now();
    setStartTime(now);
    setStartTimeLocalStorage(now);
    setShowStarted(true);
    setDisplayButtons(true);
  };

  const finishRace = () => {
    setShowStarted(false);
    NfcManager.cancelTechnologyRequest().catch((e) =>
      Alert.alert(JSON.stringify(e))
    );
    //displayResultsFromLocalContent();

    setDisplayButtons(false);
    setFinished(true);
    setShowStarted(false);
    navigation.jumpTo('Identify');
  };

  const resetSession = () => {
    setShowStarted(false);
    //     setResultsContent('');
    setFinishrows([]);
    setStartTime(0);
    AsyncStorage.clear();
    NfcManager.cancelTechnologyRequest().catch((e) =>
      Alert.alert(JSON.stringify(e))
    );
  };

  //   const backgroundStyle = {
  //     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  //   };

  React.useEffect(() => {
    const initNfc = async () => {
      await NfcManager.registerTagEvent();
    };
    initNfc().catch((e) => Alert.alert(JSON.stringify(e)));
  });

  if (!showStarted) {
    initialiseFromLocalStorage();
  }
  return (
    <View>
      {showStarted ? (
        <Button
          onPress={() => {
            writeTime();
          }}
          title="Record a finish"
          disabled={showStarted}
        />
      ) : (
        <Button onPress={() => startEvent()} title="Start" />
      )}

      <Text>{startTime ? new Date(startTime).toLocaleString() : ''}</Text>
      <View>
        <DataTable>{finishrows}</DataTable>
      </View>
      <Text>{resultsContent}</Text>
      <Button
        onPress={() => {
          resetSession();
        }}
        title="Reset"
        // 				disabled={displayButtons} reenable when finish is handled better
      />
      <Button
        onPress={() => {
          finishRace();
        }}
        disabled={!displayButtons}
        title="Finish"
      />
    </View>
  );
};

export default Timing;
