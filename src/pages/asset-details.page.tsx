import {
  Avatar,
  Badge,
  Button,
  Divider,
  Input,
  message,
  Modal,
  Rate,
  Tabs,
  Tag,
} from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import ReactGa from "react-ga";
import { AiFillHeart, AiOutlineComment } from "react-icons/ai";
import { FaGooglePay } from "react-icons/fa";
import { FiInfo, FiShare2 } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";
import { IoArrowDownOutline } from "react-icons/io5";
import { SiPaytm } from "react-icons/si";
import { TiTags } from "react-icons/ti";
import { useParams } from "react-router-dom";
import { Comments } from "../components/comments";
import { ModelViewer } from "../components/model-viewer";
import { Reviews } from "../components/reviews";
import { submitComment, submitReviews } from "../redux/assetReducer";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { followUnfollowUsers } from "../redux/userReducer";
import { axiosInstance } from "../utils/axios";
import { apiRoutes } from "../utils/constants/apiRoutes";
import { currencyFormatter, getFullName } from "../utils/functions";
import { INgonAsset } from "../utils/interface";

export const AssetDetails = () => {
  const { id } = useParams();
  const {
    isSubmitReviewLoading,
    isSubmitCommentLoading,
    isGetModelUrlLoading,
  } = useAppSelector((state: RootState) => state.asset);
  const { userProfile, isFollowUnfollowLoading } = useAppSelector(
    (state: RootState) => state.user
  );
  const dispatch = useAppDispatch();
  const [assetDetails, setAssetDetails] = useState<INgonAsset | null>(null);
  const [assetModelUrl, setAssetModelUrl] = useState<Record<
    string,
    any
  > | null>(null);
  const [assetDetailsLoading, setAssetDetailsLoading] = useState<boolean>(true);
  const [assetModelLoading, setAssetModelLoading] = useState<boolean>(true);
  const [downloadModal, setDownloadModal] = useState<{
    open: boolean;
    data: Record<string, any> | null;
    models: Record<string, any>[];
    loading: boolean;
  }>({
    open: false,
    data: null,
    models: [],
    loading: false,
  });
  const [ratings, setRatings] = useState({
    rating: 4.5,
    review: "",
  });
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (id) {
      getAssetDetailById(id);
      getAssetModelUrlById(id);
    }
  }, [id]);

  const getAssetDetailById = async (id: string) => {
    try {
      setAssetDetailsLoading(true);
      const resp = await axiosInstance.get(
        `${apiRoutes.getAssetDetails.replace(":assetId", id)}`
      );
      setAssetDetails(resp?.data?.data || {});
    } catch (err: any) {
      message.error(err?.message || "Something went Wrong!");
    } finally {
      setAssetDetailsLoading(false);
    }
  };

  const getAssetModelUrlById = async (id: string) => {
    try {
      setAssetModelLoading(true);
      const resp = await axiosInstance.get(
        `${apiRoutes.getModelUrls.replace(":assetId", id)}`
      );
      setAssetModelUrl(resp?.data?.data || {});
    } catch (err: any) {
      message.error(err?.message || "Something went Wrong!");
    } finally {
      setAssetModelLoading(false);
    }
  };

  const likeUnlikeAssets = async () => {
    try {
      if (id) {
        const resp = await axiosInstance.put(
          `${apiRoutes.likeUnlikeAssets.replace(":assetId", id)}`
        );
        setAssetDetails(resp?.data?.data || {});
      }
    } catch (err: any) {
      message.error(err?.message || "Something went Wrong!");
    }
  };

  const followUnfollowUsersById = () => {
    dispatch(followUnfollowUsers({ id: assetDetails?.user?._id }));
  };

  const submitReviewById = () => {
    dispatch(submitReviews({ id, ...ratings }));
  };

  const submitCommentById = () => {
    dispatch(submitComment({ id, comment }));
  };

  const modelViewer = useCallback(() => {
    if (isGetModelUrlLoading) {
      return (
        <div className="w-full h-96 bg-white rounded-md flex items-center justify-center">
          Loading...
        </div>
      );
    } else if (!isGetModelUrlLoading && assetModelUrl) {
      return (
        <div className="w-full h-96 bg-white rounded-md">
          <ModelViewer modelUrl={assetModelUrl?.glbUrl} />
        </div>
      );
    }
    return <></>;
  }, [isGetModelUrlLoading, assetModelUrl]);

  const openDownloadModel = async () => {
    setDownloadModal((i) => ({
      ...i,
      open: false,
      loading: true,
    }));
    const resp: Record<string, any> = await axiosInstance.get(
      `${apiRoutes.getModelUrls.replace(
        ":assetId",
        assetDetails?._id || ""
      )}?isAllModelLink=true`
    );
    setDownloadModal((i) => ({
      ...i,
      open: true,
      loading: false,
      models: resp.data.data.models,
    }));
  };

  const downloadSelectedModel = (i: Record<string, any>) => {
    const link = document.createElement("a");
    link.href = i.url;
    link.setAttribute("download", ""); //or any other extension
    document.body.appendChild(link);
    link.click();
    document.removeChild(link);
    if (
      !window.location.href.includes("localhost") ||
      !window.location.href.includes("127.0.0.1")
    ) {
      ReactGa.event({
        category: "Asset Download",
        action: "download",
        label: i.key,
      });
    }
  };

  const closeDownloadModal = () => {
    setDownloadModal((i) => ({
      ...i,
      open: false,
      data: null,
      loading: false,
      models: [],
    }));
  };

  if (assetDetailsLoading || assetModelLoading) {
    return (
      <div className="flex gap-6 w-full p-8 bg-white text-lg items-center justify-center">
        <ImSpinner8 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex gap-6 w-full p-8 bg-white">
      <div className="flex-1 flex-col">
        {modelViewer()}
        <div className="flex flex-col mt-6">
          <div className="flex justify-between">
            <div className="text-xl">{assetDetails?.name}</div>
            <div className="flex items-center">
              <div className="flex items-center mx-2 text-gray-700 ">
                <AiFillHeart
                  className={`${
                    assetDetails?.likes?.includes(userProfile?._id)
                      ? "text-red-500"
                      : ""
                  } hover:text-red-400 cursor-pointer`}
                  onClick={likeUnlikeAssets}
                />
                <span className="ml-2 text-xs">
                  {assetDetails?.likes?.length}
                </span>
              </div>
              <Divider type="vertical" />
              <div className="flex items-center mx-2 text-gray-700">
                <FiShare2 />
                <span className="ml-2 text-xs">0</span>
              </div>
              <Divider type="vertical" />
              <div className="flex items-center mx-2 text-gray-700">
                <AiOutlineComment />
                <span className="ml-2 text-xs">
                  {assetDetails?.comments?.length || 0}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center mt-4">
            <div className="flex flex-row items-center">
              <div>
                {assetDetails?.user?.profileImage ? (
                  <Avatar
                    src={assetDetails.user.profileImage}
                    shape="square"
                    className="rounded-xl drop-shadow-xl"
                    size={45}
                  />
                ) : (
                  <Avatar
                    shape="square"
                    className="rounded-xl drop-shadow-xl"
                    size={45}
                  >
                    {assetDetails?.user?.firstName[0]}
                  </Avatar>
                )}
              </div>
              <div className="ml-4">
                <div>{getFullName(assetDetails?.user || {})}</div>
                {assetDetails?.user?._id !== userProfile?._id ? (
                  <Button
                    size="small"
                    className="mt-1 !text-xs"
                    danger
                    type="primary"
                    loading={isFollowUnfollowLoading}
                    disabled={isFollowUnfollowLoading}
                    onClick={followUnfollowUsersById}
                  >
                    {userProfile?.following?.includes(assetDetails?.user?._id)
                      ? "Unfollow"
                      : "Follow"}
                  </Button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <Divider className="!my-6" />
          {assetDetails?.description && (
            <div className="my-1">{assetDetails?.description}</div>
          )}
          <div className="my-1 text-gray-500 flex items-center">
            <FiInfo size={16} />
            <span className="ml-2">
              Published {moment(assetDetails?.createdAt).from(moment())}
            </span>
          </div>
          <div className="my-1 text-gray-500 flex items-center">
            <TiTags size={16} />
            <span className="ml-2">
              {assetDetails?.tags?.map((tag: string) => {
                return <Tag className="text-white bg-slate-600">{tag}</Tag>;
              })}
            </span>
          </div>
          <div className="my-1 text-gray-500 flex items-center">
            <TiTags size={16} />
            <span className="ml-2">
              {assetDetails?.category?.map((category) => {
                return (
                  <Tag className="text-white bg-slate-600">
                    {category.label}
                  </Tag>
                );
              })}
            </span>
          </div>
        </div>
        {!assetDetails?.reviews?.some((r) => r.user._id === userProfile?._id) &&
        assetDetails?.user?._id !== userProfile?._id ? (
          <div className="p-4 bg-slate-100 mt-4 rounded-md flex flex-col gap-4 items-start">
            <div className="flex items-center">
              <div>Give your Rating:</div>
              <Rate
                allowHalf
                allowClear
                defaultValue={ratings.rating}
                onChange={(value) => {
                  setRatings((prevData) => ({ ...prevData, rating: value }));
                }}
                character={<AiFillHeart />}
                className="text-red-500 h-5 ml-3"
              />
            </div>
            <Input.TextArea
              placeholder="Write your reviews."
              rows={2}
              className="!resize-none bg-slate-100"
              value={ratings.review}
              onChange={(e) => {
                setRatings((prevData) => ({
                  ...prevData,
                  review: e.target.value,
                }));
              }}
            />
            <Button
              onClick={submitReviewById}
              loading={isSubmitReviewLoading}
              disabled={isSubmitReviewLoading}
            >
              Submit Review
            </Button>
          </div>
        ) : (
          <></>
        )}
        {!assetDetails?.comments?.some(
          (r) => r.user._id === userProfile?._id
        ) && assetDetails?.user?._id !== userProfile?._id ? (
          <div className="p-4 bg-slate-100 mt-4 rounded-md flex flex-col gap-4 items-start">
            <Input.TextArea
              placeholder="Write your comments."
              rows={2}
              className="!resize-none bg-slate-100"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
            <Button
              onClick={submitCommentById}
              loading={isSubmitCommentLoading}
              disabled={isSubmitCommentLoading}
            >
              Submit Comment
            </Button>
          </div>
        ) : (
          <></>
        )}
        <div className="mt-4">
          <Tabs
            items={[
              ...(assetDetails?.reviews && assetDetails?.reviews?.length > 0
                ? [
                    {
                      key: "reviews",
                      label: (
                        <div className="mx-4">
                          Reviews
                          <Badge
                            count={assetDetails?.reviews?.length}
                            showZero
                            color="primary"
                            className="mx-3"
                          />
                        </div>
                      ),
                      children: (
                        <Reviews reviews={assetDetails?.reviews || []} />
                      ),
                    },
                  ]
                : []),
              ...(assetDetails?.comments && assetDetails?.comments?.length > 0
                ? [
                    {
                      key: "comments",
                      label: (
                        <div className="mx-4">
                          Comments
                          <Badge
                            count={assetDetails?.comments?.length}
                            showZero
                            color="primary"
                            className="mx-3"
                          />
                        </div>
                      ),
                      children: (
                        <Comments comments={assetDetails?.comments || []} />
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </div>
      </div>
      <div className="w-1/4">
        {assetDetails?.priceModel === "free" ? (
          <div>
            <Button
              block
              type="primary"
              danger
              onClick={openDownloadModel}
              loading={downloadModal?.loading}
            >
              Download
            </Button>
          </div>
        ) : (
          <div>
            <div className="text-xl">
              {currencyFormatter(assetDetails?.price ?? 0)}
            </div>
            <div className="mt-2">
              <ul className="list-inside">
                <li>Get all Updated versions</li>
                <li>Support from sellers</li>
                <li>secure payments</li>
              </ul>
            </div>
            <Button block type="primary" danger>
              Add to Cart
            </Button>
            <div className="w-full flex flex-wrap justify-center my-4 items-center">
              <div className="mx-3">
                <FaGooglePay size={40} />
              </div>
              <div className="mx-3">
                <SiPaytm size={40} />
              </div>
              <div className="mx-3">
                <FaGooglePay size={40} />
              </div>
              <div className="mx-3">
                <SiPaytm size={40} />
              </div>
              <div className="mx-3">
                <FaGooglePay size={40} />
              </div>
              <div className="mx-3">
                <SiPaytm size={40} />
              </div>
              <div className="mx-3">
                <FaGooglePay size={40} />
              </div>
              <div className="mx-3">
                <SiPaytm size={40} />
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-200 p-3 rounded-md text-xs mt-4">
          <div className="flex justify-between">
            <span>Available File Formats</span>
            <div className="flex gap-2 flex-wrap w-1/2 justify-end">
              {assetModelUrl?.models?.map((i: Record<string, any>) => {
                return (
                  <span>.{i.key.split(".")[i.key.split(".").length - 1]}</span>
                );
              })}
            </div>
          </div>
          <Divider className="!my-2" />
          <div className="flex justify-between">
            <span>License</span>
            <span>Standard</span>
          </div>
          <Divider className="!my-2" />
          <div className="flex justify-between">
            <span>Import In</span>
            <span>N/A</span>
          </div>
          <Divider className="!my-2" />
          <div className="flex justify-between">
            <span>Textures</span>
            <span>2</span>
          </div>
          <Divider className="!my-2" />
          <div className="flex justify-between">
            <span>Materials</span>
            <span>10</span>
          </div>
          <Divider className="!my-2" />
          <div className="flex justify-between">
            <span>Animations</span>
            <span>None</span>
          </div>
        </div>
      </div>

      {downloadModal?.open && (
        <Modal
          open={downloadModal?.open}
          onCancel={closeDownloadModal}
          footer={null}
        >
          <div className="p-4">Download NGON Assets</div>
          <Divider dashed />
          <div className="p-4 max-h-[66vh] overflow-auto">
            <div className="flex flex-col gap-4">
              {downloadModal?.models?.map((i: Record<string, any>) => {
                return (
                  <div className="p-4 flex items-center gap-4 bg-gray-50 rounded-md border-dashed border-[1px] border-slate-200">
                    <div className="uppercase flex flex-row justify-between w-full gap-4 items-center">
                      <div className="flex flex-col">
                        <span>
                          {i.key.split("/")[i.key.split("/").length - 1]}
                        </span>
                        <span className="text-slate-400 text-xs">
                          {(i.size / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <div
                        className="!w-10 !h-10 flex items-center justify-center bg-slate-200 rounded-full cursor-pointer hover:bg-slate-300 transition-all"
                        onClick={() => {
                          downloadSelectedModel(i);
                        }}
                      >
                        {downloadModal.loading ? (
                          <ImSpinner8 className="animate-spin" />
                        ) : (
                          <IoArrowDownOutline size={14} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Divider dashed />
          <div className="p-4">
            <div className="flex gap-4 justify-end">
              <Button
                onClick={closeDownloadModal}
                disabled={downloadModal?.loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
