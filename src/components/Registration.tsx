import * as React from 'react';
import { View, Text, Button } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const Registration = () => {
  const [fileData, setFileData] = React.useState('');

  return (
    <View>
      <Text>
        <Button
          title="Import csv"
          onPress={async () => {
            try {
              const response = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
              });
              const file = await fetch(response[0].uri);
              const data = await file.text(); //JSON.stringify(file);
              setFileData(data);
            } catch (e) {
              setFileData('ERROR:' + e.message);
            }
          }}
        />
      </Text>
      <Text>{fileData}</Text>
    </View>
  );
};

export default Registration;
