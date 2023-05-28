import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { openGlobalModal } from "../redux/authReducer";

export const CreateNGONAssets = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { authToken } = useAppSelector((state: RootState) => state.user);
  const navigateToNewAssets = () => {
    if (authToken) {
      navigate("/asset-onboarding/details");
    } else {
      dispatch(openGlobalModal("login"));
    }
  };
  return (
    <Button
      onClick={navigateToNewAssets}
      size="small"
      className="!text-xs !px-3"
    >
      Create NGON Assets
    </Button>
  );
};
