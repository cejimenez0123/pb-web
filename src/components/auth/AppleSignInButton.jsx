import React from 'react';
import { SignInWithApple } from '@capacitor-community/apple-sign-in';
import { IonButton, IonIcon } from '@ionic/react';
import Enviroment from '../../core/Enviroment';
import { getIosInfo, logIn } from '../../actions/UserActions';
import { useDispatch } from 'react-redux';

function AppleSignInButton() {
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
        console.log('Apple sign-in success:', result);
        dispatch(logIn({idToken:result.response.identityToken})).then(res=>{ checkResult(res,payload=>{
          // setPending(false)
          // setSignedIn(true);
          // if(payload.error){
          //     setLogInError("Error with Username or Password")
          // }else{
          //     navigate(Paths.myProfile())
          // }
      },err=>{
//           if(err.message=="Request failed with status code 401"){
// setLogInError("User Not Found. Apply Below")
//           }else{
//               setLogInError(err.message)
//           }
          // setPending(false)
      })})
      //  dispatch(getIosInfo({identityToken:result.response.identityToken})).then(res=>
      //   console.log("DISPAtch")
      //  )
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
