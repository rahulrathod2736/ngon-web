import React from "react";
import { Navigate, Route } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { getProfile, setToken } from "../redux/userReducer";

export const PrivateRoutes = ({ children, ...rest }: any) => {
  const { authToken, userProfile } = useAppSelector(
    (state: RootState) => state.user
  );
  const authLocalToken = localStorage.getItem("ngon:token");
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (
      (authToken || authLocalToken) &&
      Object.keys(userProfile).length === 0
    ) {
      dispatch(getProfile({}));
      dispatch(setToken(authToken || authLocalToken));
    }
  }, [authLocalToken, authToken]);

  return authLocalToken || authToken ? children : <Navigate to="/login" />;
};
