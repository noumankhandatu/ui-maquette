import { Navigate, useLocation } from "react-router-dom";

import Main from "../components/layout/Main";
import { logout } from "../utils/logout";

export const Authenticate = () => {
  const token = localStorage.getItem("token");
  const { pathname } = useLocation();

  if (pathname === "/log-out") {
    logout();
    return <Navigate to="/sign-in" />;
  } else {
    if (token) {
      return <Main />;
    } else {
      return <Navigate to="/sign-in" />;
    }
  }
};
