import { Upload, message } from "antd";
import React, { useState } from "react";
import { axiosInstance } from "../utils/axios";
import { apiRoutes } from "../utils/constants/apiRoutes";
import { CreateNGONAssets } from "./create-ngon-assets";
import { NgonAssetCard } from "./ngon-asset-card";
import { showErrorMessage } from "../utils/functions";

export const Projects = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assets, setAssets] = useState([]);

  React.useEffect(() => {
    getAssets();
  }, []);

  const getAssets = async () => {
    try {
      setIsLoading(true);
      const resp = await axiosInstance.get(`${apiRoutes.assets}?self=true`);
      setAssets(resp.data?.data || []);
    } catch (err: any) {
      showErrorMessage(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="px-4 pb-0 h-full">
        <div className="h-full pt-4">
          {assets.length > 0 ? (
            <div className="grid grid-cols-3 gap-x-4">
              {assets.map((asset, i) => {
                return <NgonAssetCard asset={asset} className="drop-shadow-none"/>;
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
