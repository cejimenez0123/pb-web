import { useNavigate, } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { IonImg } from "@ionic/react";
import { Preferences } from "@capacitor/preferences";
import loading from "./images/loading.gif";
import Paths from "./core/paths";
import Context from "./context";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const { setError } = useContext(Context) || {};
  const [token, setToken] = useState(undefined); 
  useEffect(() => {
    const checkAuth = async () => {
 
        const stored = await Preferences.get({ key: "token" });
        const tok = stored.value;

        if (!tok) {
            try {   
          navigate(Paths.login(), { replace: true });
          setToken(null);
          return;

      } catch (err) {
        console.error("Error reading token:", err);
        setError?.("Error checking login state");
        navigate(Paths.login(), { replace: true });
        setToken(null);
      }}else{
        setToken(tok)
      }
    };

    checkAuth();
  }, [navigate]);

  // 🌀 Show loading indicator while verifying token
  if (token === undefined) {
    return (
      <div className="flex">
        <IonImg className="mx-auto my-24 max-h-36 max-w-36" src={loading} />
      </div>
    );
  }
  return children;
};

export default PrivateRoute;
