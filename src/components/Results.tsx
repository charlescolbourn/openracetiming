import * as React from 'react';
import { View, Button } from 'react-native';
import { DataTable } from 'react-native-paper';
import LocalStorage from '../lib/LocalStorage';
import Utils from '../lib/Utils';
import moment from 'moment';
import EntrantRecordLine from './EntrantRecordLine';
import * as ScopedStorage from 'react-native-scoped-storage';
import { jsonToCSV } from 'react-native-csv';
import styles from '../style/Styles';
import CurrentRaceView from './CurrentRaceView';

const Results = () => {
  const [resultsData, setResultsData] = React.useState([]);
  const [currentRace, setCurrentRace] = React.useState({});

  React.useEffect(() => {
    if (!currentRace || Object.keys(currentRace).length === 0) {
      LocalStorage.getCurrentRace()
        .then((raceDetails) => {
          if (raceDetails) {
            setCurrentRace(JSON.parse(raceDetails));
          }
        })
        .catch((e) => console.log(e.message));
    }
  });

  const displayResultsFromLocalContent = () => {
    LocalStorage.getResults(Utils.getRaceKey(currentRace))
      .then((results) => {
        formatResults(JSON.parse(results), (extendedEntrantRecord) => {
          return (
            <EntrantRecordLine
              key={extendedEntrantRecord.finishtime}
              record={extendedEntrantRecord}
            />
          );
        }).then((newContent) => {
          setResultsData(newContent);
        });
      })
      .catch((e) => console.log('badger ' + e.message));
  };

  const formatResults = (results, callback) => {
    return Promise.all(
      results.map((entry) => {
        let key = Object.keys(entry)[0];
        return LocalStorage.getEntrant(Utils.getRaceKey(currentRace), key)
          .then((entrantRecordString) => {
            let extendedEntrantRecord = entrantRecordString
              ? JSON.parse(entrantRecordString)
              : { name: 'unknown' };
            extendedEntrantRecord.finishtime = moment(entry[key]).format(
              'HH:mm:ss.S'
            );
            return callback(extendedEntrantRecord);
          })
          .catch((e) => console.log('mushroom ' + e.message));
      })
    );
  };

  const exportResultsToFile = async () => {
    const stringResults = await LocalStorage.getResults(
      Utils.getRaceKey(currentRace)
    );
    console.log(stringResults);
    const resultsJson = await formatResults(
      JSON.parse(stringResults),
      (record) => record
    );
    console.log(JSON.stringify(resultsJson));

    const csvString = jsonToCSV(resultsJson);
    let dir = await ScopedStorage.openDocumentTree(true);
    //   write the current list of answers to a local csv file
    const filename = `${currentRace.raceName}_${currentRace.raceDate}.csv`;
    // pathToWrite /storage/emulated/0/Download/data.csv
    await ScopedStorage.writeFile(dir.uri, csvString, filename)
      .then(() => {
        console.log(
          `wrote file ${filename} with content ${csvString} from json ${JSON.stringify(
            resultsJson
          )}`
        );
      })
      .catch((error) => console.error(error));
  };

  return (
    <View>
      <CurrentRaceView raceDetails={currentRace} />
      <DataTable>{resultsData}</DataTable>
      <Button
        color={styles.button.color}
        title="reload"
        onPress={() => displayResultsFromLocalContent()}
      />
      <Button
        color={styles.button.color}
        title="write to file"
        onPress={() => exportResultsToFile()}
      />
    </View>
  );
};

export default Results;
