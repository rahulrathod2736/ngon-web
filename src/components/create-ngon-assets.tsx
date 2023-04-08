import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export const CreateNGONAssets = () => {
  const navigate = useNavigate();
  const navigateToNewAssets = () => {
    navigate("/asset-onboarding/details");
  };
  return <Button onClick={navigateToNewAssets} size="small" className="!text-xs !px-3">Create NGON Assets</Button>;
};
