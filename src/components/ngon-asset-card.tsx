import { FiEdit } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { INgonAsset } from "../utils/interface";
import { RootState, useAppSelector } from "../redux/store";

interface IProps {
  asset: INgonAsset;
}

export const NgonAssetCard = ({ asset }: IProps) => {
  const { userProfile } = useAppSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const navigateToEdit = (id: string) => {
    navigate("/asset-onboarding/details/" + id);
  };
  return (
    <div className="bg-white drop-shadow-2xl rounded-md mb-4">
      <div className="h-36 relative">
        <img
          src={asset?.image || "https://picsum.photos/500/300?random=1"}
          className="w-full h-36 object-cover rounded-t-md"
        />
        {asset?.user?._id === userProfile?._id ? (
          <span
            className="absolute right-3 bottom-3 bg-white h-8 w-8 flex items-center justify-center rounded-full cursor-pointer"
            onClick={() => {
              navigateToEdit(asset._id);
            }}
          >
            <FiEdit size={14} />
          </span>
        ) : (
          <></>
        )}
      </div>
      <div className="p-4 flex flex-col">
        <span className="">
          <Link
            to={`/assets/${asset._id}`}
            className="text-black hover:text-black underline"
          >
            {asset.name}
          </Link>
        </span>
        <span className="text-xs text-gray-400 leading-normal line-clamp-2">
          {asset.description}
        </span>
      </div>
    </div>
  );
};
