import * as React from 'react';
import { View, Text, Button } from 'react-native';
import LocalStorage from '../lib/LocalStorage';
import Utils from '../lib/Utils';
import moment from 'moment';

const Results = () => {
  const [resultsData, setResultsData] = React.useState('');
  const [currentRace, setCurrentRace] = React.useState({});

  React.useEffect(() => {
    if (!currentRace || Object.keys(currentRace).length === 0) {
      LocalStorage.getCurrentRace().then((raceDetails) => {
        setCurrentRace(JSON.parse(raceDetails));
      });
    }
  });

  const displayResultsFromLocalContent = () => {
    LocalStorage.getResults(Utils.getRaceKey(currentRace)).then((results) => {
      setResultsData(results);
    });
  };

  React.useEffect(() => {
    displayResultsFromLocalContent();
  });

  return (
    <View>
      <Text>
        {currentRace && Object.keys(currentRace).length > 0
          ? `${currentRace.raceName} ${moment(currentRace.raceDate).format(
              'DD/MM/YYYY'
            )}`
          : 'No race selected'}

        {/*                         <CurrentRaceView raceDetails={currentRace}/>   */}
      </Text>
      <Text>{JSON.stringify(resultsData)}</Text>
      <Button title="reload" onPress={() => displayResultsFromLocalContent()} />
    </View>
  );
};

export default Results;
