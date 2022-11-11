import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { DataTable } from 'react-native-paper';
import LocalStorage from '../lib/LocalStorage';
import Utils from '../lib/Utils';
import moment from 'moment';
import EntrantRecordLine from './EntrantRecordLine';
import * as ScopedStorage from 'react-native-scoped-storage';
import { jsonToCSV } from 'react-native-csv';

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
    console.log(Utils.getRaceKey(currentRace));
    LocalStorage.getResults(Utils.getRaceKey(currentRace))
      .then((results) => {
        console.log(JSON.parse(results));
        const newContent = formatResults(
          JSON.parse(results),
          (extendedEntrantRecord) => {
            return (
              <EntrantRecordLine
                key={extendedEntrantRecord.nfcId}
                record={extendedEntrantRecord}
              />
            );
          }
        );
        setResultsData(newContent);
      })
      .catch((e) => setDebug(e.message));
    // LocalStorage.getResults(Utils.getRaceKey(currentRace)).then( (results) =>
    // {
    // const resultsObject = JSON.parse(results);
    // setDebug(JSON.stringify(Object.keys(resultsObject)));
    //
    // }).catch ( (e) => setDebug(e.message));
  };

  const formatResults = (results, callback) => {
    let formattedContent = [];
    Object.keys(results).map((key) => {
      return LocalStorage.getEntrant(Utils.getRaceKey(currentRace), key)
        .then((entrantRecordString) => {
          let extendedEntrantRecord = JSON.parse(entrantRecordString);
          extendedEntrantRecord.finishtime = moment(results[key]).format(
            'HH:mm:ss.S'
          );
          formattedContent.push(callback(extendedEntrantRecord));

          //setDebug(JSON.stringify(extendedEntrantRecord));
        })
        .catch((e) => setDebug(e.message));
    });
    return formattedContent;
  };

  //   React.useEffect(() => {
  //     displayResultsFromLocalContent();
  //   });

  const exportResultsToFile = async () => {
    const stringResults = await LocalStorage.getResults(
      Utils.getRaceKey(currentRace)
    );
    const resultsJson = JSON.parse(stringResults);

    const csvString = jsonToCSV(resultsJson);
    console.log(resultsJson);
    let dir = await ScopedStorage.openDocumentTree(true);
    //   write the current list of answers to a local csv file
    const filename = `${currentRace.raceName}_${currentRace.raceDate}.csv`;
    // pathToWrite /storage/emulated/0/Download/data.csv
    await ScopedStorage.writeFile(dir.uri, csvString, filename)
      .then(() => {
        console.log(`wrote file ${filename}`);
      })
      .catch((error) => console.error(error));
  };

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
      <Button title="write to file" onPress={() => exportResultsToFile()} />
    </View>
  );
};

export default Results;
