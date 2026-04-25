import Enviroment from "./Enviroment";


const getDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

const getBackground = () => {
  const isDark = getDark();
  document.documentElement.style.setProperty(
    '--background',
    isDark
      ? Enviroment.palette.base.bgDark ?? Enviroment.palette.base.surfaceDark
      :Enviroment.palette.cream
  );
};
export default getBackground
const watchBackground = () => {
  getBackground(); // apply immediately
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', getBackground);
};

export {watchBackground };