import { Avatar, Button, Rate } from "antd";
import { IReview } from "../utils/interface";
import { getFullName } from "../utils/functions";
import { AiFillHeart } from "react-icons/ai";
import React from "react";

interface IProps {
  reviews: IReview[];
}

export const Reviews = ({ reviews }: IProps) => {
  return (
    <div className="mt-4">
      {reviews.map((review) => {
        return (
          <div className="flex flex-row justify-between items-center mb-8">
            <div className="flex flex-row items-center">
              <div>
                {review.user.profileImage ? (
                  <Avatar
                    src={review.user.profileImage}
                    shape="square"
                    className="rounded-xl drop-shadow-xl"
                    size={35}
                  />
                ) : (
                  <Avatar
                    shape="square"
                    className="rounded-xl drop-shadow-xl"
                    size={45}
                  >
                    {review.user.firstName[0]}
                  </Avatar>
                )}
              </div>
              <div className="ml-4">
                <div className="">{getFullName(review.user)}</div>
                <div className="flex mt-2 items-center">
                  <Rate
                    defaultValue={review.rating}
                    allowHalf
                    character={<AiFillHeart />}
                    className="text-red-500 h-3 text-xs"
                    disabled
                  />
                  <div className="line-clamp-2 text-slate-600 ml-2 text-slate-500">
                    {review.review}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
