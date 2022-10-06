/**

 */

import React from 'react';

import { View, Button, TextInput } from 'react-native';
import { DataTable } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {
  const [availableRaces, setAvailableRaces] = React.useState([]);
  const [raceData, setRaceData] = React.useState([]);

  const initialiseFromLocalStorage = () => {
    getRacesFromLocalStorage().then((raceList) => {
      let listTable = raceList
        .sort((a, b) => a.date < b.date)
        .map((race) => {
          console.log(race);
        });
      setAvailableRaces(listTable);
    });
  };

  React.useEffect(() => initialiseFromLocalStorage());

  const addNewRace = () => {
    console.log('foo');
  };
  const getRacesFromLocalStorage = () => {
    return AsyncStorage.getItem('@ORT_allraces');
  };
  const updateTextField = (key, text) => {
    setRaceData({ ...raceData, key: raceData[key] + text });
  };

  return (
    <>
      <View>
        <DataTable>{availableRaces}</DataTable>

        <Button
          onPress={() => {
            addNewRace();
          }}
          title="add race"
        />
      </View>

      <View>
        <TextInput
          //         key={key}
          //         editable={false}
          placeholder="Race Name"
          onChangeText={(changedText) =>
            updateTextField('racename', changedText)
          }
        />
      </View>
    </>
  );
};

export default Settings;
