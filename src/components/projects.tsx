import React from "react";
import { UploadProps, Upload, message, Button } from "antd";
import { BsPlusLg } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getAssets } from "../redux/assetReducer";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { CreateNGONAssets } from "./create-ngon-assets";
import { NgonAssetCard } from "./ngon-asset-card";

const { Dragger } = Upload;

export const Projects = () => {
  const dispatch = useAppDispatch();

  const { assets, isGetAssetsLoading } = useAppSelector(
    (state: RootState) => state.asset
  );

  React.useEffect(() => {
    dispatch(getAssets({}));
  }, []);
  return (
    <>
      <div className="px-4 pb-0 h-full">
        <div className="h-full pt-4">
          {assets.length > 0 ? (
            <div className="grid grid-cols-3 gap-x-4">
              {assets.map((asset, i) => {
                return <NgonAssetCard asset={asset} />;
              })}
            </div>
          ) : (
            <div className="h-full flex items-start justify-center">
              <CreateNGONAssets />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
