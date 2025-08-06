import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
// Import the npm Apple Signin button
import AppleSignin from 'react-apple-signin-auth';

export default function AppleSignInButton({
  onSuccess = (res) => console.log('Apple Signin Success', res),
  onError = (err) => console.error('Apple Signin Error', err),
}) {
  // Placeholders: replace with your actual values
  const CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID="com.plumbum.app"; // Apple Service ID (Client ID)
  const REDIRECT_URI = 'https://plumbum.app/auth/callback'; // Must be configured at Apple
  const STATE = 'some_random_state_string'; // Optional, for validation/security
  const NONCE = 'unique_nonce_string'; // Optional

  return (
    <AppleSignin
      authOptions={{
        clientId: CLIENT_ID,        // REQUIRED
        scope: 'email name',        // Any or both of 'email name'
        redirectURI: REDIRECT_URI,  // REQUIRED
        state: STATE,               // Optional
        nonce: NONCE,               // Optional
        usePopup: true,             // Recommended for SPA/React
      }}
      uiType="dark"
      className="ion-margin-vertical" // Adds Ionic spacing
      noDefaultStyle={false}
      buttonExtraChildren="Sign in with Apple"
      onSuccess={onSuccess}
      onError={onError}
      skipScript={false} // will load the Apple JS SDK
      render={props => (
        <IonButton
          expand="block"
          color="dark"
          className="apple-auth-btn"
          onClick={props.onClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: 400,
            margin: '0 auto',
          }}
        >
          <IonIcon slot="start" name="logo-apple" />
          Sign in with Apple
        </IonButton>
      )}
    />
  );
}
