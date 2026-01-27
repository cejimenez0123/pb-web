import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);
};

export const sendGAEvent = (eventName, params = {}) => {
  if (import.meta.env.VITE_NODE_ENV !== "dev") {
    ReactGA.event(eventName, {
      ...params,
    });
  }
};
