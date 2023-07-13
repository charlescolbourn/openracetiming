import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
export default class LocalStorage {
  public static setStartTime(racekey: string, timestamp: number) {
    return AsyncStorage.setItem(
      `@ORT_starttimes:${racekey}:default`,
      `${timestamp}`
    );
  }

  public static getStartTime(racekey: string) {
    return AsyncStorage.getItem(`@ORT_starttimes:${racekey}:default`);
  }

  public static writeFinishTime(
    racekey: string,
    timestamp: number,
    id: string
  ) {
    // catch and write might not be necessary
    // it handles the case where the db doesn't yet exist
    return AsyncStorage.getItem(`@ORT_finishtimes:${racekey}`)
      .then((times) => {
        LocalStorage.writeFinishToStorage(times, racekey, timestamp, id);
      })
      .catch((e) => {
        console.log(e.message);
        LocalStorage.writeFinishToStorage('', racekey, timestamp, id);
      });
  }

  public static updateFinishTimeWithId(
    racekey: string,
    id: string,
    index: number
  ) {
    return AsyncStorage.getItem(`@ORT_finishtimes:${racekey}`)
      .then((timesString) => {
        let times = JSON.parse(timesString);

        const originalId = Object.keys(times[index])[0];
        let newTimeEntry = { [id]: times[index][originalId] };
        newTimeEntry.id = id;
        times[index] = newTimeEntry;
        AsyncStorage.setItem(
          `@ORT_finishtimes:${racekey}`,
          JSON.stringify(times)
        );
      })
      .catch((e) => {
        console.log(e.message);
      });
  }

  private static writeFinishToStorage(
    times: string,
    racekey: string,
    timestamp: number,
    id: string
  ) {
    let timesObj = times ? JSON.parse(times) : [];
    timesObj.push({ [id]: timestamp });
    return AsyncStorage.setItem(
      `@ORT_finishtimes:${racekey}`,
      JSON.stringify(timesObj)
    );
  }

  public static getEntrant(racekey: string, entrantId: string) {
    return AsyncStorage.getItem(`@ORT_entrantsByKey:${racekey}:${entrantId}`);
  }

  public static getAllEntrants(racekey: string) {
    return AsyncStorage.getAllKeys().then((keys) => {
      const items = Promise.all(
        keys.map((key) => {
          if (key.startsWith(`@ORT_entrantsByKey:${racekey}`)) {
            return AsyncStorage.getItem(key);
          }
        })
      );
      return items;
    });
  }

  public static clear() {
    AsyncStorage.clear();
  }

  public static addToStarterList(racekey: string, record: string) {
    return AsyncStorage.setItem(
      `@ORT_entrantsByKey:${racekey}:${record.id}`,
      JSON.stringify(record)
    );
  }

  public static getRaces() {
    return AsyncStorage.getItem('@ORT_allraces').then((content) =>
      JSON.parse(content)
    );
  }

  public static saveRace(raceData: object) {
    const raceKey = `${raceData.raceName}:${raceData.raceDate}`;
    raceData.key = raceKey;
    return AsyncStorage.getItem('@ORT_allraces')
      .then((races) => {
        let raceArray = races ? JSON.parse(races) : [];
        raceArray.push(raceData);
        const ret = AsyncStorage.setItem(
          '@ORT_allraces',
          JSON.stringify(raceArray)
        ).catch((e) => Alert.alert(e.message));
        return ret;
      })
      .catch((e) => Alert.alert(JSON.stringify(e.message)));
  }

  public static setCurrentRace(raceInfo: object) {
    AsyncStorage.setItem('@ORT_currentrace', JSON.stringify(raceInfo));
  }

  public static getCurrentRace() {
    return AsyncStorage.getItem('@ORT_currentrace');
  }

  public static getResults(raceKey: string) {
    return AsyncStorage.getItem(`@ORT_finishtimes:${raceKey}`);
  }

  public static getEverything() {
    return AsyncStorage.getAllKeys()
      .then((keys) => {
        return AsyncStorage.multiGet(keys);
      })
      .catch((e) => Alert.alert(e.message));
  }
}
