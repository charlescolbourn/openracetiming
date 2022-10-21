/**

 */

import React from 'react';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';
import { Text, View, Button, Alert } from 'react-native';
import { DataTable } from 'react-native-paper';
import moment from 'moment';
import LocalStorage from '../lib/LocalStorage';
import Utils from '../lib/Utils';

import EntrantRecordLine from './EntrantRecordLine';

const Timing = ({ navigation }) => {
  const [showStarted, setShowStarted] = React.useState(false);
  const [startTime, setStartTime] = React.useState(0);
  const [resultsContent, setResultsContent] = React.useState('');
  const [displayButtons, setDisplayButtons] = React.useState(false);
  const [finished, setFinished] = React.useState(false);
  const [finishrows, setFinishrows] = React.useState([]);
  const [currentRace, setCurrentRace] = React.useState([]);

  const initialiseFromLocalStorage = () => {
    //need to handle case where race is finished

    LocalStorage.getStartTime(Utils.getRaceKey(currentRace))
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

  if (!currentRace) {
    LocalStorage.getCurrentRace().then((raceDetails) =>
      setCurrentRace(JSON.parse(raceDetails))
    );
  }

  const writeTime = (entrantId: string = 'unknown') => {
    const timeNow = Date.now();
    const elapsed = timeNow - startTime;
    LocalStorage.writeFinishTime(
      Utils.getRaceKey(currentRace),
      elapsed,
      entrantId
    )
      .then(() => {
        LocalStorage.getEntrant(Utils.getRaceKey(currentRace), entrantId)
          .then((entrant) => {
            let entrantObj = JSON.parse(entrant);

            const timeString = moment(elapsed).format('HH:mm:ss.S');
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

  React.useEffect(() => {
    const initNfc = async () => {
      await NfcManager.registerTagEvent();

      //   });
      //
      //   React.useEffect(() => {
      if (!showStarted) {
        initialiseFromLocalStorage();
      }
      NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: any) => {
        if (showStarted) {
          writeTime(tag.id);
        } else {
          setResultsContent('Testing NFC tag: ' + tag.id);
        }
      });
    };
    initNfc().catch((e) => Alert.alert(JSON.stringify(e)));
  });

  const startEvent = () => {
    const now = Date.now();
    setStartTime(now);
    LocalStorage.setStartTime(Utils.getRaceKey(currentRace), now);
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
    LocalStorage.clear();
    NfcManager.cancelTechnologyRequest().catch((e) =>
      Alert.alert(JSON.stringify(e))
    );
  };

  return (
    <View>
      <Text>
        {currentRace
          ? `${currentRace.raceName} ${moment(currentRace.raceDate).format(
              'DD/MM/YYYY'
            )}`
          : ''}
      </Text>
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
