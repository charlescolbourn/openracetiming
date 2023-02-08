/**

 */

import React from 'react';

import { Alert, View, Button, Text, StyleSheet } from 'react-native';
import styles from '../style/Styles';

import LocalStorage from '../lib/LocalStorage';

const DeveloperOptions = () => {
  const [debug, setDebug] = React.useState('');
  const getEverything = () => {
    LocalStorage.getEverything()
      .then((everything) => setDebug(JSON.stringify(everything)))
      .catch((e) => setDebug(e.message));
  };

  const wipeLocalStorage = () => {
    LocalStorage.clear();
  };
  return (
    <>
      <View>
        <Text>{debug}</Text>

        <Button
          onPress={() => getEverything()}
          color={styles.button.color}
          title="Get everything from local storage"
        />
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <Button
          color={styles.danger.color}
          onPress={() => {
            Alert.alert('Wipe all app data', 'Are you sure about that?', [
              { text: 'yes', onPress: () => wipeLocalStorage() },
              {
                text: 'no',
                //onPress: () => return,
                style: 'cancel',
              },
            ]);
          }}
          title="Wipe all ORT data from local storage"
        />
      </View>
    </>
  );
};

export default DeveloperOptions;
