
import { httpsCallable, getFunctions } from 'firebase/functions';
import { app } from '../core/di.js'; // Adjust the import path as necessary

const functions = getFunctions(app); 

export async function getFirebaseSignedUploadUrl(fileName) {
  // 'generateSignedUploadUrl' must match the name of your Cloud Function
  const getUrl = httpsCallable(functions, 'generateSignedUploadUrl');
  
  try {
    const result = await getUrl({ 
      fileName: fileName,
      contentType: 'image/jpeg' 
    });
    
 
    return result.data; 
    
  } catch (error) {
    console.error("Error calling Cloud Function for signed URL:", error);
    throw new Error("Failed to get secure upload URL.");
  }
}