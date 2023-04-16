import { Avatar, Button, Divider, Popover } from "antd";
import { FiShoppingCart, FiUploadCloud } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { STRINGS } from "../utils/constants/strings";
import { CreateNGONAssets } from "./create-ngon-assets";
import { logout } from "../redux/userReducer";
import { ReactComponent as NGONLogo   } from "../assets/ngon.svg";

const ProfilePopover = ({ profile }: any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout({}));
    localStorage.removeItem("ngon:token");
    navigate("/login", {
      replace: true,
    });
  };
  return (
    <div className="">
      <div className="px-4 py-2 flex flex-col">
        <span>
          {profile?.firstName} {profile?.lastName}
        </span>
        <span className="text-slate-400">{profile?.email}</span>
      </div>
      <Divider dashed />

      <NavLink to={STRINGS.PROFILE_PATH}>
        <div className="px-4 py-2 hover:bg-slate-100 text-black">Profile</div>
      </NavLink>

      <Divider dashed />
      <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
        Settings
      </div>
      <Divider dashed />
      <div
        className="px-4 py-2 hover:bg-slate-100 cursor-pointer hover:rounded-b-lg"
        onClick={handleLogout}
      >
        Logout
      </div>
    </div>
  );
};

export const Header = () => {
  const { authToken, userProfile } = useAppSelector(
    (state: RootState) => state.user
  );
  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate("/");
  };
  return (
    <div className="flex justify-between items-center w-full bg-white">
      <div className="h-10">
        <NGONLogo className="w-20 h-10 cursor-pointer" onClick={navigateToHome}/>
      </div>
      <div className="">
        <div className="flex items-center gap-8">
          {!authToken && (
            <NavLink
              className="cursor-pointer text-black hover:text-black"
              to={"/login"}
            >
              Log in
            </NavLink>
          )}
          {!authToken && (
            <NavLink
              className="cursor-pointer text-red-600 hover:text-red-600"
              to={"/register"}
            >
              Sign up
            </NavLink>
          )}
          <div>
            <CreateNGONAssets />
          </div>
          <Popover
            content={<ProfilePopover profile={userProfile} />}
            trigger={["click"]}
            placement="bottomRight"
            arrow={{ arrowPointAtCenter: true }}
          >
            <Avatar
              className="cursor-pointer"
              size={35}
            >{userProfile?.firstName?.[0] || ""}</Avatar>
          </Popover>
        </div>
      </div>
    </div>
  );
};
