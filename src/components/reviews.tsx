import { Avatar, Button, Rate } from "antd";
import { IReview } from "../utils/interface";
import { getFullName } from "../utils/functions";
import { AiFillHeart } from "react-icons/ai";

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
                <Avatar
                  src="https://picsum.photos/500/300?random=1"
                  shape="square"
                  className="rounded-xl drop-shadow-xl w-14 h-14"
                />
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
