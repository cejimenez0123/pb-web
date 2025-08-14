import React from 'react';
import { SignInWithApple } from '@capacitor-community/apple-sign-in';
import { IonButton, IonIcon } from '@ionic/react';
import Enviroment from '../../core/Enviroment';
import { useDispatch } from 'react-redux';
import getLocalStore from '../../core/getLocalStore';

function AppleSignInButton({onUserSignIn}) {
  const dispatch = useDispatch()
  const options = {
    clientId: import.meta.env.VITE_APPLE_CLIENT_ID, // TODO: Replace with your Apple Service ID
    redirectURI: Enviroment.redirectUrl, // TODO: Replace with your redirect URI
    scopes: 'email name',
    state: '12345',
    nonce: 'nonce',
  };

  const handleAppleSignIn = () => {
    SignInWithApple.authorize(options)
      .then(result => {
        onUserSignIn({idToken:result.response.identityToken,email:result.response.email})

      },err=>{
//       
      })
      .catch(error => {
        console.error('Apple sign-in error:', error);
        // TODO: Handle error (show message to user, etc.)
      });
  };
  const idToken = getLocalStore("token")

   return !idToken?<IonButton onClick={handleAppleSignIn} expand="block" color="dark" className='rounded-full'>
      <IonIcon slot="start" name="logo-apple" />
      Sign in with Apple
    </IonButton>:null

}

export default AppleSignInButton;
