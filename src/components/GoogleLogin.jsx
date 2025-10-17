

import React, { useState, useEffect, useLayoutEffect, useContext, useRef } from 'react';
import { IonText, IonSpinner, IonButton, IonImg, IonRow } from '@ionic/react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { logIn } from '../actions/UserActions';
import Paths from '../core/paths';
import DeviceCheck from './DeviceCheck';
import checkResult from '../core/checkResult';
import Context from '../context';
import { Preferences } from '@capacitor/preferences';
import Googlelogo from "../images/logo/googlelogo.png"
export default function GoogleLogin({ drive,onUserSignIn }) {
  const { isError } = useContext(Context);
  const [pending, setPending] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [gisLoaded, setGisLoaded] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [idToken, setIdToken] = useState(null);

  const isNative = DeviceCheck();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const googleButtonRef = useRef(null);

  const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;

  const IOS_CLIENT_ID = import.meta.env.VITE_IOS_CLIENT_ID;

  const driveTokenKey = 'googledrivetoken';

  // ---------------------------
  // 1️⃣ Initialize for mobile
  // ---------------------------
  useLayoutEffect(() => {

      SocialLogin.initialize({
        google: {
          webClientId: CLIENT_ID,
          iOSClientId: IOS_CLIENT_ID,
          iOSServerClientId: CLIENT_ID,
     
          mode: 'online',
        },
      }).catch(err => console.error('SocialLogin init error:', err));
    
  }, [isNative, CLIENT_ID, IOS_CLIENT_ID]);

  // ---------------------------
  // 2️⃣ Load GIS script (for web)
  // ---------------------------
  useLayoutEffect(() => {
    if (!isNative && !window.google?.accounts) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => setGisLoaded(true);
      script.onerror = () => setLoginError('Failed to load Google Sign-In script');
      document.body.appendChild(script);
    } else if (!isNative) {
      setGisLoaded(true);
    }
  }, [isNative]);

  // ---------------------------
  // 3️⃣ Restore previous session
  // ---------------------------
  useEffect(() => {
    const loadStoredUser = async () => {
      setPending(true);
      try {
        const [email, name, googleId, driveToken, expiry, idToken] = await Promise.all([
          Preferences.get({ key: 'userEmail' }),
          Preferences.get({ key: 'userName' }),
          Preferences.get({ key: 'googleId' }),
          Preferences.get({ key: driveTokenKey }),
          Preferences.get({ key: 'googledrivetoken_expiry' }),
          Preferences.get({ key: 'googleIdToken' }),
        ]);
console.log(email)
console.log(googleId)
        const valid = driveToken.value && expiry.value && Date.now() < parseInt(expiry.value, 10);
        if (email.value!="undefined" && googleId.value !="undefined"&& valid!="undefined") {
          setAccessToken(driveToken.value);
          setIdToken(idToken.value);
          const info = { email: email.value, name: name.value, googleId: googleId.value,uId:googleId.value };
          setUserInfo(info);
          setSignedIn(true);
          onUserSignIn?.({email: email.value, name: name.value, googleId: googleId.value, driveAccessToken: driveToken.value, idToken: idToken.value });
          // if (location.pathname === '/login') navigate(Paths.myProfile());
        }
      } catch (e) {
        console.error('Error loading stored user:', e);
      } finally {
        setPending(false);
      }
    };
    loadStoredUser();
  }, [location, navigate, onUserSignIn]);

  // ---------------------------
  // 4️⃣ Native (mobile) login
  // ---------------------------
  const nativeGoogleSignIn = async () => {
     await SocialLogin.logout({ provider: 'google' });
    setPending(true);
    setLoginError(null);
    try {
      const user = await SocialLogin.login({
        provider: 'google',
        options: { scopes: ['email', 'profile', 'https://www.googleapis.com/auth/drive.readonly'] },
      });
      if (!user) throw new Error('No user data returned.');
      let {accessToken,idToken,profile}=user.result
      console.log("VDFF",user.result)
      console.log("VDFF",profile.id)
      const expiry = Date.now() + 3600 * 1000;
      await Promise.all([
        Preferences.set({ key: 'userEmail', value: profile.email }),
        Preferences.set({ key: 'userName', value:profile.name }),
        Preferences.set({ key: 'googleId', value: profile.id }),
        Preferences.set({ key: 'googleIdToken', value:idToken || '' }),
        Preferences.set({ key: driveTokenKey, value:accessToken || '' }),
        Preferences.set({ key: 'googledrivetoken_expiry', value: expiry.toString() }),
      ]);

      const info = { email: profile.email, name: profile.name, googleId: profile.id };
      console.log("DDF",idToken)
      setUserInfo(info);
      setAccessToken(accessToken);
      setIdToken(idToken);
      setSignedIn(true);

      onUserSignIn({ email: profile.email, name: profile.name, googleId: profile.id ,driveAccessToken: accessToken, idToken: idToken });

      const res = dispatch(logIn({ email: profile.email, uId: profile.id, isNative }));
      // checkResult(res, () => navigate(Paths.myProfile()));
    } catch (err) {
      console.error('Native sign-in error', err);
      setLoginError('Google Sign-In failed. ' + JSON.stringify(err));
    } finally {
      setPending(false);
    }
  };

  // ---------------------------
  // 5️⃣ Web login setup
  // ---------------------------
  useEffect(() => {
    if (!isNative && gisLoaded && window.google?.accounts && !signedIn) {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          width: 240,
        });
      }
    }
  }, [isNative, gisLoaded, signedIn, CLIENT_ID]);

  // ---------------------------
  // 6️⃣ Handle web credential
  // ---------------------------
  const handleCredentialResponse = async (response) => {
    if (!response.credential) return setLoginError('No credential received.');

    try {
      const decoded = JSON.parse(atob(response.credential.split('.')[1]));
      const info = {
        email: decoded.email,
        name: decoded.name || decoded.given_name,
        googleId: decoded.sub,
      };
      await Promise.all([
        Preferences.set({ key: 'userEmail', value: info.email }),
        Preferences.set({ key: 'userName', value: info.name }),
        Preferences.set({ key: 'googleId', value: info.googleId }),
        Preferences.set({ key: 'googleIdToken', value: response.credential }),
      ]);

      setIdToken(response.credential);
      setUserInfo(info);
      setSignedIn(true);

      // Request Drive access
      if (window.google?.accounts?.oauth2) {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/drive.readonly',
          callback: async (tokenResponse) => {
            if (tokenResponse.access_token) {
              const expiryMs = Date.now() + tokenResponse.expires_in * 1000;
              await Preferences.set({ key: driveTokenKey, value: tokenResponse.access_token });
              await Preferences.set({ key: 'googledrivetoken_expiry', value: expiryMs.toString() });
              setAccessToken(tokenResponse.access_token);

              onUserSignIn?.({
                ...info,
                driveAccessToken: tokenResponse.access_token,
                idToken: response.credential,
              });

              const res = dispatch(logIn({ email: info.email, uId: info.googleId, isNative }));
              // checkResult(res, () => navigate(Paths.myProfile()));
            } else {
              setLoginError('Failed to get Google Drive token.');
            }
          },
        });
        tokenClient.requestAccessToken();
      }
    } catch (e) {
      console.error('Web login error:', e);
      setLoginError('Invalid ID token.');
    }
  };

  // ---------------------------
  // 7️⃣ UI
  // ---------------------------
  return (
    <div className="flex flex-col justify-center items-center w-full min-h-full">
   
             <>
         
          <div  onClick={nativeGoogleSignIn} color="dark" 
          className='bg-gray-200 btn rounded-full flex h-[4rem] text-white w-[10rem] mt-8'>
             <IonRow><IonImg src={Googlelogo} className='max-h-5 max-w-5' /><IonText className='text-black'> {drive?"Access your google drive":"Sign in"}</IonText></IonRow>
              </div>
        </>

      {loginError && (
        <IonText color="danger" className="mt-3">
          {loginError}
        </IonText>
      )}
    </div>
  );
}
