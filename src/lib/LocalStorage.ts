import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
export default class LocalStorage {
  public static setStartTime(timestamp: number) {
    return AsyncStorage.setItem('@ORT_starttimes:default', `${timestamp}`);
  }

  public static getStartTime() {
    return AsyncStorage.getItem('@ORT_starttimes:default');
  }

  public static writeFinishTimeLocalStorage(timestamp: number, id: string) {
    return AsyncStorage.setItem(`@ORT_finishtimes:${id}`, `${timestamp}`);
  }

  public static getEntrantFromLocalStorage(entrantId) {
    return AsyncStorage.getItem(`@ORT_registeredEntrants:${entrantId}`);
  }

  public static clear() {
    AsyncStorage.clear();
  }

  public static addToStarterList(record) {
    return AsyncStorage.setItem(
      `@ORT_registeredEntrants:${record.nfcId}`,
      JSON.stringify(record)
    );
  }

  public static getRaces() {
    return AsyncStorage.getItem('@ORT_allraces').then((raceList) => {
      //       return raceList
      //         ? AsyncStorage.multiGet(
      return raceList.map((key) => `@ORT_racedetails:${key}`);
      //           )
      //         : new Promise(() => []);
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
}
