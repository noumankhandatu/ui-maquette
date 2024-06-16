import { Navigate } from "react-router-dom";

import Main from "../components/layout/Main";

export const Authorized = () => {
  const token = localStorage.getItem("token");
  
  /* eslint-disable */
  if (token) {
    return <Main />;
  } else {
    return <Navigate to="/sign-in" />;
  }
  /* eslint-enable */
};
