import { Avatar, Button, Divider, Popover } from "antd";
import { FiShoppingCart, FiUploadCloud } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "../../redux/store";
import { STRINGS } from "../../utils/constants/strings";
import { CreateNGONAssets } from "../create-ngon-assets";
import { logout } from "../../redux/userReducer";
import { ReactComponent as NGONLogo } from "../../assets/ngon.svg";

const ProfilePopover = ({ profile }: any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout({}));
    localStorage.removeItem("ngon:token");
    navigate("/", {
      replace: true,
    });
  };
  return (
    <div className="px-4 py-2">
      <div className="flex flex-col">
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
    <div className="flex flex-col md:flex-row justify-between items-center w-full h-fit bg-white">
      <input type="checkbox" className="hidden peer" id="navbar-home-main" defaultChecked />
      <div className="h-fit py-3 md:py-0 w-full md:w-auto flex justify-between px-5">
        <NGONLogo
          className="w-24 h-12 cursor-pointer"
          onClick={navigateToHome}
        />
        <label htmlFor="navbar-home-main" className=" text-black md:hidden">
          <svg viewBox="0 0 28 28" className="h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"><path d="M4 7C4 6.44771 4.44772 6 5 6H24C24.5523 6 25 6.44771 25 7C25 7.55229 24.5523 8 24 8H5C4.44772 8 4 7.55229 4 7Z" fill="#000000" /><path d="M4 13.9998C4 13.4475 4.44772 12.9997 5 12.9997L16 13C16.5523 13 17 13.4477 17 14C17 14.5523 16.5523 15 16 15L5 14.9998C4.44772 14.9998 4 14.552 4 13.9998Z" fill="#000000" /><path d="M5 19.9998C4.44772 19.9998 4 20.4475 4 20.9998C4 21.552 4.44772 21.9997 5 21.9997H22C22.5523 21.9997 23 21.552 23 20.9998C23 20.4475 22.5523 19.9998 22 19.9998H5Z" fill="#000000" /></g></svg>
        </label>
      </div>
      <div className="w-full md:w-auto bg-gray-200 md:bg-white peer-checked:hidden md:peer-checked:block py-7 mt-3">
        <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8">
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
          {authToken && (
            <NavLink
              className="cursor-pointer text-black hover:text-black"
              to={"/assets"}
            >
              Assets
            </NavLink>
          )}
          <div>
            <CreateNGONAssets />
          </div>
          {authToken && (
            <Popover
              content={<ProfilePopover profile={userProfile} />}
              trigger={["click"]}
              placement="bottomRight"
              arrow={{ arrowPointAtCenter: true }}
            >
              <Avatar className="cursor-pointer" size={35}>
                {userProfile?.firstName?.[0] || ""}
              </Avatar>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};
