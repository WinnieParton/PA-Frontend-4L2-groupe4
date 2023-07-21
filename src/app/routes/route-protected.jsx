import React, { PropsWithChildren } from "react";
import { Navigate } from "react-router";

function getToken() {
  const tokenString = localStorage.getItem("auth");
  const userToken = JSON.parse(tokenString);
  // console.log(atob(userToken.token)) // Pour décoder la base64
  return userToken?.status;
}
const RouteProtected = ({ expectedRoles, children }) => {
  // const auth = true;

  if (!getToken()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RouteProtected;
