import * as React from 'react';
import { View, Text, Button } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { DataTable } from 'react-native-paper';
import { readString } from 'react-native-csv';

const Registration = () => {
  const [fileData, setFileData] = React.useState('');
  const [parsedData, setParsedData] = React.useState([]);

  const parseCSV = (data) => {
    const results = readString(data, {});
    return results.data; //handle errors
  };

  const headerLine = (record) => {
    return (
      <DataTable.Header>
        {record.map((field) => {
          return <DataTable.Title key={field}>{field}</DataTable.Title>;
        })}
      </DataTable.Header>
    );
  };

  const rowsLine = (record) => {
    return (
      <DataTable.Row>
        {record.map((field) => {
          return <DataTable.Cell key={field}>{field}</DataTable.Cell>;
        })}
      </DataTable.Row>
    );
  };

  return (
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
              setFileData('ERROR:' + e.message);
            }
          }}
        />
      </Text>
      <View>
        <DataTable>
          {parsedData[0] ? headerLine(parsedData[0]) : ''}
          {parsedData[0]
            ? parsedData.slice(1).map((record) => rowsLine(record))
            : ''}
        </DataTable>
      </View>
      <Text>{fileData}</Text>
    </View>
  );
};

export default Registration;
