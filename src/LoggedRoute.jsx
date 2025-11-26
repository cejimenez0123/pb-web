import { Navigate, useNavigate, } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Preferences } from "@capacitor/preferences";
import Paths from "./core/paths";
import Context from "./context";

const LoggedRoute = ({ currentProfile,children }) => {
  const navigate = useNavigate();
  const { setError } = useContext(Context) || {};
  const [token, setToken] = useState(undefined); 
  useEffect(() => {

Preferences.get({ key: "token" }).then(store=>{
    if(store.value){
      setToken(store.value)
  // navigate(Paths.myProfile())
    }
  })
      
  }, [navigate]);

  // 🌀 Show loading indicator while verifying token

  return children;
};

export default LoggedRoute
