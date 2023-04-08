import { Avatar, Button } from "antd";
import { IComment } from "../utils/interface";
import { getFullName } from "../utils/functions";

interface IProps {
  comments: IComment[];
}

export const Comments = ({ comments }: IProps) => {
  return (
    <div className="mt-4">
      {comments.map((comment) => {
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
                <div className="">{getFullName(comment?.user)}</div>
                <div className="line-clamp-2 text-slate-600">
                  {comment.comment}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
