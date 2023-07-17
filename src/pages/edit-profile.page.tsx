import {
  Avatar,
  Button,
  Col,
  Form,
  Input,
  Row,
  Upload,
  UploadProps,
  message,
} from "antd";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import TooltipInputField from "../components/tooltipInputField/tooltipInputField";
import { RootState, useAppSelector } from "../redux/store";
import { axiosInstance } from "../utils/axios";
import { apiRoutes } from "../utils/constants/apiRoutes";
import { Loader } from "../components/loader";
import { useNavigate } from "react-router-dom";
import { RcFile, UploadFile } from "antd/es/upload";
import axios from "axios";
import { BiLoaderAlt } from "react-icons/bi";
import { getProfile } from "../redux/userReducer";

interface IUpdateProfile {
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  instagram: string;
  facebook: string;
  linkedin: string;
}

interface IProfileData {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isVerified: true;
  follower: string[];
  following: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  socials: {
    instagram: string;
    facebook: string;
    linkedin: string;
    _id: string;
  };
  bio: string;
  profileImage: string;
}

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<IProfileData | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadImageLoading, setUploadImageLoading] = useState<boolean>(false);
  const [updateProfileLoading, setUpdateProfileLoading] =
    useState<boolean>(false);

  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = async () => {
    try {
      setLoading(true);
      const resp = await axiosInstance.get(apiRoutes.getProfile);
      setProfileData(resp?.data?.data || {});
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const { values, handleChange, errors, handleSubmit } = useFormik({
    initialValues: {
      email: profileData?.email || "",
      firstName: profileData?.firstName || "",
      lastName: profileData?.lastName || "",
      bio: profileData?.bio || "",
      instagram: profileData?.socials?.instagram || "",
      facebook: profileData?.socials?.facebook || "",
      linkedin: profileData?.socials?.linkedin || "",
    },
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      email: yup.string().required("Email is required"),
      firstName: yup.string().required("First Name is required"),
      lastName: yup.string().required("Last Name is required"),
      bio: yup.string().required("Profile Description is required"),
      instagram: yup.string().url("Please enter valid Instagram Profile Link"),
      facebook: yup.string().url("Please enter valid Faceboook Profile Link"),
      linkedin: yup
        .string()
        .typeError("Please enter valid Linkedin Profile Link"),
    }),
    onSubmit: (values) => {
      updateProfile(values);
    },
  });

  const updateProfile = async (values: IUpdateProfile) => {
    try {
      setUpdateProfileLoading(true);
      const resp = await axiosInstance.put(apiRoutes.updateProfile, {
        ...values,
      });
      navigate("/profile");
    } catch (error: any) {
      message.error(error?.response?.daat?.message || error?.message);
    } finally {
      setUpdateProfileLoading(false);
    }
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const uploadModelToAsset = async (file: UploadFile) => {
    try {
      // message.success(`${file.name} file uploaded successfully.`);
      setUploadImageLoading(true);

      const params = {
        type: "profile",
        size: file.size ? file.size / 1024 : 0,
        fileName: file.name,
        action: "signedUrl",
      };
      const resp = await axiosInstance.post(
        apiRoutes.uploadProfileImage,
        params
      );
      const signedUrl = resp.data.data.url;
      await axios.put(signedUrl, file.originFileObj);
      params.action = "confirmUpload";
      const confirmUploadResp = await axiosInstance.post(
        apiRoutes.uploadProfileImage,
        params
      );
      setImageUrl(confirmUploadResp?.data?.data?.url || "");
      await getProfileData();
      message.success(`${file.name} file uploaded successfully.`);
    } catch (err: any) {
      message.success(
        err?.response?.data?.message || err?.message || "Something went Wrong."
      );
    } finally {
      setUploadImageLoading(false);
    }
  };

  const profileChangeProps: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".png,.jpg,.jpeg",
    customRequest: (options: any) => {
      options.onSuccess();
    },
    showUploadList: false,
    async onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        const fileObj = await getBase64(info.file.originFileObj as RcFile);
        setImageUrl(fileObj);
        uploadModelToAsset(info.file);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {},
  };

  return (
    <div className="flex items-center justify-center bg-white">
      {loading ? (
        <div className="p-4">
          <Loader />
        </div>
      ) : (
        <div className="bg-white min-w-[75%] sm:min-w-[50%] lg:min-w-[33%] py-4">
          <div className="flex flex-col">
            <div className="text-center py-8">
              {uploadImageLoading ? (
                <div className="rounded-xl drop-shadow-xl w-32 h-32 mx-auto flex items-center justify-center">
                  Loading...
                </div>
              ) : (
                <Avatar
                  src={
                    imageUrl ||
                    profileData?.profileImage ||
                    "https://picsum.photos/500/300?random=1"
                  }
                  shape="square"
                  className="rounded-xl drop-shadow-xl w-32 h-32"
                />
              )}
              <div className="my-2 flex items-center justify-center gap-2">
                <Upload {...profileChangeProps} disabled={uploadImageLoading}>
                  <span className="cursor-pointer">Change Profile </span>
                </Upload>
                {uploadImageLoading ? (
                  <span>
                    <BiLoaderAlt className="animate-spin" />
                  </span>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <Form layout="vertical" className="px-4 gap-2">
              <Row gutter={[12, 0]}>
                <Col span={24}>
                  <Form.Item label="Email address">
                    <TooltipInputField message={errors.email || null}>
                      <Input
                        placeholder="Email address"
                        name="email"
                        value={values.email}
                        status={errors.email ? "error" : ""}
                        onChange={handleChange}
                        readOnly
                        disabled={updateProfileLoading}
                      />
                    </TooltipInputField>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[12, 0]}>
                <Col span={12}>
                  <Form.Item label="First Name">
                    <TooltipInputField message={errors.firstName || null}>
                      <Input
                        placeholder="First Name"
                        name="firstName"
                        value={values.firstName}
                        status={errors.firstName ? "error" : ""}
                        onChange={handleChange}
                        disabled={updateProfileLoading}
                      />
                    </TooltipInputField>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Last Name">
                    <TooltipInputField message={errors.lastName || null}>
                      <Input
                        placeholder="Last Name"
                        name="lastName"
                        value={values.lastName}
                        status={errors.lastName ? "error" : ""}
                        onChange={handleChange}
                        disabled={updateProfileLoading}
                      />
                    </TooltipInputField>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[12, 0]}>
                <Col span={24}>
                  <Form.Item label="Profile Description">
                    <TooltipInputField message={errors.bio || null}>
                      <Input.TextArea
                        placeholder="Profile Description (Allowed 150 Letters)"
                        name="bio"
                        value={values.bio}
                        status={errors.bio ? "error" : ""}
                        onChange={handleChange}
                        disabled={updateProfileLoading}
                        autoSize={{
                          minRows: 3,
                          maxRows: 3,
                        }}
                        maxLength={150}
                        showCount
                      />
                    </TooltipInputField>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[12, 0]}>
                <Col span={24}>
                  <Form.Item label="Instagram Profile Link">
                    <TooltipInputField message={errors.instagram || null}>
                      <Input
                        placeholder="https://www.instagram.com/username"
                        name="instagram"
                        value={values.instagram}
                        status={errors.instagram ? "error" : ""}
                        onChange={handleChange}
                        disabled={updateProfileLoading}
                      />
                    </TooltipInputField>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[12, 0]}>
                <Col span={24}>
                  <Form.Item label="Facebook Profile Link">
                    <TooltipInputField message={errors.facebook || null}>
                      <Input
                        placeholder="Facebook Profile Link"
                        name="facebook"
                        value={values.facebook}
                        status={errors.facebook ? "error" : ""}
                        onChange={handleChange}
                        disabled={updateProfileLoading}
                      />
                    </TooltipInputField>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[12, 0]}>
                <Col span={24}>
                  <Form.Item label="Linkedin Profile Link">
                    <TooltipInputField message={errors.linkedin || null}>
                      <Input
                        placeholder="https://www.linkedin.com/in/username"
                        name="linkedin"
                        value={values.linkedin}
                        status={errors.linkedin ? "error" : ""}
                        onChange={handleChange}
                        disabled={updateProfileLoading}
                      />
                    </TooltipInputField>
                  </Form.Item>
                </Col>
              </Row>
              <Button
                type="primary"
                block
                onClick={() => {
                  handleSubmit();
                }}
                loading={updateProfileLoading || uploadImageLoading}
                disabled={updateProfileLoading || uploadImageLoading}
              >
                Save Profile
              </Button>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
