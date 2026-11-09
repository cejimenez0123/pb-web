import { useIonRouter } from "@ionic/react";
import { useDispatch } from "react-redux";
import Paths from "./paths";
import { useSelector } from "react-redux";

export default function useNavbarNavigation() {
  const router = useIonRouter();
  const dispatch = useDispatch();
const {currentProfile}= useSelector(state=>state.users)
  const navigate = (path, direction = "forward") => {
    router.push(path, direction);
  };
 const handleNotifications = () => navigate(Paths.notifications);
  const handleSearch = () => navigate("/search");
  const handleWrite = () => navigate(Paths.write);
  const handleHome = () => router.push("/");
  const handleDiscover = () => navigate(Paths.discovery);
  const handleEvents = () => navigate(Paths.calendar());
  const handleAbout = () => navigate(Paths.about());
  const handleLogin = () => navigate(Paths.login);

  const handleProfile = () => {


    router.push(
      Paths.myProfile,
 
    );
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
    handleLogin,
    handleNotifications
 
  };
}