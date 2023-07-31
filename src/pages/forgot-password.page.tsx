import { Button, Divider, Form, Input } from "antd";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import TooltipInputField from "../components/tooltipInputField/tooltipInputField";
import { loginUser, openGlobalModal } from "../redux/authReducer";
import { useAppDispatch } from "../redux/store";
import { showErrorMessage, showSuccessMessage } from "../utils/functions";
import { apiRoutes } from "../utils/constants/apiRoutes";
import { axiosInstance } from "../utils/axios";
import { useState } from "react";

export const ForgotPasswordPage = ({
  isFullScreen = true,
}: {
  isFullScreen?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState<boolean>(false);

  const handleSignin = () => {
    if (isFullScreen) {
      navigate("/login");
    } else {
      dispatch(openGlobalModal("login"));
    }
  };

  const { values, handleChange, errors, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: {
        email: "",
        isEmailSent: false,
        verificationCode: "",
        isCodeVerified: false,
        password: "",
        confirmPassword: "",
        otpId: "",
      },
      validateOnBlur: false,
      validateOnChange: false,
      validationSchema: yup.object().shape({
        email: yup.string().required("Email is required"),
        verificationCode: yup
          .string()
          .when(
            ["isEmailSent", "isCodeVerified"],
            ([isEmailSent, isCodeVerified], schema) => {
              return isEmailSent
                ? schema
                    .typeError("Confirmation code is requied.")
                    .required("Confirmation code is requied.")
                : schema.optional();
            }
          ),
        password: yup
          .string()
          .when(
            ["isEmailSent", "isCodeVerified"],
            ([isEmailSent, isCodeVerified], schema) => {
              return isEmailSent && isCodeVerified
                ? schema
                    .typeError("Password is requied.")
                    .required("Password is requied.")
                : schema.optional();
            }
          ),
        confirmPassword: yup
          .string()
          .when(
            ["isEmailSent", "isCodeVerified"],
            ([isEmailSent, isCodeVerified], schema) => {
              return isEmailSent && isCodeVerified
                ? schema
                    .typeError("Confirm password is requied.")
                    .required("Confirm password is requied.")
                    .oneOf([yup.ref("password")], "Password must match")
                : schema.optional();
            }
          ),
      }),
      onSubmit: (values) => {
        if (!values.isEmailSent && !values.isCodeVerified) sendEmailOTP();
        else if (values.isEmailSent && !values.isCodeVerified)
          verifyConfirmationCode();
        else if (values.isEmailSent && values.isCodeVerified)
          handleUpdatePassword();
      },
    });

  const sendEmailOTP = async () => {
    try {
      setLoading(true);
      const payload = {
        email: values.email,
        type: "forgot-password",
      };
      const resp = await axiosInstance.post(apiRoutes.sendOtp, payload);
      setFieldValue("isEmailSent", true);
      setFieldValue("otpId", resp?.data?.data?._id ?? "");
      showSuccessMessage("Confirmaton code sent successfully.");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      showErrorMessage(err);
    }
  };

  const verifyConfirmationCode = async () => {
    try {
      setLoading(true);
      const payload = {
        id: values.otpId,
        code: values.verificationCode,
        type: "forgot-password",
      };
      const resp = await axiosInstance.post(apiRoutes.verifyOtp, payload);
      setFieldValue("isCodeVerified", true);
      showSuccessMessage("Confirmaton code verified successfully.");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      showErrorMessage(err);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      setLoading(true);
      const payload = {
        otpId: values.otpId,
        email: values.email,
        password: values.password,
      };
      const resp = await axiosInstance.put(apiRoutes.updatePassword, payload);
      showSuccessMessage("Password updated successfully.");
      setLoading(false);
      handleSignin();
    } catch (err) {
      setLoading(false);
      showErrorMessage(err);
    }
  };

  return (
    <>
      <div
        className={
          isFullScreen
            ? "flex items-center justify-center w-screen bg-white h-screen"
            : ""
        }
      >
        <div className="border-[1px] border-dashed border-slate-300 rounded-md bg-white drop-shadow-xl min-w-[75%] sm:min-w-[50%] lg:min-w-[33%] py-4">
          <div className="text-center mb-4 px-4 text-black">
            Forgot Password
          </div>
          <Divider dashed />
          <Form layout="vertical" className="px-4 gap-2">
            <Form.Item label="Email address">
              <TooltipInputField message={errors.email || null}>
                <Input
                  placeholder="Email address"
                  name="email"
                  value={values.email}
                  status={errors.email ? "error" : ""}
                  onChange={handleChange}
                  disabled={values.isEmailSent || loading}
                />
              </TooltipInputField>
            </Form.Item>
            {values.isEmailSent && (
              <Form.Item
                className="transition-all ease-linear"
                label="Confirmation Code"
                help={
                  <span className="text-xs">
                    Verification code sent on your email address
                  </span>
                }
              >
                <TooltipInputField
                  message={
                    errors.verificationCode ? errors.verificationCode : null
                  }
                >
                  <Input
                    placeholder="Verification code"
                    maxLength={8}
                    name="verificationCode"
                    value={values.verificationCode}
                    status={errors.verificationCode ? "error" : ""}
                    onChange={handleChange}
                    disabled={values.isCodeVerified || loading}
                  />
                </TooltipInputField>
              </Form.Item>
            )}
            {values.isEmailSent && values.isCodeVerified && (
              <>
                <Form.Item
                  className="pt-4"
                  help={
                    <span className="text-xs">
                      Password must include capital letter, number and one
                      unique character
                    </span>
                  }
                >
                  <TooltipInputField
                    message={errors.password ? errors.password : null}
                  >
                    <Input.Password
                      placeholder="Password"
                      disabled={
                        !values.isCodeVerified || !values.isEmailSent || loading
                      }
                      name="password"
                      onChange={handleChange}
                      value={values.password}
                      status={errors.password ? "error" : ""}
                    />
                  </TooltipInputField>
                </Form.Item>
                <Form.Item className="pt-2">
                  <TooltipInputField
                    message={
                      errors.confirmPassword ? errors.confirmPassword : null
                    }
                  >
                    <Input.Password
                      placeholder="Confirm Password"
                      disabled={
                        !values.isCodeVerified || !values.isEmailSent || loading
                      }
                      name="confirmPassword"
                      onChange={handleChange}
                      value={values.confirmPassword}
                      status={errors.confirmPassword ? "error" : ""}
                    />
                  </TooltipInputField>
                </Form.Item>
              </>
            )}
            <Button
              block
              type="primary"
              shape="round"
              className="mt-2"
              disabled={loading}
              loading={loading}
              onClick={() => {
                handleSubmit();
              }}
            >
              {!values.isEmailSent && !values.isCodeVerified
                ? "Send Confirmation Code"
                : values.isCodeVerified
                ? "Update Password"
                : "Verify Confirmation Code"}
            </Button>
          </Form>
          <div className="flex justify-end m-4">
            <span className="link text-sm" onClick={handleSignin}>
              Sign in with account
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
