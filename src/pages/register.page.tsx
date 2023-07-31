import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Button, Col, Divider, Form, Input, Row } from "antd";
import TooltipInputField from "../components/tooltipInputField/tooltipInputField";
import * as Yup from "yup";
import {
  openGlobalModal,
  registerUser,
  resetAuthentication,
  verifyCode,
} from "../redux/authReducer";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { useNavigate } from "react-router-dom";

export const RegisterPage = ({
  isFullScreen = true,
}: {
  isFullScreen?: boolean;
}) => {
  const [verificationCode, setVerificationCode] = useState("");
  const dispatch = useAppDispatch();
  const {
    isCreateAccountLoading,
    isCreateAccountSuccess,
    isCreateAccountError,
    isVerificationCodeSent,
    isVerifyingCodeLoading,
    isVerifyingCodeError,
    isVerifyingCodeSuccess,
  } = useAppSelector((state: RootState) => state.authentication);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      isCreateAccountSuccess &&
      isVerificationCodeSent &&
      isVerifyingCodeSuccess?.isVerified
    ) {
      navigate("/login");
      dispatch(resetAuthentication());
    }
  }, [isVerifyingCodeSuccess]);

  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      username: Yup.string().required("Username is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
      confirmPassword: Yup.string()
        .required("Confirm Password")
        .oneOf([Yup.ref("password")], "Password must match"), 
    }),
    onSubmit: (values) => {
      dispatch(registerUser(values));
    },
  });

  const handleSignInAccount = () => {
    if (isFullScreen) {
      navigate("/login");
    } else {
      dispatch(openGlobalModal("login"));
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
        <div className="border-[1px] border-dashed border-slate-300 rounded-md bg-white drop-shadow-xl min-w-[33%] py-4">
          <div className="text-center mb-4 px-4 text-black">
            Account details
          </div>
          <Divider dashed />
          <Form layout="vertical" className="px-4 gap-2 mt-4">
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Form.Item>
                  <TooltipInputField
                    message={errors.firstName ? errors.firstName : null}
                  >
                    <Input
                      placeholder="First name"
                      disabled={isVerificationCodeSent}
                      name="firstName"
                      onChange={handleChange}
                      value={values.firstName}
                      status={errors.firstName ? "error" : ""}
                    />
                  </TooltipInputField>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item>
                  <TooltipInputField
                    message={errors.lastName ? errors.lastName : null}
                  >
                    <Input
                      placeholder="Last name"
                      disabled={isVerificationCodeSent}
                      name="lastName"
                      onChange={handleChange}
                      value={values.lastName}
                      status={errors.lastName ? "error" : ""}
                    />
                  </TooltipInputField>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <TooltipInputField
                message={errors.username ? errors.username : null}
              >
                <Input
                  placeholder="Username"
                  disabled={isVerificationCodeSent}
                  name="username"
                  onChange={handleChange}
                  value={values.username}
                  status={errors.username ? "error" : ""}
                />
              </TooltipInputField>
            </Form.Item>
            <Form.Item>
              <TooltipInputField message={errors.email ? errors.email : null}>
                <Input
                  placeholder="Email address"
                  disabled={isVerificationCodeSent}
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                  status={errors.email ? "error" : ""}
                />
              </TooltipInputField>
            </Form.Item>
            <Form.Item
              help={
                <span className="text-xs">
                  Password must include capital letter, number and one unique
                  character
                </span>
              }
            >
              <TooltipInputField
                message={errors.password ? errors.password : null}
              >
                <Input.Password
                  placeholder="Password"
                  disabled={isVerificationCodeSent}
                  name="password"
                  onChange={handleChange}
                  value={values.password}
                  status={errors.password ? "error" : ""}
                />
              </TooltipInputField>
            </Form.Item>
            <Form.Item className="pt-2">
              <TooltipInputField
                message={errors.confirmPassword ? errors.confirmPassword : null}
              >
                <Input.Password
                  placeholder="Confirm Password"
                  disabled={isVerificationCodeSent}
                  name="confirmPassword"
                  onChange={handleChange}
                  value={values.confirmPassword}
                  status={errors.confirmPassword ? "error" : ""}
                />
              </TooltipInputField>
            </Form.Item>
            <Button
              block
              type="primary"
              shape="round"
              className="mt-2"
              onClick={() => {
                handleSubmit();
              }}
              disabled={isVerificationCodeSent || isCreateAccountLoading}
              loading={isCreateAccountLoading}
            >
              Create account
            </Button>
            <div className="text-right m-4">
              <span className="link" onClick={handleSignInAccount}>
                Sign In account
              </span>
            </div>

            {isVerificationCodeSent && (
              <>
                <Form.Item
                  className="pt-4 transition-all ease-linear"
                  help={
                    <span className="text-xs">
                      Verification code sent on your email address
                    </span>
                  }
                >
                  <TooltipInputField message={""}>
                    <Input
                      placeholder="Verification code"
                      maxLength={8}
                      name="verificationCode"
                      onChange={(e) => {
                        setVerificationCode(e.target.value);
                      }}
                      value={verificationCode}
                    />
                  </TooltipInputField>
                </Form.Item>
                <Button
                  block
                  type="primary"
                  shape="round"
                  className="mt-2"
                  onClick={() => {
                    dispatch(
                      verifyCode({
                        code: verificationCode,
                        user: isCreateAccountSuccess?._id || "",
                      })
                    );
                  }}
                  disabled={isVerifyingCodeLoading}
                  loading={isVerifyingCodeLoading}
                >
                  Verify Code
                </Button>
              </>
            )}
          </Form>
        </div>
      </div>
    </>
  );
};
