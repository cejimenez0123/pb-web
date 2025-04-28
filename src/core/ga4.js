import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);
};

export const sendGAEvent = (eventCategory, eventAction, eventLabel = "", value = 0,nonInteraction=false) => {
  if(import.meta.env.VITE_NODE_ENV!="dev"){
  ReactGA.event({
    category: eventCategory,
    action: eventAction,
    label: eventLabel,
    value: value,
    nonInteraction:nonInteraction
  });}
};
