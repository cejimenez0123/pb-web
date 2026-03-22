import { useEffect, useState, useContext } from "react";
import { IonImg, useIonRouter } from "@ionic/react";
import { Preferences } from "@capacitor/preferences";
import loading from "./images/loading.gif";
import Paths from "./core/paths";
import Context from "./context";
import { useDispatch } from "react-redux";
import { getCurrentProfile } from "./actions/UserActions";
import { useSelector } from "react-redux";
import checkResult from "./core/checkResult";

const PrivateRoute = ({ children }) => {
  const router = useIonRouter();
  const dispatch = useDispatch();
  const { setError } = useContext(Context) || {};
  const [token, setToken] = useState(undefined);
  const {currentProfile}=useSelector(state=>state.users)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { value: tok } = await Preferences.get({ key: "token" });
        
        if (!tok) {
          setToken(null);
          router.push(Paths.login(), "forward", "replace");
        } else {
          setToken(tok);
          console.log(router.routeInfo.pathname)
         !router.routeInfo.pathname.includes("/signup") && dispatch(getCurrentProfile()).then(res=>{
            console.log("L",router.routeInfo.pathname)
            checkResult(res,payload=>{
                console.log(router.routeInfo.pathname)
console.log("DSDS")
            },err=>{
            if(router.routeInfo.pathname.includes("/signup")){
console.log("DSDS")
            }else{
              // if(router.routeInfo.pathname.includes("/signup")||router.routeInfo.pathname.includes("/profile")){

                if(router.routeInfo.pathname.includes("/profile")&&!currentProfile){
                  Preferences.get("token").then(token=>{
                   if(!token.value){
                    router.goBack()
                   }
                  })
                
                }
              }
           

            
            })
          })
        }
      } catch (err) {
        console.error("Error reading token:", err);
        setError?.("Error checking login state");
        setToken(null);
        router.push(Paths.login(), "forward", "replace");
      }
    };

    checkAuth();
  }, []); // <--- EMPTY ARRAY: Ensures this only runs once on mount

  // 🌀 Show loading while token is undefined
  if (token === undefined || token=="undefined") {
    return (
      <div className="flex">
        <IonImg className="mx-auto my-24 max-h-36 max-w-36" src={loading} />
      </div>
    );
  }

  // If token is null, we are redirecting, so return null or an empty fragment
  if (!token) return null;

  return <>{children}</>;
};

export default PrivateRoute;