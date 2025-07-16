import React, { useState, useEffect, useRef } from 'react';

import { useDispatch } from 'react-redux';
import { createStory } from '../actions/StoryActions';
import checkResult from '../core/checkResult';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Context from "../context"
import Paths from '../core/paths';
import { PageType } from '../core/constants';
export default function GoogleDrivePicker({ onFilePicked }) {
    const [gapiLoaded, setGapiLoaded] = useState(false);
    const [gisLoaded, setGisLoaded] = useState(false);
    const pickerApiLoaded = useRef(false);
    const {currentProfile}=useContext(Context)
    const accessToken = useRef(null);
    const gapiInited = useRef(false);
    const gisInited = useRef(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    // Replace with your actual Client ID from Google API Console
    const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
    // const DEVELOPER_KEY = import.meta.env.VITE_DEV_KEY; // Only needed if you're using the old discovery docs directly, often not needed for Picker

    // Scopes required for Google Drive access
    const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

    useEffect(() => {
        const loadGapi = () => {
            window.gapi.load('client:picker', () => {
                // window.gapi.client.setApiKey(DEVELOPER_KEY); // Set API key if using non-authenticated API calls or certain discovery docs
                window.gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest')
                    .then(() => {
                        gapiInited.current = true;
                        setGapiLoaded(true);
                        maybeEnablePicker();
                    })
                    .catch(err => console.error("Error loading gapi client:", err));
            });
        };

        const loadGis = () => {
            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: (tokenResponse) => {
                    if (tokenResponse.access_token) {
                        accessToken.current = tokenResponse.access_token;
                        localStorage.setItem("googledrivetoken",tokenResponse.access_token)
                        gisInited.current = true;
                        setGisLoaded(true);
                        maybeEnablePicker();
                    } else {
                        console.error("Failed to get access token:", tokenResponse);
                    }
                },
            });
            client.requestAccessToken(); // Request token immediately or on user action
        };

        const scriptGapi = document.createElement('script');
        scriptGapi.src = 'https://apis.google.com/js/api.js';
        scriptGapi.onload = loadGapi;
        document.body.appendChild(scriptGapi);

        const scriptGis = document.createElement('script');
        scriptGis.src = 'https://accounts.google.com/gsi/client';
        if(!(localStorage.getItem("googledrivetoken")&&localStorage.getItem("googledrivetoken").length>0)){
        scriptGis.onload = loadGis;
        document.body.appendChild(scriptGis);

        return () => {
            // Cleanup scripts if component unmounts
            document.body.removeChild(scriptGapi);
            document.body.removeChild(scriptGis);
        };
    }
    }, []);

    const maybeEnablePicker = () => {
        if (gapiInited.current && gisInited.current && !pickerApiLoaded.current) {
            pickerApiLoaded.current = true;
            // The picker API itself is loaded with 'client:picker' in gapi.load
        }
    };

    const createPicker = () => {
        if (!gapiLoaded || !gisLoaded || !accessToken.current) {
            console.log("Google API scripts not loaded or not authenticated yet.");
            return;
        }

        const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS)
            .setMimeTypes('application/vnd.google-apps.document') // Example: filter for images and PDFs
            .setSelectFolderEnabled(true); // Allow selecting folders

        const picker = new window.google.picker.PickerBuilder()
            .setAppId(CLIENT_ID.split('.')[0]) // App ID is usually the first part of CLIENT_ID
            .setOAuthToken(accessToken.current)
            .addView(view)
            .addView(new window.google.picker.DocsUploadView()) // Option to upload files
            // .setDeveloperKey(DEVELOPER_KEY) // Important for picker
            .setCallback(pickerCallback)
            .build();

        picker.setVisible(true);
    };

    const pickerCallback = (data) => {
        if (data.action === window.google.picker.Action.PICKED) {
            const file = data.docs[0];
            
            console.log('File picked:', file);
            
                if (file.mimeType === 'application/vnd.google-apps.document') {
                    fetchGoogleDocContent(file);
                    
                
            }
        // }
        }}
    const fetchGoogleDocContent = async (file) => {
        try {
            // Use gapi.client.drive.files.export to get the content as plain text
            const response = await window.gapi.client.drive.files.export({
                fileId: file.id,
                mimeType: 'text/html' // Request plain text
            });

            const textContent = response.body; // The text content is in the response body
            console.log('Google Doc Text Content:', textContent);
            console.log(textContent)
            // if (onTextContentFetched) {
               dispatch(createStory({profileId:currentProfile.id,
                data:textContent,
                isPrivate:true,
                approvalScore:0,
                type:PageType.text,
                title:file.name,
                commentable:false})).then(res=>checkResult(res,({story})=>{
                    navigate(Paths.page.createRoute(story.id))
                },err=>{
                    console.log(err)
                }))
              
            // }

        } catch (error) {
            console.error('Error fetching Google Doc content:', error);
            // Handle specific errors, e.g., permissions issues
            if (error.result && error.result.error) {
                console.error('API Error details:', error.result.error.message);
            }
        }
    };
    return (
        <div>
            {/* <h1>Google Drive Picker</h1> */}
            {gapiLoaded && gisLoaded && accessToken.current ? (
                <button onClick={createPicker}>Open Google Drive Picker</button>
            ) : (
                <p>Loading Google APIs and authenticating...</p>
            )}
        </div>
    );
};

