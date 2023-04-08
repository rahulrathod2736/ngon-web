import { Button, Divider, Form, Input } from "antd";
import { FaFacebookSquare } from "react-icons/fa";
import { GrLinkedinOption } from "react-icons/gr";
import { FcGoogle } from "react-icons/fc";
import TooltipInputField from "../components/tooltipInputField/tooltipInputField";
import { useFormik } from "formik";
import * as yup from "yup";
import { loginUser, resetAuthentication } from "../redux/authReducer";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { useEffect } from "react";
import { setToken } from "../redux/userReducer";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoginLoading, isLoginSuccess } = useAppSelector(
    (state: RootState) => state.authentication
  );

  useEffect(() => {
    if (isLoginSuccess) {
      console.log(isLoginSuccess);
      localStorage.setItem('ngon:token', isLoginSuccess);
      dispatch(setToken(isLoginSuccess));
      dispatch(resetAuthentication())
      navigate("/", {
        replace: true,
      });
    }
  }, [isLoginSuccess]);
  
  const { values, handleChange, errors, handleSubmit } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      email: yup.string().required("Email is required"),
      password: yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      dispatch(loginUser(values));
    },
  });

  return (
    <>
      <div className="flex items-center justify-center w-screen bg-white h-screen">
        <div className="border-[1px] border-dashed border-slate-300 rounded-md bg-white drop-shadow-xl min-w-[33%] py-4">
          <div className="text-center mb-4 px-4 text-black">Login or Sign up</div>
          <Divider dashed />
          <div className="my-4 px-4 text-black">Welcome to Ngon</div>
          <Form layout="vertical" className="px-4 gap-2">
            <Form.Item label="Email address">
              <TooltipInputField message={errors.email || null}>
                <Input
                  placeholder="Email address"
                  name="email"
                  value={values.email}
                  status={errors.email ? "error" : ""}
                  onChange={handleChange}
                />
              </TooltipInputField>
            </Form.Item>
            <Form.Item label="Password">
              <TooltipInputField message={errors.password || null}>
                <Input.Password
                  placeholder="password"
                  name="password"
                  value={values.password}
                  status={errors.password ? "error" : ""}
                  onChange={handleChange}
                />
              </TooltipInputField>
            </Form.Item>
            <Button
              block
              type="primary"
              shape="round"
              className="mt-2"
              loading={isLoginLoading}
              disabled={isLoginLoading}
              onClick={() => {
                handleSubmit();
              }}
            >
              Login
            </Button>
          </Form>

          <Divider dashed>or</Divider>
          <div className="px-4">
            <Button block shape="round" className="mt-4 flex items-center">
              <FaFacebookSquare size={16} />{" "}
              <span className="flex-1">Continue with Facebook</span>
            </Button>
            <Button block shape="round" className="mt-4 flex items-center">
              <GrLinkedinOption size={16} />{" "}
              <span className="flex-1">Continue with Linkedin</span>
            </Button>
            <Button block shape="round" className="mt-4 flex items-center">
              <FcGoogle /> <span className="flex-1">Continue with Gmail</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
