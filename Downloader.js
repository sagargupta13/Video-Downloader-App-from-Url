import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import React, {useState} from 'react';
import RNFetchBlob from 'rn-fetch-blob';

const Downloader = () => {
  const [pastedURL, setPastedURL] = useState('');
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'File Downloader App',
          message:
            'Downloader app needs access to your storage ' +
            'so you can download your files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        downloadFile();
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const App = () => (
    <View style={styles.container}>
      <Text style={styles.item}>Try permissions</Text>
      <Button title="request permissions" onPress={requestCameraPermission} />
    </View>
  );

  const downloadFile = () => {
    const {config, fs} = RNFetchBlob;
    const fileDir = fs.dirs.DownloadDir;
    const date = new Date();
    alert('downloading');

    config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          fileDir +
          '/download_' +
          Math.floor(date.getDate() + date.getSeconds() / 2) +
          '.mp4',
        description: 'File Downloaded',
      },
    })
      .fetch('GET', pastedURL, {})
      .then(res => {
        console.log(res);
        alert('Download');
        alert('The file saved to '+ res.path());
      });
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'baseline'}}>
      <TextInput
        placeholder="Enter/Paste video file url"
        style={{
          width: '90%',
          height: 50,
          borderWidth: 0.5,
          alignSelf: 'center',
          borderRadius: 25,
          paddingLeft: 10,
        }}
        value={pastedURL}
        onChangeText={txt => setPastedURL(txt)}
      />
      <TouchableOpacity
        style={{
          width: '90%',
          height: 50,
          borderWidth: 0.5,
          alignSelf: 'center',
          backgroundColor: 'purple',
          borderRadius: 25,
          paddingLeft: 20,
          marginTop: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          if (pastedURL !== '') {
            requestStoragePermission();
          } else {
            alert('Please add some URL');
          }
        }}>
        <Text style={{color: 'white', fontSize: 20}}>Download File</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Downloader;
