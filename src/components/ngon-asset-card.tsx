import { FiEdit } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { INgonAsset } from "../utils/interface";
import { RootState, useAppSelector } from "../redux/store";
import { capitalizeSentence, getFullName } from "../utils/functions";
import { Avatar, Tooltip } from "antd";
import React from "react";

interface IProps {
  asset: INgonAsset;
  className?: string;
}

export const NgonAssetCard = ({ asset, className }: IProps) => {
  const { userProfile } = useAppSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const navigateToEdit = (id: string) => {
    navigate("/asset-onboarding/details/" + id);
  };
  return (
    <div className={`bg-white drop-shadow-2xl rounded-md mb-4 ${className}`}>
      <div className="h-36 relative">
        <img
          src={asset?.image || "https://picsum.photos/500/300?random=1"}
          className="w-full h-36 object-cover rounded-t-md"
        />
        {asset?.user?._id === userProfile?._id ? (
          <span
            className="absolute right-3 bottom-3 bg-white h-8 w-8 flex items-center justify-center rounded-full cursor-pointer"
            onClick={() => {
              navigateToEdit(asset._id);
            }}
          >
            <FiEdit size={14} />
          </span>
        ) : (
          <></>
        )}
      </div>
      <div className={"flex flex-row p-4 items-center"}>
        <div className="px-2 flex flex-col flex-1">
          <span className="">
            <Link
              to={`/assets/${asset._id}`}
              className="text-black hover:text-black underline"
            >
              {capitalizeSentence(asset.name)}
            </Link>
          </span>
          <span className="text-xs text-gray-400 leading-normal line-clamp-2">
            {asset.description}
          </span>
        </div>
        <Tooltip title={getFullName(asset?.user || {})} placement={"bottom"}>
          {asset?.user?.profileImage ? (
            <Avatar
              src={asset?.user?.profileImage}
              size={35}
              className={"cover"}
            />
          ) : (
            <Avatar size={35} className={"uppercase"}>
              {asset?.user?.firstName?.[0] || ""}
            </Avatar>
          )}
        </Tooltip>
      </div>
    </div>
  );
};
