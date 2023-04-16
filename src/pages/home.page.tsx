import {
  Avatar,
  Badge,
  Divider,
  Layout as AntdLayout,
  Menu,
  Popover,
} from "antd";
import { useEffect } from "react";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Header } from "../components/header";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { getCategories } from "../redux/userReducer";
import { DashboardMenus } from "../utils/constants/menus";
import { STRINGS } from "../utils/constants/strings";
import { AssetOnboadingDetails } from "./asset-onboarding-details.page";
import { AssetsPage } from "./assets.page";
import { DashboardPage } from "./dashboard.page";
import { AssetDetails } from "./asset-details.page";
import { ProfilePage } from "./profile.page";

const { Sider, Content, Header: AntdHeader } = AntdLayout;

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
  const user = useAppSelector((state: RootState) => state.user);
  const dispatchEvent = useAppDispatch();

  useEffect(() => {
    console.log(user);
    if (!user?.categories.length) {
      dispatchEvent(getCategories({}));
    }
  }, [user.categories, dispatchEvent]);

  return (
    <>
      <AntdLayout className="bg-white h-screen w-screen">
        <AntdLayout>
          <AntdHeader className="!bg-white">
            <Header />
          </AntdHeader>
          <Content className="bg-[#fafbfe] p-4 text-black h-screen overflow-auto">
            <div>
              <Routes>
                <Route path={STRINGS.ASSETS_PATH} element={<AssetsPage />} />
                <Route
                  path={"/asset-onboarding/details"}
                  element={<AssetOnboadingDetails />}
                />
                <Route
                  path={"/asset-onboarding/details/:id"}
                  element={<AssetOnboadingDetails />}
                />
                <Route path={"/assets/:id"} element={<AssetDetails />} />
                <Route path={STRINGS.BASE_PATH} element={<AssetsPage />} />
                <Route path={STRINGS.PROFILE_PATH} element={<ProfilePage />} />
              </Routes>
            </div>
          </Content>
        </AntdLayout>
      </AntdLayout>
    </>
  );
};
