import { useEffect, useState } from "react";
import { Button, message, Upload, UploadFile, UploadProps } from "antd";
import { ModelViewer } from "./model-viewer";
import { useAppDispatch } from "../redux/store";
import { axiosInstance } from "../utils/axios";
import { apiRoutes } from "../utils/constants/apiRoutes";
import axios from "axios";

const { Dragger } = Upload;

export const ModelUpload = ({ id }: { id: string }) => {
  const [modelUrl, setModelUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getModelUrl(id);
    }
  }, [id]);

  const getModelUrl = async (id: string) => {
    try {
      setLoading(true);
      const params = {
        type: "model",
        action: "download",
      };
      const downloadResp = await axiosInstance.post(
        apiRoutes.assetMedia.replace(":assetId", id),
        params
      );
      const model = downloadResp?.data?.data?.url || "";
      if (model) {
        setModelUrl(model);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  const modelUploadFile: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".glb",
    customRequest: (options: any) => {
      options.onSuccess();
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        uploadModelToAsset(info.file);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {},
  };

  const uploadModelToAsset = async (file: UploadFile) => {
    try {
      // message.success(`${file.name} file uploaded successfully.`);
      setLoading(true);

      const params = {
        type: "model",
        size: file.size ? file.size / 1024 : 0,
        action: "signedUrl",
      };
      const resp = await axiosInstance.post(
        apiRoutes.assetMedia.replace(":assetId", id),
        params
      );
      const signedUrl = resp.data.data.signedUrl;
      const fileUpload = await axios.put(signedUrl, file.originFileObj);
      params.action = "confirmUpload";
      const confirmUploadResp = await axiosInstance.post(
        apiRoutes.assetMedia.replace(":assetId", id),
        params
      );
      setModelUrl(confirmUploadResp?.data?.data?.url || "");
      message.success(`${file.name} file uploaded successfully.`);
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const reuploadModel = () => {
    setModelUrl(null);
  };

  return (
    <div>
      {loading ? (
        <div className="h-44 flex items-center justify-center">Loading...</div>
      ) : modelUrl ? (
        <div className="w-full rounded-md h-44 bg-slate-100">
          <ModelViewer modelUrl={modelUrl} />
        </div>
      ) : (
        <Dragger {...modelUploadFile} className="h-44 p-4">
          <p className="ant-upload-text !text-sm px-4">
            Click to upload 3d Model
          </p>
          <p className="ant-upload-hint !text-xs px-4">
            Currently we are supported only glb file, soon we're supporting more
            files.
          </p>
        </Dragger>
      )}
      {modelUrl && (
        <Button block type="primary" className="mt-4" onClick={reuploadModel}>
          Reupload Model
        </Button>
      )}
    </div>
  );
};
