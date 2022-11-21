import React, { FC, Text } from 'react';
import moment from 'moment';

type CurrentRaceProps = {
  raceDetails: object;
};

const CurrentRaceView: FC<CurrentRaceProps> = ({ raceDetails = false }) => {
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
