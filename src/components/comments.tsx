import { Avatar, Button } from "antd";
import { IComment } from "../utils/interface";
import { getFullName } from "../utils/functions";
import React from "react";

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
                {comment.user.profileImage ? (
                  <Avatar
                    src={comment.user.profileImage}
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
                    {comment.user.firstName[0]}
                  </Avatar>
                )}
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
