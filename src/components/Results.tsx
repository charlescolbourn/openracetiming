import * as React from 'react';
import { View, Text } from 'react-native';
import LocalStorage from '../lib/LocalStorage';
import Utils from '../lib/Utils';
import moment from 'moment';

const Results = () => {
  const [resultsData, setResultsData] = React.useState('');
  const [currentRace, setCurrentRace] = React.useState({});

  React.useEffect(() => {
    if (Object.keys(currentRace).length === 0) {
      LocalStorage.getCurrentRace().then((raceDetails) => {
        setCurrentRace(JSON.parse(raceDetails));
      });
    }
  });

  const displayResultsFromLocalContent = () => {
    LocalStorage.getResults(Utils.getRaceKey(currentRace)).then((results) => {
      setResultsData(JSON.stringify(results));
    });

    //     AsyncStorage.getAllKeys().then((arrayOfKeys) => {
    //       arrayOfKeys.forEach((key) => {
    //         if (key.startsWith('@ORT_finishtimes')) {
    //           const id = key.substring(17, key.length);
    //           AsyncStorage.getItem(key)
    //             .then((item) => {
    //               if (!item) {
    //                 throw 'Stored finish time is null';
    //               }
    //               const elapsed = new Date(item);
    //               const timeString = `${elapsed.getHours()}:${elapsed.getMinutes()}:${elapsed.getSeconds()}`;
    //               setResults(results + '\n' + id + ' - ' + timeString);
    //             })
    //             .catch((e) => Alert.alert(JSON.stringify(e)));
    //         }
    //       });
    //     });
  };

  React.useEffect(() => {
    if (!resultsData) {
      displayResultsFromLocalContent();
    }
  });

  return (
    <View>
      <Text>
        {Object.keys(currentRace).length > 0
          ? `${currentRace.raceName} ${moment(currentRace.raceDate).format(
              'DD/MM/YYYY'
            )}`
          : 'No race selected'}

        {/*                         <CurrentRaceView raceDetails={currentRace}/>   */}
      </Text>
      <Text>{resultsData}</Text>
    </View>
  );
};

export default Results;
