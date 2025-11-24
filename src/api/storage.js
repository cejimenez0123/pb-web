import { FirebaseStorage } from '@capacitor-firebase/storage';
import { Filesystem, Directory } from '@capacitor/filesystem';

const uploadFile = async () => {
  return new Promise((resolve, reject) => {
     FirebaseStorage.uploadFile(
      {
        path: 'images/mountains.png',
        uri: 'file:///var/mobile/Containers/Data/Application/E397A70D-67E4-4258-236E-W1D9E12111D4/Library/Caches/092F8464-DE60-40B3-8A23-EB83160D9F9F/mountains.png',
      },
      (event, error) => {
        if (error) {
          reject(error);
        } else if (event?.completed) {
          resolve();
        }
      }
    );
  });
};

const downloadFile = async () => {
  const { downloadUrl } = await FirebaseStorage.getDownloadUrl({
    path: 'images/mountains.png',
  });
  const { path } = await Filesystem.downloadFile({
    url: downloadUrl,
    path: 'mountains.png',
    directory: Directory.Cache,
  });
  return path;
};

const getDownloadUrl = async () => {
  const { downloadUrl } = await FirebaseStorage.getDownloadUrl({
    path: 'images/mountains.png',
  });
  return downloadUrl;
};

const deleteFile = async () => {
  await FirebaseStorage.deleteFile({
    path: 'images/mountains.png',
  });
};

const listFiles = async () => {
  const { items } = await FirebaseStorage.listFiles({
    path: 'images',
  });
  return items;
};

const getMetadata = async () => {
  const result = await FirebaseStorage.getMetadata({
    path: 'images/mountains.png',
  });
  return result;
};

const updateMetadata = async () => {
  await FirebaseStorage.updateMetadata({
    path: 'images/mountains.png',
    metadata: {
      contentType: 'image/png',
      customMetadata: {
        foo: 'bar',
      },
    },
  });
};

const useEmulator = async () => {
  await FirebaseStorage.useEmulator({
    host: '10.0.2.2',
    port: 9001,
  });
};