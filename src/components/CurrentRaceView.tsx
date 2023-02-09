import React, { FC } from 'react';
import moment from 'moment';
import { Text } from 'react-native';
type CurrentRaceProps = {
  raceDetails: object;
};

const CurrentRaceView: FC<CurrentRaceProps> = ({ raceDetails }) => {
  return (
    <Text>
      {Object.keys(raceDetails).length > 0
        ? `${raceDetails.raceName} ${moment(raceDetails.raceDate).format(
            'DD/MM/YYYY'
          )}`
        : 'No race selected'}
    </Text>
  );
};

export default CurrentRaceView;
