import Enviroment from "./Enviroment";


const getDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

const getBackground = () => {
  const isDark = getDark();
  document.documentElement.style.setProperty(
    
    '--background',
    isDark
      ? Enviroment.palette.base.bgDark ?? Enviroment.palette.base.surfaceDark
      :Enviroment.palette.cream,
  );
      document.documentElement.style.setProperty("--padding-bottom","10em" )
};
const applyTheme = () => {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const watchBackground = () => {
  applyTheme();
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", applyTheme);
};


export default getBackground


export {watchBackground };