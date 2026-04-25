import Enviroment from "./Enviroment";

const getBackground = () => ({
  "--background": window.matchMedia('(prefers-color-scheme: dark)').matches
    ? Enviroment.palette.base.backgroundDark ?? Enviroment.palette.base.bg
    : Enviroment.palette.base.surface
});
export default getBackground