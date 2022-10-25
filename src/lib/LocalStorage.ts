import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
export default class LocalStorage {
  public static setStartTime(racekey: string, timestamp: number) {
    return AsyncStorage.setItem('@ORT_starttimes:default', `${timestamp}`);
  }

  public static getStartTime(racekey) {
    return AsyncStorage.getItem(`@ORT_starttimes:${racekey}:default`);
  }

  public static writeFinishTime(
    racekey: string,
    timestamp: number,
    id: string
  ) {
    return AsyncStorage.setItem(
      `@ORT_finishtimes:${racekey}`,
      `{'${id}':'${timestamp}'}`
    );
  }

  public static getEntrant(racekey: string, entrantId: string) {
    return AsyncStorage.getItem(
      `@ORT_registeredEntrants:${racekey}:${entrantId}`
    );
  }

  public static clear() {
    AsyncStorage.clear();
  }

  public static addToStarterList(racekey, record) {
    return AsyncStorage.setItem(
      `@ORT_registeredEntrants:${racekey}:${record.nfcId}`,
      JSON.stringify(record)
    );
  }

  public static getRaces() {
    return AsyncStorage.getItem('@ORT_allraces').then((raceList) => {
      const raceListArray = raceList ? JSON.parse(raceList) : [];
      return raceList
        ? AsyncStorage.multiGet(
            raceListArray.map((key) => `@ORT_racedetails:${key}`)
          ).then((arr) => {
            return arr.map((key) => JSON.parse(key[1]));
          })
        : new Promise(() => []);
    });
  }

  public static saveRace(raceData) {
    const raceKey = `${raceData.raceName}:${raceData.raceDate}`;

    return AsyncStorage.setItem(
      `@ORT_racedetails:${raceKey}`,
      JSON.stringify(raceData)
    )
      .then(() => {
        AsyncStorage.getItem('@ORT_allraces')
          .then((races) => {
            let raceArray = races ? JSON.parse(races) : [];
            raceArray.push(raceKey);
            AsyncStorage.setItem(
              '@ORT_allraces',
              JSON.stringify(raceArray)
            ).catch((e) => Alert.alert(e.message));
          })
          .catch((e) => Alert.alert(JSON.stringify(e.message)));
      })
      .catch((e) => Alert.alert(JSON.stringify(e.message)));
  }

  public static setCurrentRace(raceInfo) {
    AsyncStorage.setItem('@ORT_currentrace', JSON.stringify(raceInfo));
  }

  public static getCurrentRace() {
    return AsyncStorage.getItem('@ORT_currentrace');
  }

  public static getResults(raceKey) {
    return AsyncStorage.getItem(`@ORT_finishtimes:${raceKey}`);
  }
}
