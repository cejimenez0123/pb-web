import { useIonRouter } from "@ionic/react";
import { useDispatch } from "react-redux";
import Paths from "./paths";

export default function useNavbarNavigation() {
  const router = useIonRouter();
  const dispatch = useDispatch();

  const navigate = (path, direction = 'forward') => {
    router.push(path, direction);
  };

  const handleSearch = () => {
    navigate('/search', 'forward');
  };

  const handleWrite = () => {
    navigate(Paths.write, 'forward');
  };

  const handleHome = () => {
    navigate(Paths.home, 'root');
  };

  const handleDiscover = () => {
    navigate(Paths.discovery, 'forward');
  };

  const handleEvents = () => {
    navigate(Paths.calendar(), 'forward');
  };

  const handleProfile = () => {
    navigate(Paths.myProfile, 'root');
  };

  const handleAbout = () => {
    navigate(Paths.about(), 'forward');
  };
 const handleLogin = () => {
    navigate(Paths.login, 'forward');
  };
  return {
    router,
    dispatch,
    navigate,
    handleSearch,
    handleWrite,
    handleHome,
    handleDiscover,
    handleEvents,
    handleProfile,
    handleAbout,
    handleLogin
  };
}