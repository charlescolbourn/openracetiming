// import MockAsyncStorage from 'mock-async-storage';
import LocalStorage from './LocalStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TEST_RACEKEY = 'r4cek3y';

// const mock = () => {
//   const mockImpl = new MockAsyncStorage()
//   jest.mock('AsyncStorage', () => mockImpl)
// }

describe('test timing methods', () => {
  it('check get start time', () => {
    LocalStorage.getStartTime(TEST_RACEKEY);
    expect(AsyncStorage.getItem).toBeCalledWith(
      `@ORT_starttimes:${TEST_RACEKEY}:default`
    );
  });

  it('check set finish time', () => {
    LocalStorage.writeFinishTime(TEST_RACEKEY, 12345, 'abcdef');
    expect(AsyncStorage.setItem).toBeCalledWith(
      `@ORT_finishtimes:${TEST_RACEKEY}:abcdef`,
      '12345'
    );
  });
});

describe('entrant methods', () => {
  it('check get entrant', () => {
    LocalStorage.getEntrant(TEST_RACEKEY, 'badger');
    expect(AsyncStorage.getItem).toBeCalledWith(
      `@ORT_registeredEntrants:${TEST_RACEKEY}:badger`
    );
  });
});
