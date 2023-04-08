import React, { useState } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/home.page";
import { AssetUploadPage } from "./pages/assets-upload.page";
import { STRINGS } from "./utils/constants/strings";
import { DiscoverPage } from "./pages/discover.page";
import { LoginPage } from "./pages/login.page";
import { RegisterPage } from "./pages/register.page";
import { RootState, store, useAppSelector } from "./redux/store";
import { PrivateRoutes } from "./routes/privateRoutes";
import { AssetModelUpload } from "./pages/model-upload.page";
import { ProfilePage } from "./pages/profile.page";

function App() {
  const { authToken } = useAppSelector((state: RootState) => state.user);

  if (!authToken) {
    <Navigate to={"/login"} replace />;
  }

  return (
    <Routes>
      <Route
        path={STRINGS.NEW_ASSET_MODEL_UPLOAD_PATH}
        element={
          <PrivateRoutes>
            <AssetModelUpload />
          </PrivateRoutes>
        }
      />
      <Route
        path={STRINGS.PROFILE_PATH}
        element={
          <PrivateRoutes>
            <ProfilePage />
          </PrivateRoutes>
        }
      />
      <Route
        path={"/*"}
        element={
          <PrivateRoutes>
            <HomePage />
          </PrivateRoutes>
        }
      />
      <Route path={"/login"} element={<LoginPage />} />
      <Route path={"/register"} element={<RegisterPage />} />
      {/* <Route path={"/*"} element={<HomePage />}/> */}
    </Routes>
  );
}

export default App;
