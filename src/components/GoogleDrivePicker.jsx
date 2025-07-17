import React, { useState, useEffect, useRef, useCallback } from 'react';

// Assuming these imports are necessary for your application logic
import { useDispatch } from 'react-redux';
import { createStory } from '../actions/StoryActions';
import checkResult from '../core/checkResult';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Context from "../context";
import Paths from '../core/paths';
import { PageType } from '../core/constants';

export default function GoogleDrivePicker({ onFilePicked, onReauthenticateNeeded }) {
    const TOKEN_KEY = "googledrivetoken"; // Consistent key for localStorage
    const TOKEN_EXPIRY_KEY = "googledrivetoken_expiry"; // Key for expiry time

    const [gapiLoaded, setGapiLoaded] = useState(false); // Indicates gapi base library and picker client loaded
    const [driveClientLoaded, setDriveClientLoaded] = useState(false); // NEW: Indicates gapi.client.drive is loaded
    const [driveTokenAvailable, setDriveTokenAvailable] = useState(false); // To reflect if a usable token is found

    const { currentProfile } = useContext(Context);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
    // const DEVELOPER_KEY = import.meta.env.VITE_DEV_KEY; // Uncomment if you truly need a Developer Key for specific Picker configs

    // Helper to check if the stored token is expired
    const isTokenExpired = useCallback(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

        if (!storedToken || !storedExpiry) {
            return true; // No token or expiry means it's "expired" for practical purposes
        }

        const expiryTime = parseInt(storedExpiry, 10);
        return Date.now() >= expiryTime;
    }, []);

    // --- Script Loading and GAPI Client Initialization ---
    useEffect(() => {
        const loadGapi = () => {
            window.gapi.load('client:picker', () => {
                // Initialize the GAPI client library itself
                // window.gapi.client.init doesn't take a callback directly for discovery docs
                // Instead, we load individual APIs after client is initialized (or directly after client:picker)

                // Load the Drive API specifically
                window.gapi.client.load('drive', 'v3')
                    .then(() => {
                        setDriveClientLoaded(true); // NEW: Set this state to true
                        console.log("GAPI client for Drive (v3) loaded.");
                    })
                    .catch(err => console.error("Error loading gapi.client.drive:", err));

                // Set gapiLoaded after client:picker is available
                setGapiLoaded(true);
                console.log("GAPI client:picker module loaded.");
            });
        };

        // Check if GAPI is already loaded to prevent multiple script appends
        if (!window.gapi) {
            const scriptGapi = document.createElement('script');
            scriptGapi.src = 'https://apis.google.com/js/api.js';
            scriptGapi.onload = loadGapi;
            scriptGapi.onerror = (e) => console.error("Failed to load GAPI script:", e);
            document.body.appendChild(scriptGapi);

            return () => {
                // Cleanup script on unmount
                if (document.body.contains(scriptGapi)) {
                    document.body.removeChild(scriptGapi);
                }
            };
        } else {
            // GAPI is already loaded, just ensure clients are initiated if not already
            // This might happen if another component loads GAPI first
            loadGapi();
        }
    }, []); // Empty dependency array means this runs once on mount

    // --- Token Retrieval and State Update ---
    useEffect(() => {
        // This effect runs when component mounts and when driveClientLoaded changes
        // It's responsible for checking the token and updating state for the button
        if (driveClientLoaded) { // Only proceed if gapi.client.drive is available
            if (!isTokenExpired()) {
                setDriveTokenAvailable(true);
                console.log("Drive Picker: Token found and valid.");
            } else {
                setDriveTokenAvailable(false);
                console.log("Drive Picker: Token missing or expired. Reauthentication needed.");
                // Clear expired token from localStorage
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(TOKEN_EXPIRY_KEY);
                if (onReauthenticateNeeded) {
                    onReauthenticateNeeded(); // Notify parent that reauthentication is required
                }
            }
        }
    }, [driveClientLoaded, isTokenExpired, onReauthenticateNeeded]); // Dependency on driveClientLoaded

    const createPicker = () => {
        const storedToken = localStorage.getItem(TOKEN_KEY);

        // Ensure GAPI, Drive client, and a valid token are all available
        if (!gapiLoaded || !driveClientLoaded || !storedToken || isTokenExpired()) {
            console.error("Cannot create picker: APIs not fully loaded or Drive token missing/expired.");
            if (onReauthenticateNeeded) {
                onReauthenticateNeeded(); // Ask parent to handle re-login
            }
            return;
        }

        // Check if the picker namespace is available
        if (!window.google || !window.google.picker) {
             console.error("Google Picker API is not available on window.google.picker.");
             return;
        }

        const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS)
            .setMimeTypes('application/vnd.google-apps.document')
            .setSelectFolderEnabled(false);

        const picker = new window.google.picker.PickerBuilder()
            .setAppId(CLIENT_ID.split('.')[0]) // App ID from your CLIENT_ID
            .setOAuthToken(storedToken) // Use the token directly from localStorage
            .addView(view)
            // If you use DocsUploadView, ensure your token has 'https://www.googleapis.com/auth/drive.file' scope
            .addView(new window.google.picker.DocsUploadView())
            // .setDeveloperKey(DEVELOPER_KEY) // Uncomment if needed for your setup
            .setCallback(pickerCallback)
            .build();

        picker.setVisible(true);
    };

    const pickerCallback = (data) => {
        if (data.action === window.google.picker.Action.PICKED) {
            const file = data.docs[0];
            console.log('File picked:', file);

            if (onFilePicked) {
                onFilePicked(file); // Notify parent component about the picked file
            }

            if (file.mimeType === 'application/vnd.google-apps.document') {
                fetchGoogleDocContent(file);
            } else {
                console.log('Selected file is not a Google Doc, skipping text content fetch.');
            }
        }
    };

    const fetchGoogleDocContent = async (file) => {
        try {
            const storedToken = localStorage.getItem(TOKEN_KEY);
            if (!storedToken || isTokenExpired()) {
                console.error("Drive access token expired or not available. Cannot fetch content.");
                if (onReauthenticateNeeded) {
                    onReauthenticateNeeded();
                }
                return;
            }

            // Ensure gapi.client.drive is loaded before making the call
            if (!window.gapi || !window.gapi.client || !window.gapi.client.drive || !driveClientLoaded) {
                console.error("Google Drive API client (gapi.client.drive) not fully initialized or loaded.");
                return; // Prevent API call if client is not ready
            }

            const response = await window.gapi.client.drive.files.export({
                fileId: file.id,
                mimeType: 'text/html', // Request HTML content
                access_token: storedToken // Explicitly pass the access token
            });

            const htmlContent = response.body;
            console.log('Google Doc HTML Content:', htmlContent);

            // Dispatch your Redux action here
            dispatch(createStory({
                profileId: currentProfile.id,
                data: htmlContent,
                isPrivate: true,
                approvalScore: 0,
                type: PageType.text,
                title: file.name,
                commentable: false
            })).then(res => checkResult(res, ({ story }) => {
                navigate(Paths.page.createRoute(story.id));
            }, err => {
                console.error("Error creating story:", err);
            }));

        } catch (error) {
            console.error('Error fetching Google Doc content:', error);
            if (error.result && error.result.error) {
                console.error('API Error details:', error.result.error.message);
            }
        }
    };

    return (
        <div>
            {gapiLoaded && driveClientLoaded && driveTokenAvailable ? (
                <button onClick={createPicker}>Open Google Drive Picker</button>
            ) : (
                <p>Loading Drive Picker, please ensure you are logged in...</p>
            )}
        </div>
    );
}
// // import React, { useState, useEffect, useRef } from 'react';

// // import { useDispatch } from 'react-redux';
// // import { createStory } from '../actions/StoryActions';
// // import checkResult from '../core/checkResult';
// // import { useNavigate } from 'react-router-dom';
// // import { useContext } from 'react';
// // import Context from "../context"
// // import Paths from '../core/paths';
// // import { PageType } from '../core/constants';
// // export default function GoogleDrivePicker({ onFilePicked }) {
// //     const key="googledrivetoken"
// //     const [gapiLoaded, setGapiLoaded] = useState(false);
// //     const [gisLoaded, setGisLoaded] = useState(false);
// //     const pickerApiLoaded = useRef(false);
// //     const {currentProfile}=useContext(Context)
// //     const accessToken = useRef(null);
// //     const gapiInited = useRef(false);
// //     const gisInited = useRef(false);
// //     const dispatch = useDispatch()
// //     const navigate = useNavigate()
    
// //     // Replace with your actual Client ID from Google API Console
// //     const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
// //     // const DEVELOPER_KEY = import.meta.env.VITE_DEV_KEY; // Only needed if you're using the old discovery docs directly, often not needed for Picker

// //     // Scopes required for Google Drive access
// //     const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

// //     useEffect(() => {
// //         const loadGapi = () => {
// //             window.gapi.load('client:picker', () => {
// //                 // window.gapi.client.setApiKey(DEVELOPER_KEY); // Set API key if using non-authenticated API calls or certain discovery docs
// //                 window.gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest')
// //                     .then(() => {
// //                         gapiInited.current = true;
// //                         setGapiLoaded(true);
// //                         maybeEnablePicker();
// //                     })
// //                     .catch(err => console.error("Error loading gapi client:", err));
// //             });
// //         };

// //         const loadGis = () => {
// //             const client = window.google.accounts.oauth2.initTokenClient({
// //                 client_id: CLIENT_ID,
// //                 scope: SCOPES,
// //                 callback: (tokenResponse) => {
// //                     if (tokenResponse.access_token) {
// //                         accessToken.current = tokenResponse.access_token;
// //                         localStorage.setItem(key,tokenResponse.access_token)
// //                         gisInited.current = true;
// //                         setGisLoaded(true);
// //                         maybeEnablePicker();
// //                     } else {
// //                         console.error("Failed to get access token:", tokenResponse);
// //                     }
// //                 },
// //             });
// //             client.requestAccessToken(); // Request token immediately or on user action
// //         };

// //         const scriptGapi = document.createElement('script');
// //         scriptGapi.src = 'https://apis.google.com/js/api.js';
// //         scriptGapi.onload = loadGapi;
// //         document.body.appendChild(scriptGapi);

// //         const scriptGis = document.createElement('script');
// //         scriptGis.src = 'https://accounts.google.com/gsi/client';
// //         if(!(localStorage.getItem(key)&&localStorage.getItem(key).length>0)){
// //         scriptGis.onload = loadGis;
// //         document.body.appendChild(scriptGis);

// //         return () => {
// //             // Cleanup scripts if component unmounts
// //             document.body.removeChild(scriptGapi);
// //             document.body.removeChild(scriptGis);
// //         };
// //     }
// //     }, []);

// //     const maybeEnablePicker = () => {
// //         if (gapiInited.current && gisInited.current && !pickerApiLoaded.current) {
// //             pickerApiLoaded.current = true;
// //             // The picker API itself is loaded with 'client:picker' in gapi.load
// //         }
// //     };

// //     const createPicker = () => {
// //         // if (!gapiLoaded || !gisLoaded || !accessToken.current) {
// //         // //     console.log("Google API scripts not loaded or not authenticated yet.");
// //         // //     return;
// //         // }
// //         console.log(localStorage.getItem(key))
// //    if (localStorage.getItem(key)) {
// //             console.log("Google API scripts not loaded or not authenticated yet.");
// //             return;
// //         }
// //         const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS)
// //             .setMimeTypes('application/vnd.google-apps.document') // Example: filter for images and PDFs
// //             .setSelectFolderEnabled(true); // Allow selecting folders

// //         const picker = new window.google.picker.PickerBuilder()
// //             .setAppId(CLIENT_ID.split('.')[0]) // App ID is usually the first part of CLIENT_ID
// //             .setOAuthToken(accessToken.current)
// //             // .setOAuthToken(localStorage.getItem(key))
// //             .addView(view)
// //             .addView(new window.google.picker.DocsUploadView()) // Option to upload files
// //             // .setDeveloperKey(DEVELOPER_KEY) // Important for picker
// //             .setCallback(pickerCallback)
// //             .build();

// //         picker.setVisible(true);
// //     };

// //     const pickerCallback = (data) => {
// //         if (data.action === window.google.picker.Action.PICKED) {
// //             const file = data.docs[0];
            
// //             console.log('File picked:', file);
            
// //                 if (file.mimeType === 'application/vnd.google-apps.document') {
// //                     fetchGoogleDocContent(file);
                    
                
// //             }
// //         // }
// //         }}
// //     const fetchGoogleDocContent = async (file) => {
// //         try {
// //             // Use gapi.client.drive.files.export to get the content as plain text
// //             const response = await window.gapi.client.drive.files.export({
// //                 fileId: file.id,
// //                 mimeType: 'text/html' // Request plain text
// //             });

// //             const textContent = response.body; // The text content is in the response body
// //             console.log('Google Doc Text Content:', textContent);
// //             console.log(textContent)
// //             // if (onTextContentFetched) {
// //                dispatch(createStory({profileId:currentProfile.id,
// //                 data:textContent,
// //                 isPrivate:true,
// //                 approvalScore:0,
// //                 type:PageType.text,
// //                 title:file.name,
// //                 commentable:false})).then(res=>checkResult(res,({story})=>{
// //                     navigate(Paths.page.createRoute(story.id))
// //                 },err=>{
// //                     console.log(err)
// //                 }))
              
// //             // }

// //         } catch (error) {
// //             console.error('Error fetching Google Doc content:', error);
// //             // Handle specific errors, e.g., permissions issues
// //             if (error.result && error.result.error) {
// //                 console.error('API Error details:', error.result.error.message);
// //             }
// //         }
// //     };
// //     return (
// //         <div>
// //             {/* <h1>Google Drive Picker</h1> */}
// //             {localStorage.getItem(key)? (
// //                 <button onClick={createPicker}>Open Google Drive Picker</button>
// //             ) : (
// //                 <p>Loading Google APIs and authenticating...</p>
// //             )}
// //         </div>
// //     );
// // };

// import React, { useState, useEffect, useRef, useCallback } from 'react';

// // Assuming these imports are necessary for your application logic
// import { useDispatch } from 'react-redux';
// import { createStory } from '../actions/StoryActions';
// import checkResult from '../core/checkResult';
// import { useNavigate } from 'react-router-dom';
// import { useContext } from 'react';
// import Context from "../context";
// import Paths from '../core/paths';
// import { PageType } from '../core/constants';

// export default function GoogleDrivePicker({ onFilePicked, onReauthenticateNeeded }) {
//     const TOKEN_KEY = "googledrivetoken"; // Consistent key for localStorage
//     const TOKEN_EXPIRY_KEY = "googledrivetoken_expiry"; // Key for expiry time

//     const [gapiLoaded, setGapiLoaded] = useState(false);
//     const [driveTokenAvailable, setDriveTokenAvailable] = useState(false); // To reflect if a usable token is found
//     const pickerApiLoaded = useRef(false); // Indicates picker API itself is loaded
//     const gapiInited = useRef(false); // Indicates gapi client for drive is loaded

//     const { currentProfile } = useContext(Context);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
//     // const DEVELOPER_KEY = import.meta.env.VITE_DEV_KEY; // Uncomment if you truly need a Developer Key for specific Picker configs

//     // Helper to check if the stored token is expired
//     const isTokenExpired = useCallback(() => {
//         const storedToken = localStorage.getItem(TOKEN_KEY);
//         const storedExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

//         if (!storedToken || !storedExpiry) {
//             return true; // No token or expiry means it's "expired" for practical purposes
//         }

//         const expiryTime = parseInt(storedExpiry, 10);
//         return Date.now() >= expiryTime;
//     }, []);

//     // --- Script Loading (Only GAPI is needed here) ---
//     useEffect(() => {
//         const loadGapi = () => {
//             window.gapi.load('client:picker', () => {
//                 // If you uncomment DEVELOPER_KEY, set it here:
//                 // window.gapi.client.setApiKey(DEVELOPER_KEY);
//                 window.gapi.client.load('drive', 'v3') // Simplified load for Drive API v3
//                     .then(() => {
//                         gapiInited.current = true;
//                         setGapiLoaded(true);
//                         console.log("GAPI client for Drive loaded in Picker.");
//                         // The picker API itself is loaded with 'client:picker' in gapi.load
//                         pickerApiLoaded.current = true;
//                     })
//                     .catch(err => console.error("Error loading gapi client for Drive:", err));
//             });
//         };

//         const scriptGapi = document.createElement('script');
//         scriptGapi.src = 'https://apis.google.com/js/api.js';
//         scriptGapi.onload = loadGapi;
//         document.body.appendChild(scriptGapi);

//         return () => {
//             document.body.removeChild(scriptGapi);
//         };
//     }, []);

//     // --- Token Retrieval and State Update ---
//     useEffect(() => {
//         // This effect runs when component mounts and when gapiLoaded changes
//         // It's responsible for checking the token and updating state
//         if (gapiLoaded) { // Only proceed if GAPI is loaded, as we'll need it for API calls
//             if (!isTokenExpired()) {
//                 setDriveTokenAvailable(true);
//                 console.log("Drive Picker: Token found and valid.");
//             } else {
//                 setDriveTokenAvailable(false);
//                 console.log("Drive Picker: Token missing or expired. Reauthentication needed.");
//                 // Optionally clear expired token from localStorage
//                 localStorage.removeItem(TOKEN_KEY);
//                 localStorage.removeItem(TOKEN_EXPIRY_KEY);
//                 if (onReauthenticateNeeded) {
//                     onReauthenticateNeeded(); // Notify parent that reauthentication is required
//                 }
//             }
//         }
//     }, [gapiLoaded, isTokenExpired, onReauthenticateNeeded]);


//     const createPicker = () => {
//         const storedToken = localStorage.getItem(TOKEN_KEY);

//         // Ensure GAPI and Picker API are loaded, and a valid token is available
//         if (!gapiLoaded || !pickerApiLoaded.current || !storedToken || isTokenExpired()) {
//             console.error("Cannot create picker: APIs not fully loaded or Drive token missing/expired.");
//             if (onReauthenticateNeeded) {
//                 onReauthenticateNeeded(); // Ask parent to handle re-login
//             }
//             return;
//         }

//         const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS)
//             .setMimeTypes('application/vnd.google-apps.document')
//             .setSelectFolderEnabled(false); // Usually you don't export text from folders

//         const picker = new window.google.picker.PickerBuilder()
//             .setAppId(CLIENT_ID.split('.')[0]) // App ID from your CLIENT_ID
//             .setOAuthToken(storedToken) // Use the token directly from localStorage
//             .addView(view)
//             .addView(new window.google.picker.DocsUploadView()) // Option to upload files, needs drive.file scope typically
//             // .setDeveloperKey(DEVELOPER_KEY) // Uncomment if needed for your setup
//             .setCallback(pickerCallback)
//             .build();

//         picker.setVisible(true);
//     };

//     const pickerCallback = (data) => {
//         if (data.action === window.google.picker.Action.PICKED) {
//             const file = data.docs[0];
//             console.log('File picked:', file);

//             if (onFilePicked) {
//                 onFilePicked(file); // Notify parent component about the picked file
//             }

//             if (file.mimeType === 'application/vnd.google-apps.document') {
//                 fetchGoogleDocContent(file);
//             } else {
//                 console.log('Selected file is not a Google Doc, skipping text content fetch.');
//             }
//         }
//     };

//     const fetchGoogleDocContent = async (file) => {
//         try {
//             const storedToken = localStorage.getItem(TOKEN_KEY);
//             if (!storedToken || isTokenExpired()) {
//                 console.error("Drive access token expired or not available. Cannot fetch content.");
//                 if (onReauthenticateNeeded) {
//                     onReauthenticateNeeded();
//                 }
//                 return;
//             }

//             // Make sure gapi.client.drive is loaded before making the call
//             if (!window.gapi || !window.gapi.client || !window.gapi.client.drive) {
//                 console.error("Google Drive API client (gapi.client.drive) not initialized.");
//                 return;
//             }

//             const response = await window.gapi.client.drive.files.export({
//                 fileId: file.id,
//                 mimeType: 'text/html', // Request HTML content
//                 access_token: storedToken // Explicitly pass the access token
//             });

//             const htmlContent = response.body;
//             console.log('Google Doc HTML Content:', htmlContent);

//             // Dispatch your Redux action here
//             dispatch(createStory({
//                 profileId: currentProfile.id,
//                 data: htmlContent,
//                 isPrivate: true,
//                 approvalScore: 0,
//                 type: PageType.text,
//                 title: file.name,
//                 commentable: false
//             })).then(res => checkResult(res, ({ story }) => {
//                 navigate(Paths.page.createRoute(story.id));
//             }, err => {
//                 console.error("Error creating story:", err);
//             }));

//         } catch (error) {
//             console.error('Error fetching Google Doc content:', error);
//             if (error.result && error.result.error) {
//                 console.error('API Error details:', error.result.error.message);
//             }
//         }
//     };

//     return (
//         <div>
//             {gapiLoaded && driveTokenAvailable ? (
//                 <button onClick={createPicker}>Open Google Drive Picker</button>
//             ) : (
//                 <p>Loading Drive Picker, please ensure you are logged in...</p>
//             )}
//         </div>
//     );
// }