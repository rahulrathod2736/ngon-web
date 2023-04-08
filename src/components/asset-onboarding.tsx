import React from "react";
import { message, UploadProps, Upload, UploadFile, Button } from "antd";
import { BsPlusLg } from "react-icons/bs"
import { useNavigate } from "react-router-dom";
import { STRINGS } from "../utils/constants/strings";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { uploadAssetModel } from "../redux/assetOnboardingReducer";

const { Dragger } = Upload;

export const AssetOnboardingUpload = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isAssetModelUploadLoading, isAssetModelUploadSuccess, isAssetModelUploadError } = useAppSelector((state: RootState) => state.assetOnboarding);
    const [selectedFiles, setSelectedFiles] = React.useState<UploadFile[]>([]);

    React.useEffect(() => {
        console.log(selectedFiles, 'selectedFiles')
        if (selectedFiles.length > 0) {
            dispatch(uploadAssetModel({ file: selectedFiles }));
        }
    }, [selectedFiles]);


    const modelUploadFile: UploadProps = {
        name: "file",
        multiple: true,
        showUploadList: false,
        beforeUpload(file, FileList) {
            console.log(FileList, 'file-list')
        },
        customRequest: (options: any) => {
            options.onSuccess();
        },

        onChange(info) {
            setSelectedFiles((files) => files.length === info.fileList.length ? files : info.fileList);
            // navigate(STRINGS.ASSET_ONBOARDING_DETAILS_ID_PATH.replace(":id", "wjhvuychs"));
        },
        onDrop(e) {
            console.log("Dropped files", e.dataTransfer.files);
        },
    };

    return <div className="p-4 pb-0 h-full">
        <div className="h-full">
            {selectedFiles.length ? <div className="h-full flex items-center justify-center">
                <Button>Create NGON Assets</Button>
            </div> : <Dragger {...modelUploadFile}>
                <div className="py-10">
                    <p className="ant-upload-drag-icon mt-5">
                        <BsPlusLg className="text-5xl text-slate-500" />
                    </p>
                    <p className="ant-upload-text">
                        Upload your first project and explore 3D models
                    </p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit from
                        uploading company data or other band files
                    </p>
                </div>
            </Dragger>}
        </div>
    </div>
}