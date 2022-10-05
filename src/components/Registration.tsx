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
import AsyncStorage from '@react-native-async-storage/async-storage';
import EntrantRecordLine from './EntrantRecordLine';

const Registration = () => {
  const [parsedData, setParsedData] = React.useState([]);
  //   const [allEntriesData, setAllEntriesData] = React.useState([]);
  const [entryData, setEntryData] = React.useState([]);
  const [currentlySelectedIndex, setCurrentlySelectedIndex] = React.useState(0);
  const [addOrEdit, setAddOrEdit] = React.useState(false);
  const [displaySaveButton, setDisplaySaveButton] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState('');
  const defaultEntryFields = ['Firstname', 'Lastname', 'Club', 'Category'];
  //   const [raceNumber, setRaceNumber] = React.useState('');
  const [nfcRegistered, setNfcRegistered] = React.useState(false);

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
        <DataTable.Title key="tag">Registered eTag</DataTable.Title>
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

  const registerId = (nfcId: string) => {
    let copyParsedData = parsedData;
    copyParsedData[currentlySelectedIndex].nfcId = nfcId;
    setParsedData(copyParsedData);
    //         Alert.alert(JSON.stringify(parsedData[currentlySelectedIndex]));
    setNfcRegistered(true);
    //TODO this is a really shitty way of implementing this functionality - too big a refresh?
    addToStarterList(parsedData[currentlySelectedIndex]);
  };

  const addToStarterList = (record) => {
    return AsyncStorage.setItem(
      `@ORT_registeredEntrants:${record.nfcId}`,
      JSON.stringify(record)
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

  return (
    <View>
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

                setParsedData(parseCSV(data));
              } catch (e) {
                setStatusMessage('ERROR:' + e.message);
              }
            }}
          />
        </Text>
      </View>
      <View>
        <DataTable>
          {parsedData.length > 0 ? headerLine(Object.keys(parsedData[0])) : ''}
          {parsedData.length > 0
            ? parsedData.map((record, index) => rowsLine(index, record))
            : ''}
        </DataTable>
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
              color="#e69138ff"
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
