import React, { FC } from 'react';
import { DataTable } from 'react-native-paper';
type EntrantLineProps = {
  record: object;
};

const EntrantRecordLine: FC<EntrantLineProps> = ({ record }) => {
  const keyFromObject = (obj) => {
    return obj[Object.keys(obj)[0]] + obj[Object.keys(obj)[1]];
  };

  return (
    <DataTable.Row key={keyFromObject(record)}>
      {Object.values(record).map((field) => {
        return <DataTable.Cell key={field}>{field}</DataTable.Cell>;
      })}
      {/*           <DataTable.Cell key='registeredNumber'></DataTable.Cell> */}
      <DataTable.Cell key="registeredNfc">
        {record.nfcId ? 'Yes' : 'No'}
      </DataTable.Cell>
    </DataTable.Row>
  );
};

export default EntrantRecordLine;
