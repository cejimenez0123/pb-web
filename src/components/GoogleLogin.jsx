import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { useNavigate } from 'react-router-dom';
import { logIn } from '../actions/UserActions';
import Paths from '../core/paths';

export default function GoogleLogin({ onUserSignIn }) { 
    const [gisLoaded, setGisLoaded] = useState(false);

    const [signedIn, setSignedIn] = useState(false); // Internal state for this component's UI
    const driveTokenKey = "googledrivetoken"; // Consistent key for Drive access token
    const navigate = useNavigate()
    const dispatch = useDispatch(); // Initialize useDispatch hook

    // Replace with your actual Client ID
    const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;

    // Combined scopes: basic user info + Drive access
    const LOGIN_SCOPES = 'email profile openid https://www.googleapis.com/auth/drive.readonly';

    // Function to load the Google Identity Services (GIS) script
    const loadGisScript = () => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;

        script.onload = () => {
            setGisLoaded(true);
            console.log("Google Identity Services script loaded for login.");
        };
        script.onerror = (error) => {
            console.error("Failed to load Google Identity Services script:", error);
        };
        document.body.appendChild(script);

        // Cleanup function for the effect
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    };
    useLayoutEffect(()=>{
        if (!window.google || !window.google.accounts) {
            loadGisScript();
        } else {
            setGisLoaded(true); // GIS already loaded by another component or previous run
        }
    },[])
    // Main useEffect for managing GIS loading and login state
    useEffect(() => {
        // Load GIS script if not already loaded
        

        // This block runs once GIS is loaded
        if (gisLoaded && window.google && window.google.accounts && window.google.accounts.id) {
            const storedEmail = localStorage.getItem('userEmail');
            const storedName = localStorage.getItem('userName');
            const storedGoogleId = localStorage.getItem('googleId');
            const storedDriveToken = localStorage.getItem(driveTokenKey);
            const storedDriveTokenExpiry = localStorage.getItem('googledrivetoken_expiry');

            const isTokenValid = storedDriveToken && storedDriveTokenExpiry && Date.now() < parseInt(storedDriveTokenExpiry, 10);

            // --- Handle already signed-in user ---
            if (storedEmail && storedGoogleId && isTokenValid) {
                dispatch(logIn({email:storedEmail,uId:storedGoogleId})).then(res=>{ checkResult(res,payload=>{
                    setPending(false)
                    setSignedIn(true);
                    if(payload.error){
                        setLogInError("Error with Username or Password")
                    }else{
                        navigate(Paths.myProfile())
                    }
                },err=>{
                    if(err.message=="Request failed with status code 401"){
setLogInError("User Not Found. Apply Below")
                    }else{
                        setLogInError(err.message)
                    }
                    setPending(false)
                })
            })  
                // Update component's internal state
                // setUserEmail(storedEmail);
                // setUserName(storedName);
                // setGoogleId(storedGoogleId);
         

                console.log("User found in localStorage. Dispatching login action...");
               
                console.log("Dispatching login with:", { googleId: storedGoogleId, accessToken: storedDriveToken });
       

                // Notify parent component about the user's status
                if (onUserSignIn) {
                    dispatch(logIn({email:storedEmail,uId:storedGoogleId})).then(res=>{ checkResult(res,payload=>{
                        setPending(false)
                        setSignedIn(true);
                        if(payload.error){
                            setLogInError("Error with Username or Password")
                        }else{
                            navigate(Paths.myProfile())
                        }
                    },err=>{
                        if(err.message=="Request failed with status code 401"){
    setLogInError("User Not Found. Apply Below")
                        }else{
                            setLogInError(err.message)
                        }
                        setPending(false)
                    })})
                    onUserSignIn({ email: storedEmail, name: storedName, googleId: storedGoogleId, driveAccessToken: storedDriveToken });
                }
                return; // Exit as user is already logged in
            }

            // --- If not signed in via localStorage, render the Google Sign-In button ---
            // Initialize the Google Identity Services client for the visible button (ID Token)
            window.google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: handleCredentialResponse, // Callback for ID Token
                auto_select: false, // Prevents auto-login on every page load unless explicitly configured
                cancel_on_tap_outside: true,
            });

            // Render the Google Sign-In button
            window.google.accounts.id.renderButton(
                document.getElementById('google-sign-in-button'),
                {
                    theme: "outline",
                    size: "large",
                    text: "signin_with",
                    borderRadius:"10%",
                    // shape: "rectangular",
                    width: "250",
                    logo_alignment: "left"
                }
            );

            // Important: If a token exists but is expired, clear it
            if (storedDriveToken && storedDriveTokenExpiry && !isTokenValid) {
                console.log("Stored Drive token expired. Clearing from localStorage.");
                localStorage.removeItem(driveTokenKey);
                localStorage.removeItem('googledrivetoken_expiry');
            }
        }
    }, [gisLoaded]); // Added dispatch to dependency array

    // Callback for the Google Sign-In button (ID Token)
    const handleCredentialResponse = (response) => {
        if (response.credential) {
            try {
                const decodedToken = parseJwt(response.credential);

                if (decodedToken) {
                    // Update internal state immediately after ID Token processing
                   
                    setSignedIn(true); // Update UI state to show logged-in view

                    // Store basic user info in localStorage
                    localStorage.setItem('userEmail', decodedToken.email);
                    localStorage.setItem('userName', decodedToken.name || decodedToken.given_name);
                    localStorage.setItem('googleId', decodedToken.sub);

                    console.log("User signed in (ID Token processed). Now requesting access token for Drive...");
                    // Proceed to request access token with Drive scopes
                    requestDriveAccessToken(decodedToken.sub, decodedToken.email, decodedToken.name || decodedToken.given_name);
                  
                }
            } catch (error) {
                console.error("Error decoding ID token or processing sign-in:", error);
            }
        } else {
            console.error("Sign-in failed: No credential received from ID token response.", response);
        }
    };

    // Function to request the access token with Drive scopes
    const requestDriveAccessToken = (id, email, name) => {
        if (window.google && window.google.accounts && window.google.accounts.oauth2) {
            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: LOGIN_SCOPES, // Use the combined scopes here
                callback: (tokenResponse) => {
                    if (tokenResponse.access_token) {
                        const driveAccessToken = tokenResponse.access_token;
                        const expiryMs = Date.now() + (parseInt(tokenResponse.expires_in, 10) * 1000);

                        // Store Drive access token and expiry in localStorage
                        localStorage.setItem(driveTokenKey, driveAccessToken);
                        localStorage.setItem("googledrivetoken_expiry", expiryMs.toString());
                        console.log("Drive-scoped access token obtained and stored.");

                        // Dispatch Redux login action after getting all necessary info
                        // Replace with your actual dispatch call:
                        console.log("Dispatching login after new access token:", { googleId: id, accessToken: driveAccessToken });
                        // dispatch(loginUser({ googleId: id, accessToken: driveAccessToken, email: email, name: name }));

                        // Notify parent component of complete login
                        if (onUserSignIn) {
                            onUserSignIn({
                                email: email,
                                name: name,
                                googleId: id,
                                driveAccessToken: driveAccessToken,
                            });
                        }
                    } else {
                        console.error("Failed to get Drive-scoped access token:", tokenResponse);
                        alert("Access to Google Drive was not granted. Drive picker will not work.");
                        // Notify parent about basic login, but without Drive token
                        if (onUserSignIn) {
                            onUserSignIn({
                                email: email,
                                name: name,
                                googleId: id,
                                driveAccessToken: null, // Explicitly null if permission denied
                            });
                        }
                    }
                },
            });
            client.requestAccessToken(); // This will show the combined consent screen if not already granted
        } else {
            console.error("GIS OAuth2 client not available for access token request.");
        }
    };

    // Helper function to decode a JWT (ID Token)
    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            console.error("Invalid JWT token:", e);
            return null;
        }
    };

    const handleSignOut = () => {
        window.google.accounts.id.disableAutoSelect(); // Clears GIS cookie for auto-login
        // Clear all stored items related to login and drive token
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('googleId');
        localStorage.removeItem(driveTokenKey);
        localStorage.removeItem('googledrivetoken_expiry');

        // Reset component's internal state
        
        setSignedIn(false);

        // Notify parent component about sign out
        if (onUserSignIn) {
            onUserSignIn(null); // Indicate user signed out
        }
        console.log("User signed out.");
    };

    return (
        <div>
            {!gisLoaded && <p>Loading Google Sign-In...</p>}

            {!signedIn ? (
                // This div will be replaced by the Google Sign-In button
                <div id="google-sign-in-button"  style={{ display: gisLoaded ? 'block' : 'none' }}></div>
            ) : null}
        </div>
    );
}
