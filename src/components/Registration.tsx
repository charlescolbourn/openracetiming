import * as React from 'react';
import { View, Text, Button, SafeAreaView, FlatList } from 'react-native';
import Dialog from 'react-native-dialog';
import RNFS from 'react-native-fs';

const Registration = () => {
	const [showFileDialog, setShowFileDialog] = React.useState(false);

	const [files, setFiles] = React.useState([]);

	const getFileContent = async (path) => {
		const reader = await RNFS.readDir(path);
		setFiles(reader);
	};
	React.useEffect(() => {
		getFileContent(RNFS.DownloadDirectoryPath); //run the function on the first render.
	}, []);

	// const Item = ({ name, isFile }) => {
	const Item = ({ name }) => {
		return (
			<View>
				<Text>{name}</Text>
				{/*         <Text> {isFile ? "It is a file" : "It's a folder"}</Text> */}
			</View>
		);
	};
	const renderItem = ({ item }) => {
		//   const renderItem = ({ item, index }) => {
		return (
			<View>
				{/*         <Text >{index}</Text> */}
				{/* The isFile method indicates whether the scanned content is a file or a folder*/}
				<Item name={item.name} isFile={item.isFile()} />
			</View>
		);
	};

	return (
		<View>
			<Text>
				'registration'
				<Button
					title="Import csv"
					onPress={() => {
						setShowFileDialog(true);
					}}
				/>
				<Dialog.Container visible={showFileDialog}>
					<Dialog.Title>import file</Dialog.Title>
					<Dialog.Description>
						<SafeAreaView>
							<FlatList
								data={files}
								renderItem={renderItem}
								keyExtractor={(item) => item.name}
							/>
						</SafeAreaView>
					</Dialog.Description>
					<Dialog.Button
						label="Cancel"
						onPress={() => {
							setShowFileDialog(false);
						}}
					/>
					<Dialog.Button label="OK" />
				</Dialog.Container>
				scan tag identify person (doesn't exist? add)
			</Text>
		</View>
	);
};

export default Registration;
