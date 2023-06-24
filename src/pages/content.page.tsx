import { Button, Input } from "antd";
import { useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import BuyModels from "../assets/buy-models.png";
import ConnectArtists from "../assets/connect-artists.png";
import JoinNgon from "../assets/join-ngon.png";
import { ReactComponent as NGONLogo } from "../assets/ngon.svg";
import OpenSource from "../assets/open-source.png";
import ShowArt from "../assets/show-art.png";
import { openGlobalModal } from "../redux/authReducer";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { showSuccessMessage } from "../utils/functions";
import { ModelViewer } from "../components/model-viewer";

export const ContentPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { authToken } = useAppSelector((state: RootState) => state.user);
  const navigateToAssets = () => {
    if (authToken) {
      navigate("/assets");
    } else {
      dispatch(openGlobalModal("login"));
    }
  };
  const joinNGONModal = () => {
    dispatch(openGlobalModal("register"));
  };

  const handleSearchValue = () => {
    if (authToken) {
      navigate({
        pathname: "/assets",
        search: createSearchParams({
          searchQuery,
        }).toString(),
      });
    } else {
      dispatch(openGlobalModal("login"));
    }
  };
  return (
    <div className="bg-white">
      <div className="h-[80vh] md:h-[66vh] bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <NGONLogo className="w-full md:w-80 h-48" />
          <div className="flex flex-wrap md:flex-nowrap gap-6">
            <Input
              className="w-full md:min-w-[500px] rounded-full pl-5"
              placeholder="Search your query here..."
              size="large"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
            <Button
              className="!rounded-full w-full md:w-auto !px-8"
              type="primary"
              size="large"
              onClick={handleSearchValue}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6 bg-[#1677ff] text-white text-xl text-center">
        Join NGON for free
      </div>
      <div className="w-full py-8">
        <div className="aspect-square max-h-[400px] max-w-[400px] m-auto bg-white bg-[#F5663A]">
          <ModelViewer modelUrl="https://ngon-assets-images.s3.ap-south-1.amazonaws.com/home-model.glb" />
        </div>
      </div>
      
      <div className="md:h-[400px] w-full bg-white flex flex-col md:flex-row items-start gap-5 md:gap-0">
        <div className="w-full md:w-1/2 flex items-center justify-center h-full">
          <img className="w-full md:w-auto" src={JoinNgon} />
        </div>
        <div className="md:w-1/2 flex items-center justify-start p-8 lg:px-28 bg-[#0D1F47] h-full text-white">
          <div className="flex items-start gap-6 flex-col">
            <div className="text-xl">Join NGON to Live in 3D World</div>
            <div className="md:w-2/3">
              Join NGON to utilise your 3D skills to create innovative 3D models
              to discover 3D models which suits the demands of your business.
            </div>
            <Button
              className="!rounded-full !px-4 !border-white hover:!text-black"
              onClick={joinNGONModal}
            >
              Join NGON
            </Button>
          </div>
        </div>
      </div>

      <div className="md:h-[400px] w-full bg-white flex flex-col md:flex-row items-start gap-5 md:gap-0">
        <div className="md:w-1/2 flex items-center justify-start p-8 lg:px-28 bg-[#FCB25D] h-full text-white order-2 md:order-1">
          <div className="flex items-start gap-6 flex-col">
            <div className="text-xl">Buy and Sell Models with Ngon</div>
            <div className="md:w-2/3">
              Upload your Models for sell and increase your income buy uploading free or paid innovative models
            </div>
            <Button
              className="!rounded-full !px-4 !border-white hover:!text-black"
              onClick={navigateToAssets}
            >
              Buy Models
            </Button>
          </div>
        </div>
        <div className="w-full max-w-full md:w-1/2 flex items-center justify-center h-full order-1 md:order-2">
          <img className="w-full" src={BuyModels} />
        </div>
      </div>

      <div className="md:h-[400px] w-full bg-white flex flex-col md:flex-row items-start gap-5 md:gap-0">
        <div className="w-full md:w-1/2 flex items-center justify-center h-full">
          <img className="w-full md:w-auto" src={ShowArt} />
        </div>
        <div className="md:w-1/2 flex items-center justify-start p-8 lg:px-28 bg-[#0D1F47] h-full text-white">
          <div className="flex items-start gap-6 flex-col">
            <div className="text-xl">Share and Exhibit Your work</div>
            <div className="md:w-2/3">
              Are you creative 3D Artist?? Show your creative and Innovative art to ourb audience and generate massive incomes.
            </div>
            <Button
              className="!rounded-full !px-4 !border-white hover:!text-black"
              onClick={() => {
                showSuccessMessage("Feature is in Development, Releases soon.");
              }}
            >
              Show Your Art
            </Button>
          </div>
        </div>
      </div>

      <div className="md:h-[400px] w-full bg-white flex flex-col md:flex-row items-start gap-5 md:gap-0">
        <div className="md:w-1/2 flex items-center justify-start p-8 lg:px-28 bg-[#F5663A] h-full text-white order-2 md:order-1">
          <div className="flex items-start gap-6 flex-col">
            <div className="text-xl">Join First Open Source 3D Platform</div>
            <div className="md:w-2/3">
              In future, We are planning to introduce feature called Open source for contribution.
            </div>
            <Button
              className="!rounded-full !px-4 !border-white hover:!text-black"
              onClick={() => {
                showSuccessMessage("Feature is in Development, Releases soon.");
              }}
            >
              Open Source
            </Button>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center h-full order-1 md:order-2">
          <img className="w-full md:w-auto" src={OpenSource} />
        </div>
      </div>

      <div className="md:h-[400px] w-full bg-white flex flex-col md:flex-row items-start gap-5 md:gap-0">
        <div className="w-full md:w-1/2 flex items-center justify-center h-full">
          <img className="w-full md:w-auto" src={ConnectArtists} />
        </div>
        <div className="md:w-1/2 flex items-center justify-start p-8 lg:px-28 bg-[#616161] h-full text-white">
          <div className="flex items-start gap-6 flex-col">
            <div className="text-xl">Meet and Learn From Artists</div>
            <div className="md:w-2/3">
              Excited to connect with innovatove artists. Explore your network and share experience.
            </div>
            <Button
              className="!rounded-full !px-4 !border-white hover:!text-black"
              onClick={() => {
                showSuccessMessage("Feature is in Development, Releases soon.");
              }}
            >
              Connects With Artists
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 bg-[#066D42] text-white text-xl text-center mt-8">
        Become a seller at Ngon
      </div>

    </div>
  );
};
