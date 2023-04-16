import React, {useCallback, useEffect, useState} from "react";
import {Avatar, Badge, Button, Divider, Input, Rate, Tabs, Tag,} from "antd";
import {ModelViewer} from "../components/model-viewer";
import {TiTags} from "react-icons/ti";
import {FiInfo, FiShare2} from "react-icons/fi";
import {AiFillHeart, AiOutlineComment} from "react-icons/ai";
import {FaGooglePay} from "react-icons/fa";
import {ImSpinner8} from "react-icons/im";
import {SiPaytm} from "react-icons/si";
import {Reviews} from "../components/reviews";
import {Comments} from "../components/comments";
import {RootState, useAppDispatch, useAppSelector} from "../redux/store";
import {useParams} from "react-router-dom";
import {getAssetDetailById, getModelUrl, likeUnlikeById, submitComment, submitReviews,} from "../redux/assetReducer";
import moment from "moment";
import {followUnfollowUsers} from "../redux/userReducer";
import {getFullName} from "../utils/functions";
import {axiosInstance} from "../utils/axios";
import {apiRoutes} from "../utils/constants/apiRoutes";
import {ImageUpload} from "../components/image-upload";

export const AssetDetails = () => {
    const {id} = useParams();
    const {
        isGetAssetByIdLoading,
        isGetAssetByIdError,
        assetDetails,
        isLikeUnlikeLoading,
        isLikeUnlikeError,
        isSubmitReviewLoading,
        isSubmitCommentLoading,
        isGetModelUrlLoading,
        assetModelUrl,
    } = useAppSelector((state: RootState) => state.asset);
    const {userProfile, isFollowUnfollowLoading} = useAppSelector(
        (state: RootState) => state.user
    );
    const dispatch = useAppDispatch();
    const [ratings, setRatings] = useState({
        rating: 4.5,
        review: "",
    });
    const [comment, setComment] = useState("");

    useEffect(() => {
        if (id) {
            dispatch(getAssetDetailById({id}));
            dispatch(getModelUrl({id}));
        }
    }, [id]);

    const likeUnlikeAssets = () => {
        dispatch(likeUnlikeById({id}));
    };

    const followUnfollowUsersById = () => {
        dispatch(followUnfollowUsers({id: assetDetails?.user?._id}));
    };

    const submitReviewById = () => {
        dispatch(submitReviews({id, ...ratings}));
    };

    const submitCommentById = () => {
        dispatch(submitComment({id, comment}));
    };

    const modelViewer = useCallback(() => {
        if (isGetModelUrlLoading) {
            return <div className="w-full h-96 bg-white rounded-md flex items-center justify-center">
                Loading...
            </div>;
        } else if (!isGetModelUrlLoading && assetModelUrl) {
            return <div className="w-full h-96 bg-white rounded-md">
                <ModelViewer modelUrl={assetModelUrl}/>
            </div>;
        }
        return <></>

    }, [isGetModelUrlLoading, assetModelUrl])

    const downloadModel = async () => {
        if (id != null) {
            const resp = await axiosInstance.post(
                `${apiRoutes.assetMedia.replace(":assetId", id)}`,
                {
                    "type": "model",
                    "action": "download"
                }
            );
            const link = document.createElement("a");
            link.href = resp.data.data.url;
            link.setAttribute("download", ""); //or any other extension
            document.body.appendChild(link);
            link.click();
        }
    }

    if (isGetAssetByIdLoading) {
        return (
            <div className="flex gap-6 w-full p-8 bg-white text-lg items-center justify-center">
                <ImSpinner8 className="animate-spin"/>
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
                            <Divider type="vertical"/>
                            <div className="flex items-center mx-2 text-gray-700">
                                <FiShare2/>
                                <span className="ml-2 text-xs">200</span>
                            </div>
                            <Divider type="vertical"/>
                            <div className="flex items-center mx-2 text-gray-700">
                                <AiOutlineComment/>
                                <span className="ml-2 text-xs">
                  {assetDetails?.comments?.length || 0}
                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center mt-4">
                        <div className="flex flex-row items-center">
                            <div>
                                <Avatar
                                    src="https://picsum.photos/500/300?random=1"
                                    shape="square"
                                    className="rounded-xl drop-shadow-xl w-14 h-14"
                                />
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
                        <Button
                            type="primary"
                            color="success"
                            size="small"
                            className="!text-xs"
                        >
                            800 Buys
                        </Button>
                    </div>
                    <Divider className="!my-6"/>
                    {assetDetails?.description && (
                        <div className="my-1">{assetDetails?.description}</div>
                    )}
                    <div className="my-1 text-gray-500 flex items-center">
                        <FiInfo size={16}/>
                        <span className="ml-2">
              Published {moment(assetDetails?.createdAt).from(moment())}
            </span>
                    </div>
                    <div className="my-1 text-gray-500 flex items-center">
                        <TiTags size={16}/>
                        <span className="ml-2">
              {assetDetails?.tags?.map((tag: string) => {
                  return <Tag className="text-white bg-slate-600">{tag}</Tag>;
              })}
            </span>
                    </div>
                    <div className="my-1 text-gray-500 flex items-center">
                        <TiTags size={16}/>
                        <span className="ml-2">
              {assetDetails?.category?.map((category) => {
                  return <Tag className="text-white bg-slate-600">{category.label}</Tag>;
              })}
            </span>
                    </div>
                    <div className="my-1">
                        DMG, Joe, smith and 1500 others liked this model
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
                                    setRatings((prevData) => ({...prevData, rating: value}));
                                }}
                                character={<AiFillHeart/>}
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
                                            <Reviews reviews={assetDetails?.reviews || []}/>
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
                                            <Comments comments={assetDetails?.comments || []}/>
                                        ),
                                    },
                                ]
                                : []),
                        ]}
                    />
                </div>
            </div>
            <div className="w-1/4">
                {assetDetails?.priceModel === "free" ? <div>
                    <Button block type="primary" danger onClick={downloadModel}>
                        Download
                    </Button>
                </div> : <div>
                    <div className="text-xl">Rs. {assetDetails?.price}</div>
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
                            <FaGooglePay size={40}/>
                        </div>
                        <div className="mx-3">
                            <SiPaytm size={40}/>
                        </div>
                        <div className="mx-3">
                            <FaGooglePay size={40}/>
                        </div>
                        <div className="mx-3">
                            <SiPaytm size={40}/>
                        </div>
                        <div className="mx-3">
                            <FaGooglePay size={40}/>
                        </div>
                        <div className="mx-3">
                            <SiPaytm size={40}/>
                        </div>
                        <div className="mx-3">
                            <FaGooglePay size={40}/>
                        </div>
                        <div className="mx-3">
                            <SiPaytm size={40}/>
                        </div>
                    </div>
                </div>}

                <div className="bg-slate-200 p-3 rounded-md text-xs mt-4">
                    <div className="flex justify-between">
                        <span>License</span>
                        <span>Standard</span>
                    </div>
                    <Divider className="!my-2"/>
                    <div className="flex justify-between">
                        <span>Import In</span>
                        <span>N/A</span>
                    </div>
                    <Divider className="!my-2"/>
                    <div className="flex justify-between">
                        <span>Textures</span>
                        <span>2</span>
                    </div>
                    <Divider className="!my-2"/>
                    <div className="flex justify-between">
                        <span>Materials</span>
                        <span>10</span>
                    </div>
                    <Divider className="!my-2"/>
                    <div className="flex justify-between">
                        <span>Animations</span>
                        <span>None</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
