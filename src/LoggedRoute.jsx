import { Navigate } from "react-router-dom";

const LoggedRoute = ({ profile, children }) => {
 
    return profile? children : <Navigate to="/profile/home" />;
  };
  export default LoggedRoute