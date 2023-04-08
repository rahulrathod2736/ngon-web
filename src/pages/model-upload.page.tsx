import { Divider, message, Upload, UploadProps } from "antd";
import { BsPlusLg } from "react-icons/bs";

const { Dragger } = Upload;

export const AssetModelUpload = () => {
  const modelUploadFile: UploadProps = {
    name: "file",
    multiple: true,
    customRequest: (options: any) => {
      options.onSuccess();
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  return (
    <div className="flex items-center justify-center w-screen bg-white h-screen">
      <div className="border-[1px] border-dashed border-slate-300 rounded-md bg-white drop-shadow-xl min-w-[33%] py-4">
        <div className="text-center mb-4 px-4 text-black">
          Upload New Asset Model
        </div>
        <Divider dashed />
        <div className="p-4 pb-0">
          <Dragger {...modelUploadFile} className="aspect-square h-96">
            <p className="ant-upload-drag-icon"></p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from
              uploading company data or other band files
            </p>
          </Dragger>
        </div>
      </div>
    </div>
  );
};
