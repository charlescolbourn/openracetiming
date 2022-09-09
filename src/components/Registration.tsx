import * as React from 'react';
import {
  View,
  Text,
  Button,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Dialog from 'react-native-dialog';
// import RNFS from 'react-native-fs';
import { DownloadDirectoryPath, readDir, readFile } from 'react-native-fs';

const Registration = () => {
  const [showFileDialog, setShowFileDialog] = React.useState(false);

  const [files, setFiles] = React.useState([]);

  const [fileData, setFileData] = React.useState('');

  const getDirContent = async (path) => {
    // 		const reader = RNFS.readDir(path).then( (result) => {
    // 		    return Promise.all([RNFS.stat(result[0].path), result[0].path]);
    // 		    }).then( (fileList) => {
    // 		        setFileData(JSON.stringify(fileList));
    //
    //
    // 		}).catch( (e) => Alert.alert(e.message));
    const reader = await readDir(path);
    //  		setFileData(JSON.stringify(reader));
    setFiles(reader);
  };

  const readFileContent = async (filename) => {
    const response = await readFile(DownloadDirectoryPath + '/' + filename);
    setFileData(response); //set the value of response to the fileData Hook.
  };

  return (
    <View>
      <Text>
        <Button
          title="Import csv"
          onPress={() => {
            getDirContent(DownloadDirectoryPath);
            setShowFileDialog(true);
          }}
        />
        <Dialog.Container visible={showFileDialog}>
          <Dialog.Title>import file</Dialog.Title>
          <Dialog.Description>
            <SafeAreaView>
              {files.map(({ name }) => (
                <TouchableOpacity
                  key={name}
                  onPress={() => {
                    setShowFileDialog(false);
                    readFileContent(name);
                  }}
                >
                  <Text>{name}</Text>
                </TouchableOpacity>
              ))}
            </SafeAreaView>
          </Dialog.Description>
          <Dialog.Button
            label="Cancel"
            onPress={() => {
              setShowFileDialog(false);
            }}
          />
        </Dialog.Container>
      </Text>
      <Text>{fileData}</Text>
    </View>
  );
};

export default Registration;
