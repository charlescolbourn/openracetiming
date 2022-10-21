import * as React from 'react';
import { View, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Identify = () => {
  const [results, setResults] = React.useState('');

  const displayResultsFromLocalContent = () => {
    AsyncStorage.getAllKeys().then((arrayOfKeys) => {
      arrayOfKeys.forEach((key) => {
        if (key.startsWith('@ORT_finishtimes')) {
          const id = key.substring(17, key.length);
          AsyncStorage.getItem(key)
            .then((item) => {
              if (!item) {
                throw 'Stored finish time is null';
              }
              const elapsed = new Date(item);
              const timeString = `${elapsed.getHours()}:${elapsed.getMinutes()}:${elapsed.getSeconds()}`;
              setResults(results + '\n' + id + ' - ' + timeString);
            })
            .catch((e) => Alert.alert(JSON.stringify(e)));
        }
      });
    });
  };

  React.useEffect(() => {
    if (!results) {
      displayResultsFromLocalContent();
    }
  });

  return (
    <View>
      <Text>{results}</Text>
    </View>
  );
};

export default Identify;
