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
import { IonText } from '@ionic/react';

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
                <div className='btn bg-emerald-700 rounded-full border-emerald-600 mont-medium flex text-center w-[90%] h-[3rem]   '>
                <IonText class="mx-auto text-white my-auto text-[1rem] " onClick={createPicker}>Open Google Drive</IonText>
            </div>) : (
                <p>Loading Drive Picker, please ensure you are logged in...</p>
            )}
        </div>
    );
}