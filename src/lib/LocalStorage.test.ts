// import MockAsyncStorage from 'mock-async-storage';
import LocalStorage from './LocalStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const mock = () => {
//   const mockImpl = new MockAsyncStorage()
//   jest.mock('AsyncStorage', () => mockImpl)
// }

describe('test timing methods', () => {
  it('check get start time', () => {
    LocalStorage.getStartTime();
    expect(AsyncStorage.getItem).toBeCalledWith('@ORT_starttimes:default');
  });

  it('check set finish time', () => {
    LocalStorage.writeFinishTime('12345', 'abcdef');
    expect(AsyncStorage.setItem).toBeCalledWith(
      '@ORT_finishtimes:abcdef',
      '12345'
    );
  });
});

describe('entrant methods', () => {
  it('check get entrant', () => {
    LocalStorage.getEntrant('badger');
    expect(AsyncStorage.getItem).toBeCalledWith(
      '@ORT_registeredEntrants:badger'
    );
  });
});
