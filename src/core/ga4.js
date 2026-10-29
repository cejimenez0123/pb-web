

import ReactGA from "react-ga4";

let isInitialized = false;

export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId || isInitialized) {
    return;
  }

  if (typeof ReactGA.initialize !== "function") {
    console.error("react-ga4 initialize API is unavailable.", ReactGA);
    return;
  }

  ReactGA.initialize(measurementId);
  isInitialized = true;
};

export const sendGAEvent = (eventName, params = {}) => {
  // Do not send analytics events during development.
  if (!import.meta.env.PROD || !isInitialized) {
    return;
  }

  if (typeof ReactGA.event !== "function") {
    console.error("react-ga4 event API is unavailable.", ReactGA);
    return;
  }

  try {
    ReactGA.event(eventName, params);
  } catch (error) {
    // Analytics should never interrupt normal app interactions.
    console.error("Failed to send Google Analytics event:", error);
  }
};
