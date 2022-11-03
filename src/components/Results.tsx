import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { DataTable } from 'react-native-paper';
import LocalStorage from '../lib/LocalStorage';
import Utils from '../lib/Utils';
import moment from 'moment';
import EntrantRecordLine from './EntrantRecordLine';

const Results = () => {
  const [resultsData, setResultsData] = React.useState([]);
  const [currentRace, setCurrentRace] = React.useState({});
  const [debug, setDebug] = React.useState('');

  React.useEffect(() => {
    if (!currentRace || Object.keys(currentRace).length === 0) {
      LocalStorage.getCurrentRace()
        .then((raceDetails) => {
          setCurrentRace(JSON.parse(raceDetails));
        })
        .catch((e) => setDebug(e.message));
    }
  });

  const displayResultsFromLocalContent = () => {
    LocalStorage.getResults(Utils.getRaceKey(currentRace))
      .then((results) => {
        formatResultsTable(JSON.parse(results));
      })
      .catch((e) => setDebug(e.message));
    // LocalStorage.getResults(Utils.getRaceKey(currentRace)).then( (results) =>
    // {
    // const resultsObject = JSON.parse(results);
    // setDebug(JSON.stringify(Object.keys(resultsObject)));
    //
    // }).catch ( (e) => setDebug(e.message));
  };

  const formatResultsTable = (results) => {
    Object.keys(results).map((key) => {
      //setDebug(key);
      return LocalStorage.getEntrant(Utils.getRaceKey(currentRace), key)
        .then((entrantRecordString) => {
          let extendedEntrantRecord = JSON.parse(entrantRecordString);
          extendedEntrantRecord.finishtime = moment(results[key]).format(
            'HH:mm:ss.S'
          );
          setResultsData([
            ...resultsData,
            <EntrantRecordLine record={extendedEntrantRecord} />,
          ]);
          //setDebug(JSON.stringify(extendedEntrantRecord));
        })
        .catch((e) => setDebug(e.message));
    });
  };

  //   React.useEffect(() => {
  //     displayResultsFromLocalContent();
  //   });

  return (
    <View>
      <Text>{debug}</Text>
      <Text>
        {currentRace && Object.keys(currentRace).length > 0
          ? `${currentRace.raceName} ${moment(currentRace.raceDate).format(
              'DD/MM/YYYY'
            )}`
          : 'No race selected'}

        {/*                         <CurrentRaceView raceDetails={currentRace}/>   */}
      </Text>
      <DataTable>{resultsData}</DataTable>
      <Button title="reload" onPress={() => displayResultsFromLocalContent()} />
    </View>
  );
};

export default Results;
