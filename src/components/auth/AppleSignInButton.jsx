import React from 'react';
import { SignInWithApple } from '@capacitor-community/apple-sign-in';
import { IonButton, IonIcon } from '@ionic/react';
import Enviroment from '../../core/Enviroment';

function AppleSignInButton() {
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
        console.log('Apple sign-in success:', result);
        // TODO: Handle user info, validate token with your backend, create session
      })
      .catch(error => {
        console.error('Apple sign-in error:', error);
        // TODO: Handle error (show message to user, etc.)
      });
  };

  return (
    <IonButton onClick={handleAppleSignIn} expand="block" color="dark">
      <IonIcon slot="start" name="logo-apple" />
      Sign in with Apple
    </IonButton>
  );
}

export default AppleSignInButton;
