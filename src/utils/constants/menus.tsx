import { TbFolders } from "react-icons/tb";
import { BiRestaurant } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { BsGrid1X2 } from "react-icons/bs";
import { GoHome } from "react-icons/go";
import { IoAddSharp } from "react-icons/io5";
import type { MenuProps } from "antd";
import { STRINGS } from "./strings";

type MenuItem = Required<MenuProps>["items"][number];

export const DashboardMenus: MenuItem[] = [
  {
    key: STRINGS.BASE_PATH,
    label: STRINGS.DASHBOARD,
    icon: <GoHome size={16} />,
  },
  {
    key: STRINGS.ASSETS_PATH,
    label: STRINGS.ASSETS,
    icon: <BiRestaurant size={16} />,
  },
  {
    key: STRINGS.USERS_PATH,
    label: STRINGS.USERS,
    icon: <FiUsers size={16} />,
  },
  {
    type: "divider",
  },
  {
    key: STRINGS.INVITE_RESTAURANTS_PATH,
    label: STRINGS.INVITE_RESTAURANTS,
    icon: <IoAddSharp size={16} />,
  },
  {
    key: "/content-planner",
    label: "Content Planner",
    icon: <TbFolders size={16} />,
  },
];
