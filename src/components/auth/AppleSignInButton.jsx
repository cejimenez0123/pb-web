import React from 'react';
import { SignInWithApple } from '@capacitor-community/apple-sign-in';
import { IonText } from '@ionic/react';
import Enviroment from '../../core/Enviroment';
function AppleSignInButton({onUserSignIn}) {

  const options = {
    clientId: import.meta.env.VITE_APPLE_CLIENT_ID, 
    redirectURI: Enviroment.redirectUrl, 
    scopes: 'email name',
    state: '12345',
    nonce: 'nonce',
  };

  const handleAppleSignIn = () => {
    SignInWithApple.authorize(options)
      .then(result => {
        onUserSignIn({idToken:result.response.identityToken,email:result.response.email})

      },err=>{
        prompt("1"+JSON.stringify(err))
        console.error('Apple sign-in error1:', err);
      })
      .catch(error => {
        prompt("2"+JSON.stringify(error))
        console.error('Apple sign-in error:', error);
        // TODO: Handle error (show message to user, etc.)
      });
  };


   return <div onClick={handleAppleSignIn}  color="dark" 
className='bg-black btn rounded-full flex h-[4rem] text-white w-[10rem] mt-8'>
      <IonText className='mx-auto my-auto'>Sign in with Apple</IonText>
    </div>

}

export default AppleSignInButton;
