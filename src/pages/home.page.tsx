import { Layout as AntdLayout, Divider } from "antd";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AnalyticsWrapper } from "../components/analytics-viewwrapper";
import { AuthModal } from "../components/auth-modal";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { WalletWarning } from "../components/wallet-warning";
import { useAnalytics } from "../hooks/useAnalytics";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { getCategories, getProfile, setToken } from "../redux/userReducer";
import { PrivateRoutes } from "../routes/privateRoutes";
import { AssetDetails } from "./asset-details.page";
import { AssetOnboadingDetails } from "./asset-onboarding-details.page";
import { AssetsPage } from "./assets.page";
import { ContentPage } from "./content.page";
import EditProfilePage from "./edit-profile.page";
import MarketplacePage from "./marketplace.page";
import { PrivacyPolicyPage } from "./privacy-policy.page";
import { ProfilePage } from "./profile.page";
import { WalletPage } from "./wallet.page";

const { Content, Header: AntdHeader, Footer: AntdFooter } = AntdLayout;

const NotificationPopOver = () => {
  return (
    <div className="w-80 max-h-96 no-scroll flex flex-col">
      <div className="px-4 py-2">Notifications</div>
      <Divider />
      <div className="h-full overflow-auto no-scroll">
        {Array(10)
          .fill(0)
          .map((_, i) => {
            return (
              <>
                <div className="cursor-pointer hover:bg-slate-50">
                  <div className="flex flex-col px-4 py-2 ">
                    <div className="mb-2">
                      Someone at NGon viewed your profile.
                    </div>
                    <div className="text-[10px] text-gray-500 text-right">
                      09: 43 AM, 22th April, 2022
                    </div>
                  </div>
                  {i !== 9 && <Divider className="bg-transparent" />}
                </div>
              </>
            );
          })}
      </div>
      <Divider />
      <div className="px-4 py-2 text-center text-xs cursor-pointer">
        Clear All
      </div>
    </div>
  );
};
const ProfilePopover = () => {
  return (
    <div className="">
      <div className="px-4 py-2 flex flex-col">
        <span>Rahul Rathod</span>
        <span className="text-slate-400">rahulrathod2736@gmail.com</span>
      </div>
      <Divider dashed />
      <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer ">
        Profile
      </div>
      <Divider dashed />
      <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">Wallet</div>
      <Divider dashed />
      <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
        Settings
      </div>
      <Divider dashed />
      <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer hover:rounded-b-lg">
        Logout
      </div>
    </div>
  );
};

export const HomePage = () => {
  const navigate = useNavigate();
  const { categories, authToken, userProfile } = useAppSelector(
    (state: RootState) => state.user
  );
  const dispatch = useAppDispatch();

  const { initialized } = useAnalytics();

  useEffect(() => {
    if (!categories.length && authToken) {
      dispatch(getCategories({}));
    }
  }, [categories, dispatch, authToken]);

  useEffect(() => {
    if (authToken && Object.keys(userProfile).length === 0) {
      dispatch(getProfile({}));
    }
  }, [authToken]);

  const authLocalToken = localStorage.getItem("ngon:token");
  useEffect(() => {
    if (
      (authToken || authLocalToken) &&
      Object.keys(userProfile).length === 0
    ) {
      dispatch(setToken(authToken || authLocalToken));
    }
  }, [authLocalToken, authToken]);

  return (
    <>
      <AntdLayout>
        <AntdHeader className="!bg-white fixed z-[1000] w-screen">
          <Header />
        </AntdHeader>
        <Content className="content bg-[#fafbfe] !mt-16">
          <WalletWarning />
          <div className="p-4 text-black overflow-auto">
            <AnalyticsWrapper initialized={initialized}>
              <Routes>
                <Route
                  path={"/marketplace"}
                  element={
                    <PrivateRoutes>
                      <MarketplacePage />
                    </PrivateRoutes>
                  }
                />
                <Route path={"/"} element={<ContentPage />} />
                <Route
                  path={"/assets"}
                  element={
                    <PrivateRoutes>
                      <AssetsPage />
                    </PrivateRoutes>
                  }
                />
                <Route
                  path={"/asset-onboarding/details"}
                  element={
                    <PrivateRoutes>
                      <AssetOnboadingDetails />
                    </PrivateRoutes>
                  }
                />
                <Route
                  path={"/asset-onboarding/details/:id"}
                  element={
                    <PrivateRoutes>
                      <AssetOnboadingDetails />
                    </PrivateRoutes>
                  }
                />
                <Route
                  path={"/assets/:id"}
                  element={
                    <PrivateRoutes>
                      <AssetDetails />
                    </PrivateRoutes>
                  }
                />
                <Route
                  path={"/profile"}
                  element={
                    <PrivateRoutes>
                      <ProfilePage />
                    </PrivateRoutes>
                  }
                />
                <Route
                  path={"/profile/edit"}
                  element={
                    <PrivateRoutes>
                      <EditProfilePage />
                    </PrivateRoutes>
                  }
                />
                <Route
                  path={"/privacy-policy"}
                  element={<PrivacyPolicyPage />}
                />
                <Route
                  path={"/wallet"}
                  element={
                    <PrivateRoutes>
                      <WalletPage />
                    </PrivateRoutes>
                  }
                />
              </Routes>
            </AnalyticsWrapper>
          </div>
        </Content>
        <AntdFooter>
          <Footer />
        </AntdFooter>
      </AntdLayout>
      <AuthModal />
    </>
  );
};
