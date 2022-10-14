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
// import { DataTable } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import LocalStorage from '../lib/LocalStorage';

import moment from 'moment';

const Settings = () => {
  const [availableRaces, setAvailableRaces] = React.useState([]);
  const [raceData, setRaceData] = React.useState({ massStart: true });

  const [datePickerVisible, setDatePickerVisible] = React.useState(false);
  const [showNewRaceForm, setShowNewRaceForm] = React.useState(false);
  const [debug, setDebug] = React.useState('');

  const initialiseFromLocalStorage = () => {
    LocalStorage.getRaces()
      .then((raceList) => {
        //       let listTable = raceList ? raceList
        //         .sort((a, b) => a.raceDate < b.raceDate)
        //         .map((race) => {
        //           console.log(race);
        //         })
        //  : [];
        setAvailableRaces(JSON.stringify(raceList));
      })
      .catch((e) => setDebug(JSON.stringify(e.message)));
  };

  React.useEffect(() => initialiseFromLocalStorage());

  const saveRace = () => {
    LocalStorage.saveRace(raceData).catch((e) => setDebug(JSON.stringify(e)));
    setShowNewRaceForm(false);
    initialiseFromLocalStorage();
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
        <Text>{availableRaces}</Text>
      </View>

      {showNewRaceForm ? (
        newRaceForm()
      ) : (
        <Button onPress={() => setShowNewRaceForm(true)} title="new race" />
      )}
    </>
  );
};

export default Settings;
