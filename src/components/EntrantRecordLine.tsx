import React, { FC } from 'react';
import { DataTable } from 'react-native-paper';
import styles from '../style/Styles';

type EntrantLineProps = {
  record: object;
};

const EntrantRecordLine: FC<EntrantLineProps> = ({
  record,
  fieldsToDisplay = false,
}) => {
  const keyFromObject = (obj) => {
    return obj[Object.keys(obj)[0]] + obj[Object.keys(obj)[1]];
  };

  return (
    <DataTable.Row key={keyFromObject(record)}>
      {Object.keys(record)
        .filter(
          (key) => fieldsToDisplay === false || fieldsToDisplay.includes(key)
        )
        .map((key) => {
          return (
            <DataTable.Cell
              key={record[key]}
              textStyle={
                !record.nfcId
                  ? styles.EntrantRecordLine
                  : styles.EntrantRecordLine.registered
              }
            >
              {record[key]}
            </DataTable.Cell>
          );
        })}
      {/*           <DataTable.Cell key='registeredNumber'></DataTable.Cell> */}
    </DataTable.Row>
  );
};

export default EntrantRecordLine;
