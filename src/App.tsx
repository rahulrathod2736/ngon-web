import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/home.page";
import { LoginPage } from "./pages/login.page";
import { AssetModelUpload } from "./pages/model-upload.page";
import { RegisterPage } from "./pages/register.page";
import { ForgotPasswordPage } from "./pages/forgot-password.page";
import { RootState, useAppSelector } from "./redux/store";
import { PrivateRoutes } from "./routes/privateRoutes";
import { STRINGS } from "./utils/constants/strings";

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
      <Route path={"/*"} element={<HomePage />} />
      <Route path={"/login"} element={<LoginPage />} />
      <Route path={"/register"} element={<RegisterPage />} />
      <Route path={"/forgot-password"} element={<ForgotPasswordPage />} />
      {/* <Route path={"/*"} element={<HomePage />}/> */}
    </Routes>
  );
}

export default App;
