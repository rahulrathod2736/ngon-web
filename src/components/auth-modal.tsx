import { Modal } from "antd";
import { useCallback } from "react";
import { LoginPage } from "../pages/login.page";
import { closeGlobalModal } from "../redux/authReducer";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { RegisterPage } from "../pages/register.page";

export const AuthModal = () => {
  const { authModal = "" } = useAppSelector(
    (state: RootState) => state.authentication
  );
  const dispatch = useAppDispatch();

  /**
   * Get Content Based on authModal value
   * login - Login Modal
   * register - Register Modal
   */
  const getModalContent = useCallback(() => {
    switch (authModal) {
      case "login":
        return <LoginPage isFullScreen={false} />;
      case "register":
        return <RegisterPage isFullScreen={false} />;
      default:
        return <></>;
    }
  }, [authModal]);

  return (
    <>
      <Modal
        open={authModal === "login" || authModal === "register"}
        onCancel={() => {
          dispatch(closeGlobalModal());
        }}
        footer={null}
      >
        <div className="bg-white h-full rounded-lg">{getModalContent()}</div>
      </Modal>
    </>
  );
};
