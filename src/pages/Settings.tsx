/**

 */

import React from 'react';

import { View, Button, TextInput, Text, TouchableOpacity } from 'react-native';
import { DataTable } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {
  const [availableRaces, setAvailableRaces] = React.useState([]);
  const [raceData, setRaceData] = React.useState([]);
  const [datePickerVisible, setDatePickerVisible] = React.useState(false);

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

        <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
          <Text>Choose race date</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={datePickerVisible}
          mode="date"
          onConfirm={() => setDatePickerVisible(false)}
          onCancel={() => setDatePickerVisible(false)}
        />

        <TextInput
          //         key={key}
          //         editable={false}
          placeholder="Mass start"
          onChangeText={(changedText) =>
            updateTextField('massstart', changedText)
          }
        />
      </View>
    </>
  );
};

export default Settings;
