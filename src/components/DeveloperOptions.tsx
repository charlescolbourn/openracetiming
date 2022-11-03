/**

 */

import React from 'react';

import { View, Button, Text } from 'react-native';

import LocalStorage from '../lib/LocalStorage';

const DeveloperOptions = () => {
  const [debug, setDebug] = React.useState('');
  const getEverything = () => {
    LocalStorage.getEverything()
      .then((everything) => setDebug(JSON.stringify(everything)))
      .catch((e) => setDebug(e.message));
  };

  return (
    <>
      <View>
        <Text>{debug}</Text>

        <Button
          onPress={() => getEverything()}
          title="Get everything from local storage"
        />
      </View>
    </>
  );
};

export default DeveloperOptions;
