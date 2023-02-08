/**

 */

import React from 'react';

import {
  View,
  Button,
  TextInput,
  Text,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { DataTable } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import LocalStorage from '../lib/LocalStorage';
import DeveloperOptions from './DeveloperOptions';
import { useFocusEffect } from '@react-navigation/native';

import moment from 'moment';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = ({ navigation }) => {
  const DEVSETTINGS = true;
  const [availableRaces, setAvailableRaces] = React.useState(undefined);
  const [raceData, setRaceData] = React.useState({ massStart: true });

  const [datePickerVisible, setDatePickerVisible] = React.useState(false);
  const [showNewRaceForm, setShowNewRaceForm] = React.useState(false);
  const [debug, setDebug] = React.useState('');

  const initialiseFromLocalStorage = () => {
    console.log('getting races');
    LocalStorage.getRaces()
      .then((raceList) => {
        //       setDebug(tabulateRaces(JSON.parse(raceList)));
        // setDebug(Object.values(raceList));
        //       let listTable = raceList ? raceList
        //         .sort((a, b) => a.raceDate < b.raceDate)
        //         .map((race) => {
        //           console.log(race);
        //         })
        //  : [];
        console.log(raceList);
        setAvailableRaces(tabulateRaces(raceList));
      })
      .catch((e) => setDebug(JSON.stringify(e.message)));
    console.log('ran fetch races');
  };

  useFocusEffect(() => {
    if (!availableRaces && !showNewRaceForm) {
      initialiseFromLocalStorage();
    }
  });

  const selectRace = (raceInfo) => {
    LocalStorage.setCurrentRace(raceInfo);
    navigation.jumpTo('Registration');
  };

  const tabulateRaces = (raceList) => {
    return raceList.map((value) => {
      return (
        <TouchableOpacity
          key={value.raceName}
          onPress={() => selectRace(value)}
        >
          <DataTable.Row key={value.raceName}>
            <DataTable.Cell key={value.raceName}>
              {value.raceName}
            </DataTable.Cell>
            <DataTable.Cell key={value.raceDate}>
              {moment(value.raceDate).format('DD/MM/YYYY')}
            </DataTable.Cell>
          </DataTable.Row>
        </TouchableOpacity>
      );
    });
  };

  const saveRace = () => {
    LocalStorage.saveRace(raceData)
      .catch((e) => setDebug(JSON.stringify(e.message)))
      .then(() => {
        setAvailableRaces(undefined);
        setShowNewRaceForm(false);
        AsyncStorage.getItem('@ORT_allraces').then((races) =>
          console.log(races)
        );
      })
      .catch((e) => setDebug(JSON.stringify(e.message)));
  };

  const updateField = (key, value) => {
    let newObj = raceData;
    newObj[key] = value;
    setRaceData(newObj);
  };

  const newRaceForm = () => {
    return (
      <View>
        <Text>{debug}</Text>
        <TextInput
          //         key={key}
          //         editable={false}
          placeholder="Race Name"
          onChangeText={(changedText) => updateField('raceName', changedText)}
        />

        <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
          <Text>
            {raceData.raceDate
              ? moment(raceData.raceDate).format('DD/MM/YYYY')
              : 'Click to set race date'}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={datePickerVisible}
          mode="date"
          onConfirm={(date) => {
            //                 let thisRace = raceData;
            //                 thisRace['raceDate'] = date.getTime();
            //                 setRaceData(thisRace);
            setDatePickerVisible(false);
            updateField('raceDate', date.getTime());
          }}
          onCancel={() => setDatePickerVisible(false)}
        />
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={raceData.massStart ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={(val) => updateField('massStart', val)}
          value={raceData.massStart}
        />

        <Button
          onPress={() => {
            saveRace();
          }}
          title="add race"
        />
      </View>
    );
  };

  return (
    <>
      <View>
        <Text>Select a race or create a new race</Text>
        <DataTable>{availableRaces}</DataTable>
      </View>
      <View>
        {showNewRaceForm ? (
          newRaceForm()
        ) : (
          <Button onPress={() => setShowNewRaceForm(true)} title="new race" />
        )}
      </View>
      <View>{DEVSETTINGS ? <DeveloperOptions /> : <></>}</View>
    </>
  );
};

export default Settings;
