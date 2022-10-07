import AsyncStorage from '@react-native-async-storage/async-storage';

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
}
