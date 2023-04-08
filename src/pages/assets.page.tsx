import React from "react";
import { BiEdit } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/loader";
import { NgonAssetCard } from "../components/ngon-asset-card";
import { getAssets } from "../redux/assetReducer";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";

export const AssetsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { assets, isGetAssetsLoading } = useAppSelector(
    (state: RootState) => state.asset
  );
  React.useEffect(() => {
    dispatch(getAssets({}));
  }, []);

  const navigateToEdit = (id: string) => {
    navigate("/asset-onboarding/details/" + id);
  };

  /**
   *
   * Showing Loader for details
   *
   */
  if (isGetAssetsLoading) {
    return <Loader />;
  }
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mt-8">
        {assets.map((asset, i) => {
          return <NgonAssetCard asset={asset} />;
        })}
      </div>
    </div>
  );
};
