import { message } from "antd";
import { IUser } from "./interface";

export const getFullName = (user: Partial<IUser>) => {
  const { firstName, lastName } = user;
  return [firstName, lastName].filter(Boolean).join(" ");
};

export const showSuccessMessage = (msg: string) => {
  message.success(msg);
};

export const showErrorMessage = (err: any) => {
  message.error(err.message);
};
