import { Button, Upload, UploadFile, UploadProps, message } from "antd";
import axios from "axios";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axios";
import { apiRoutes } from "../utils/constants/apiRoutes";
import { ModelViewer } from "./model-viewer";

const { Dragger } = Upload;

export const MultiModelUpload = ({ id }: { id: string }) => {
  const [assetModelUrl, setAssetModelUrl] = useState<Record<
    string,
    any
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [multipleFileLoading, setMultipleFileLoading] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      getModelUrl(id);
    }
  }, [id]);

  useEffect(() => {
    if (multipleFileLoading.length === 0 && isFetching && id) {
      getModelUrl(id);
      setIsFetching(false);
    }
  }, [isFetching, multipleFileLoading, id]);

  const getModelUrl = async (id: string) => {
    try {
      setLoading(true);
      const resp = await axiosInstance.get(
        `${apiRoutes.getModelUrls.replace(":assetId", id)}`
      );
      setAssetModelUrl(resp?.data?.data || {});
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const modelUploadFile: UploadProps = {
    name: "file",
    multiple: true,
    accept: ".glb,.fbx,.obj,.gltf,.blend",
    maxCount: 10,
    showUploadList: false,
    customRequest: (options: any) => {
      options.onSuccess();
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "uploading") {
        uploadModelToAsset(info.file);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {},
  };

  const uploadModelToAsset = async (file: UploadFile) => {
    try {
      setMultipleFileLoading((files: string[]) => {
        return [...files, file.uid.toString()];
      });

      const params = {
        type: "model",
        size: file.size ? file.size / 1024 : 0,
        action: "signedUrl",
        fileName: file.name,
      };
      const resp = await axiosInstance.post(
        apiRoutes.assetMedia.replace(":assetId", id),
        params
      );
      const signedUrl = resp.data.data.signedUrl;
      await axios.put(signedUrl, file.originFileObj);
      params.action = "confirmUpload";
      await axiosInstance.post(
        apiRoutes.assetMedia.replace(":assetId", id),
        params
      );
      message.success(`${file.name} file uploaded successfully.`);
    } catch (err) {
    } finally {
      setMultipleFileLoading((files: string[]) => {
        const filteredFiles = files.filter(
          (f: string) => f !== file.uid.toString()
        );
        if (filteredFiles.length === 0) setIsFetching(true);
        return filteredFiles;
      });
    }
  };

  const reuploadModel = () => {
    setAssetModelUrl(null);
  };

  const deleteModel = async (modelId: string) => {
    try {
      setLoading(true);
      const resp = await axiosInstance.delete(
        `${apiRoutes.deleteModelUrls
          .replace(":assetId", id)
          .replace(":modelId", modelId)}`
      );
      setIsFetching(true);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {multipleFileLoading.length > 0 || loading ? (
        <div className="h-44 flex items-center justify-center">Loading...</div>
      ) : assetModelUrl?.models?.length > 0 ? (
        <>
          {assetModelUrl?.glbUrl && (
            <div className="w-full rounded-md h-44 bg-slate-100 mb-4">
              <ModelViewer modelUrl={assetModelUrl?.glbUrl} />
            </div>
          )}
          <div className="w-full rounded-md h-44 bg-slate-100 flex flex-col gap-2 p-2 overflow-auto">
            {assetModelUrl?.models?.map((model: Record<string, any>) => {
              const fileNameArray = model.key.split(".");
              return (
                <div
                  key={model._id}
                  className="bg-white p-2 flex items-center justify-between rounded-md"
                >
                  <span className="uppercase">
                    .{fileNameArray[fileNameArray.length - 1]}
                  </span>
                  <AiOutlineCloseCircle
                    className="cursor-pointer"
                    onClick={() => {
                      deleteModel(model?._id);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <></>
      )}
      <div>
        <Dragger {...modelUploadFile} className="h-44 p-4">
          <p className="ant-upload-text !text-sm px-4">
            Click to upload 3d Model
          </p>
          <p className="ant-upload-hint !text-xs px-4">
            Upload any 3d model file. supported files are .fbx, .glb, .obj,
            .gltf, .blend file
          </p>
        </Dragger>
      </div>
    </div>
  );
};
