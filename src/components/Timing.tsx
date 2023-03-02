/**

 */

import React from 'react';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';
import {
  Text,
  View,
  Button,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { DataTable } from 'react-native-paper';
import moment from 'moment';
import LocalStorage from '../lib/LocalStorage';
import Utils from '../lib/Utils';
import styles from '../style/Styles';
import CurrentRaceView from './CurrentRaceView';
import { useFocusEffect } from '@react-navigation/native';

import EntrantRecordLine from './EntrantRecordLine';
// import CurrentRaceView from './CurrentRaceView';

const Timing = () => {
  const [showStarted, setShowStarted] = React.useState(false);
  const [startTime, setStartTime] = React.useState(0);
  const [resultsContent, setResultsContent] = React.useState('');
  const [finishrows, setFinishrows] = React.useState([]);
  const [currentRace, setCurrentRace] = React.useState({});
  const [debugContent, setDebugContent] = React.useState('');
  const [finished, setFinished] = React.useState(false);
  const [selectedFinisher, setSelectedFinisher] = React.useState({});

  const initialiseFromLocalStorage = () => {
    LocalStorage.getStartTime(Utils.getRaceKey(currentRace))
      .then((timestamp: string | null) => {
        if (timestamp) {
          setStartTime(parseInt(timestamp));
          if (!finished) {
            setShowStarted(true);
          }
        }
      })
      .catch((e) => setDebugContent(JSON.stringify(e)));
  };

  useFocusEffect(() => {
    if (!currentRace || Object.keys(currentRace).length === 0) {
      LocalStorage.getCurrentRace().then((raceDetails) => {
        if (raceDetails) {
          setCurrentRace(JSON.parse(raceDetails));
        }
      });
    }
  });

  const selectRecord = (index, entrantObj) => {
    setSelectedFinisher(entrantObj);
  };

  const getEntrantLine = (index, entrantObj) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          selectRecord(index, entrantObj);
        }}
      >
        <EntrantRecordLine
          record={entrantObj}
          fieldsToDisplay={[
            ...Object.keys(entrantObj).slice(0, 2),
            'finishtime',
          ]}
        />
      </TouchableOpacity>
    );
  };

  //TODO refactor this out of the component
  const writeTime = (entrantId: string = 'unknown') => {
    const timeNow = Date.now();
    const elapsed = timeNow - startTime;
    const position = finishrows.length + 1;
    LocalStorage.writeFinishTime(
      Utils.getRaceKey(currentRace),
      elapsed,
      entrantId
    )
      .then(() => {
        LocalStorage.getEntrant(Utils.getRaceKey(currentRace), entrantId)
          .then((entrant) => {
            let entrantObj = JSON.parse(entrant);
            entrantObj = entrantObj ? entrantObj : { name: 'unknown' };

            const timeString = moment(elapsed).format('HH:mm:ss.SSS');
            entrantObj.position = position;
            entrantObj.finishtime = timeString;

            console.log(entrantObj);
            const newFinishrows = [
              ...finishrows,
              getEntrantLine(finishrows.length, entrantObj),
            ];
            setFinishrows(newFinishrows);
          })
          .catch((e) => setDebugContent(JSON.stringify(e.message)));
      })

      .catch((e) => setDebugContent(JSON.stringify(e.message)));
  };

  const updateTimeWithIdentity = (id) => {
    LocalStorage.updateFinishTimeWithId(
      Utils.getRaceKey(currentRace),
      id,
      selectedFinisher.position - 1
    );
    updateFinishLineEntryWithId(id);
    setSelectedFinisher({});
  };

  const updateFinishLineEntryWithId = (id) => {
    LocalStorage.getEntrant(Utils.getRaceKey(currentRace), id)
      .then((entrant) => {
        let entrantObj = JSON.parse(entrant);
        entrantObj = entrantObj ? entrantObj : selectedFinisher;
        entrantObj.name = entrantObj.id ? entrantObj.name : id;
        const newFinishrows = [...finishrows];
        const index = selectedFinisher.position - 1;
        newFinishrows[index] = getEntrantLine(index, entrantObj);
        console.log(newFinishrows[index]);
        setFinishrows(newFinishrows);
      })
      .catch((e) => console.log(e.message));
  };

  React.useEffect(() => {
    const initNfc = async () => {
      await NfcManager.registerTagEvent();
      if (!showStarted) {
        initialiseFromLocalStorage();
      }
      NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: any) => {
        if (showStarted) {
          Object.keys(selectedFinisher).length > 0
            ? updateTimeWithIdentity(tag.id)
            : writeTime(tag.id);
        } else {
          setResultsContent('Testing NFC tag: ' + tag.id);
        }
      });
    };
    initNfc().catch((e) => setDebugContent(e.message));
  });

  const startEvent = () => {
    const now = Date.now();
    setStartTime(now);
    LocalStorage.setStartTime(Utils.getRaceKey(currentRace), now);
    setShowStarted(true);
  };

  const finishRace = () => {
    setShowStarted(false);
    NfcManager.cancelTechnologyRequest().catch((e) =>
      Alert.alert(JSON.stringify(e))
    );

    setFinished(true);
    setShowStarted(false);
  };

  return (
    <View>
      <CurrentRaceView raceDetails={currentRace} />
      {showStarted ? (
        <Button
          color={styles.button.color}
          onPress={() => {
            writeTime();
          }}
          title="Record a finish"
        />
      ) : (
        <Button
          color={styles.button.color}
          onPress={() => startEvent()}
          title="Start"
        />
      )}

      <Text>{startTime ? new Date(startTime).toLocaleString() : ''}</Text>
      <ScrollView>
        <DataTable>{finishrows}</DataTable>
      </ScrollView>
      <Text>{debugContent}</Text>
      <Text>{resultsContent}</Text>

      {Object.keys(selectedFinisher).length > 0 ? (
        <View style={styles.RegisterEntryBox}>
          <Text style={styles.RegisterEntryBox}>Enter ID or present chip</Text>
          <TextInput
            style={styles.RegisterEntryBox.TextInput}
            keyboardType="numeric"
            onSubmitEditing={(event) =>
              updateTimeWithIdentity(event.nativeEvent.text)
            }
          />
        </View>
      ) : (
        ''
      )}

      <Button
        color={styles.button.color}
        onPress={() => {
          finishRace();
        }}
        disabled={!showStarted}
        title="Finish"
      />
    </View>
  );
};

export default Timing;
