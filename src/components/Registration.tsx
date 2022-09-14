import * as React from 'react';
import { View, Text, Button, TextInput, TouchableOpacity } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { DataTable } from 'react-native-paper';
import { readString } from 'react-native-csv';

const Registration = () => {
  const [parsedData, setParsedData] = React.useState([]);
  const [firstname, setFirstname] = React.useState('');
  const [lastname, setLastname] = React.useState('');
  const [club, setClub] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [addOrEdit, setAddOrEdit] = React.useState(false);
  const [displaySaveButton, setDisplaySaveButton] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState('');

  const parseCSV = (data) => {
    const results = readString(data, { header: true });
    return results.data; //handle errors
  };

  const headerLine = (keys) => {
    return (
      <DataTable.Header>
        {keys.map((field) => {
          return <DataTable.Title key={field}>{field}</DataTable.Title>;
        })}
      </DataTable.Header>
    );
  };

  const selectRecord = (record) => {
    setFirstname(record.Forename);
    setLastname(record.Surname);
    setClub(record.Club);
    setCategory(record.Category);
    setAddOrEdit(true);
    setDisplaySaveButton(true);
  };

  const keyFromObject = (obj) => {
    return obj[Object.keys(obj)[0]] + obj[Object.keys(obj)[1]];
  };

  const rowsLine = (record) => {
    return (
      <TouchableOpacity
        key={keyFromObject(record)}
        onPress={() => selectRecord(record)}
      >
        <DataTable.Row key={keyFromObject(record)}>
          {Object.values(record).map((field) => {
            return <DataTable.Cell key={field}>{field}</DataTable.Cell>;
          })}
        </DataTable.Row>
      </TouchableOpacity>
    );
  };

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
        <View>
          <DataTable>
            {parsedData.length > 0
              ? headerLine(Object.keys(parsedData[0]))
              : ''}
            {parsedData.length > 0
              ? parsedData.map((record) => rowsLine(record))
              : ''}
          </DataTable>
        </View>
        {addOrEdit ? (
          <View backgroundColor="#AAAAAAAA">
            <Text>Firstname: </Text>
            <TextInput placeholder="Firstname" value={firstname} />
            <Text>Lastname: </Text>
            <TextInput placeholder="Lastname" value={lastname} />
            <Text>Club: </Text>
            <TextInput placeholder="Club" value={club} />
            <Text>Category: </Text>
            <TextInput placeholder="Category" value={category} />
          </View>
        ) : (
          ''
        )}
      </View>
      <View>
        <Text>
          {!displaySaveButton ? (
            <Button
              title="Add entry"
              color="#e69138ff"
              onPress={async () => {
                setAddOrEdit(true);
                setCategory('');
                setFirstname('');
                setLastname('');
                setClub('');
                setDisplaySaveButton(true);
              }}
            />
          ) : (
            ''
          )}
          {displaySaveButton ? (
            <Button title="Save" color="#e69138ff" onPress={async () => {}} />
          ) : (
            ''
          )}
          {displaySaveButton ? (
            <Button
              title="Cancel"
              color="#e69138ff"
              onPress={async () => {
                setAddOrEdit(false);
                setCategory('');
                setFirstname('');
                setLastname('');
                setClub('');
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
