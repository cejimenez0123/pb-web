import { FirebaseStorage } from "@capacitor-firebase/storage";

const uploadFile = async (image) => {
    let fileName = `image/${Date.now()}.jpg`
 new Promise((resolve, reject) => {
    FirebaseStorage.uploadFile(
      {
        path:fileName, // Unique path in Firebase Storage
        uri: image.path // Use native file URI here for iOS compatibility
      },
      (event, error) => {
        if (error) {
          reject(error);
        } else if (event?.completed) {
          resolve(event);
        }
      }
    );

  });
   return fileName
};
export default uploadFile