import * as React from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { DataTable } from 'react-native-paper';
import { readString } from 'react-native-csv';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';
import LocalStorage from '../lib/LocalStorage';
import Utils from '../lib/Utils';
import EntrantRecordLine from './EntrantRecordLine';
import styles from '../style/Styles';
import CurrentRaceView from './CurrentRaceView';
import { useFocusEffect } from '@react-navigation/native';

const Registration = () => {
  const [records, setRecords] = React.useState([]);
  //   const [allEntriesData, setAllEntriesData] = React.useState([]);
  const [entryData, setEntryData] = React.useState([]);
  const [currentlySelectedIndex, setCurrentlySelectedIndex] = React.useState(0);
  const [addOrEdit, setAddOrEdit] = React.useState(false);
  const [displaySaveButton, setDisplaySaveButton] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState('');
  const defaultEntryFields = ['Firstname', 'Lastname', 'Club', 'Category'];
  //   const [raceNumber, setRaceNumber] = React.useState('');
  const [nfcRegistered, setNfcRegistered] = React.useState(false);
  const [currentRace, setCurrentRace] = React.useState({});
  const [debug, setDebug] = React.useState('');
  //   const [tableContent, setTableContent] = React.useState('');

  const parseCSV = (data) => {
    const results = readString(data, { header: true, skipEmptyLines: true });
    return results.data; //handle errors
  };

  const headerLine = (keys) => {
    return (
      <DataTable.Header>
        {keys.map((field) => {
          return <DataTable.Title key={field}>{field}</DataTable.Title>;
        })}
        {/*         <DataTable.Title key='rn'>Race Number</DataTable.Title> */}
        {/*<DataTable.Title key="tag">Registered eTag</DataTable.Title>*/}
      </DataTable.Header>
    );
  };

  const selectRecord = (record) => {
    setNfcRegistered(record.nfcId);
    setEntryData(record);
    setAddOrEdit(true);
    setDisplaySaveButton(true);
  };

  const keyFromObject = (obj) => {
    return obj[Object.keys(obj)[0]] + obj[Object.keys(obj)[1]];
  };

  const rowsLine = (index, entrantRecord) => {
    return (
      <TouchableOpacity
        key={keyFromObject(entrantRecord)}
        onPress={() => {
          setCurrentlySelectedIndex(index);
          selectRecord(entrantRecord);
        }}
      >
        <EntrantRecordLine record={entrantRecord} />
      </TouchableOpacity>
    );
  };

  const updateTextField = (key, text) => {
    setEntryData({ ...entryData, key: entryData[key] + text });
  };

  const entryForm = (key, value) => {
    return (
      <TextInput
        key={key}
        editable={false}
        placeholder={key}
        value={value}
        onChangeText={(changedText) => updateTextField(key, changedText)}
      />
    );
  };

  React.useEffect(() => {
    const initNfc = async () => {
      await NfcManager.registerTagEvent();
    };
    initNfc().catch((e) => Alert.alert(JSON.stringify(e)));
  });

  useFocusEffect(() => {
    if (!currentRace || Object.keys(currentRace).length === 0) {
      LocalStorage.getCurrentRace().then((raceDetails) => {
        console.log(raceDetails);
        if (raceDetails) {
          setCurrentRace(JSON.parse(raceDetails));
          populateExistingEntryList(JSON.parse(raceDetails));
        }
      });
    }
    //     if (records && !tableContent) {
    //     console.log({records: records});
    //       populateEntryTable(records);
    //     }
  });
  // consistently populates the table on the SECOND load of the csv file. So something somewhere in state is broken

  const populateExistingEntryList = (raceDetails) => {
    LocalStorage.getAllEntrants(Utils.getRaceKey(raceDetails))
      .then((entrants) => {
        const parsedEntrants = entrants
          .filter((entrant) => entrant)
          .map((entrant) => JSON.parse(entrant));
        setRecords(...records, parsedEntrants);
        console.log({ parsedEntrants: parsedEntrants });

        populateEntryTable(...records, parsedEntrants);
      })
      .catch((e) => setDebug(e.message));
  };

  const registerId = (nfcId: string) => {
    let copyRecords = records;
    copyRecords[currentlySelectedIndex].nfcId = nfcId;
    setRecords(copyRecords);
    //         Alert.alert(JSON.stringify(parsedData[currentlySelectedIndex]));
    setNfcRegistered(true);
    //TODO this is a really shitty way of implementing this functionality - too big a refresh?
    LocalStorage.addToStarterList(
      Utils.getRaceKey(currentRace),
      records[currentlySelectedIndex]
    );
  };

  React.useEffect(() => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: any) => {
      if (addOrEdit) {
        registerId(tag.id);
      } else {
      }
    });
  });

  //   const populateEntryTable = (entrants) => {
  //   console.log({entrants: entrants});
  //     setTableContent(
  //       <>
  //         {entrants.length > 0 ? headerLine(Object.keys(entrants[0])) : ''}
  //         {entrants.length > 0
  //           ? entrants.map((record, index) => rowsLine(index, record))
  //           : ''}
  //       </>
  //     );
  //   };
  const populateEntryTable = (entrants) => {
    return (
      <>
        {entrants.length > 0 ? headerLine(Object.keys(entrants[0])) : ''}
        {entrants.length > 0
          ? entrants.map((record, index) => rowsLine(index, record))
          : ''}
      </>
    );
  };

  return (
    <View>
      <CurrentRaceView raceDetails={currentRace} />
      <Text>{debug}</Text>
      <View>
        <Text>
          <Button
            title="Import csv"
            color="#e69138ff"
            onPress={async () => {
              try {
                const response = await DocumentPicker.pick({
                  presentationStyle: 'fullScreen',
                });
                const file = await fetch(response[0].uri);
                const data = await file.text(); //JSON.stringify(file);
                console.log;
                setRecords(parseCSV(data));
                //                 console.log(records);
                //                 populateEntryTable(records);
                //                 console.log(tableContent);
              } catch (e) {
                setStatusMessage('ERROR:' + e.message);
              }
            }}
          />
        </Text>
      </View>
      <View>
        <DataTable>{records && populateEntryTable(records)}</DataTable>
      </View>
      {addOrEdit ? (
        <View backgroundColor="#AAAAAAAA">
          {Object.keys(entryData).length > 0
            ? Object.keys(entryData).map((key) =>
                entryForm(key, entryData[key])
              )
            : ''}
          {/*<TextInput
            placeholder="Race number"
            value={raceNumber}
            onChangeText={setRaceNumber}
          />*/}
          <Text>
            {nfcRegistered
              ? entryData.nfcId
              : 'Electronic timing chip not yet registered'}
          </Text>
        </View>
      ) : (
        ''
      )}

      <View>
        <Text>
          {!displaySaveButton ? (
            <Button
              title="Add entry"
              color={styles.button.color}
              disabled={true}
              onPress={() => {
                setAddOrEdit(true);
                const entryObject = defaultEntryFields.reduce(
                  (o, key) => Object.assign(o, { [key]: '' }),
                  {}
                );
                setEntryData(entryObject);
                setDisplaySaveButton(true);
              }}
            />
          ) : (
            ''
          )}

          {displaySaveButton && false ? (
            <Button
              title="Save"
              disabled={true}
              color="#e69138ff"
              onPress={async () => {}}
            />
          ) : (
            ''
          )}
          {displaySaveButton && false ? (
            <Button
              title="Cancel"
              color="#e69138ff"
              disabled={true}
              onPress={async () => {
                setAddOrEdit(false);
                setEntryData([]);
                setDisplaySaveButton(false);
              }}
            />
          ) : (
            ''
          )}
        </Text>
      </View>
      <Text>{statusMessage}</Text>
    </View>
  );
};

export default Registration;
