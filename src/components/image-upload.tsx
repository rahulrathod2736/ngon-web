import {useEffect, useState} from "react";
import {Button, message, Upload, UploadFile, UploadProps} from "antd";
import {axiosInstance} from "../utils/axios";
import {apiRoutes} from "../utils/constants/apiRoutes";
import axios from "axios";

const {Dragger} = Upload;

export const ImageUpload = ({id}: { id: string }) => {
    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            getThumbnailUrl(id);
        }
    }, [id]);

    const getThumbnailUrl = async (id: string) => {
        try {
            setLoading(true);
            const params = {
                "type": "image",
                "action": "download"
            }
            const downloadResp = await axiosInstance.post(
                apiRoutes.assetMedia.replace(':assetId', id),
                params,
            );
            const thumbnailUrl = downloadResp?.data?.data?.url || '';
            if (thumbnailUrl) {
                setUrl(thumbnailUrl)
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
    const modelUploadFile: UploadProps = {
        name: "file",
        multiple: false,
        accept: ".png,.jpg.jpeg",
        customRequest: (options: any) => {
            options.onSuccess();
        },
        onChange(info) {
            const {status} = info.file;
            if (status === "done") {
                uploadModelToAsset(info.file);
            } else if (status === "error") {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log("Dropped files", e.dataTransfer.files);
        },
    };

    const uploadModelToAsset = async (file: UploadFile) => {
        try {
            // message.success(`${file.name} file uploaded successfully.`);
            setLoading(true)

            const params = {
                "type": "image",
                "size": file.size ? file.size / 1024 : 0,
                "action": "signedUrl"
            }
            const resp = await axiosInstance.post(
                apiRoutes.assetMedia.replace(':assetId', id),
                params,
            );
            const signedUrl = resp.data.data.signedUrl;
            await axios.put(signedUrl, file.originFileObj);
            params.action = "confirmUpload";
            const confirmUploadResp = await axiosInstance.post(
                apiRoutes.assetMedia.replace(':assetId', id),
                params,
            );
            setUrl(confirmUploadResp?.data?.data?.url || '')
            message.success(`${file.name} file uploaded successfully.`);
        } catch (err) {
            console.log(err);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const reuploadModel = () => {
        setUrl(null)
    };

    return (
        <div>
            {loading ? <div className="h-44 flex items-center justify-center">
                Loading...
            </div> : url ? (
                <div className="w-full rounded-md h-44">
                    <img src={url} className={"h-44 w-full object-cover"}/>
                </div>
            ) : (
                <Dragger {...modelUploadFile} className="h-44 p-4">
                    <p className="ant-upload-text !text-sm px-4">
                        Click to upload Thumbnail
                    </p>
                    <p className="ant-upload-hint !text-xs px-4">Supported files: .PNG, .JPEG, .JPG</p>
                </Dragger>
            )}
            {url && (
                <Button block type="primary" className="mt-4" onClick={reuploadModel}>
                    Reupload Model
                </Button>
            )}
        </div>
    );
};
