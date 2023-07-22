import { message } from "antd";
import { IUser } from "./interface";

export const getFullName = (user: Partial<IUser>) => {
  const { firstName, lastName } = user;
  return capitalizeSentence([firstName, lastName].filter(Boolean).join(" "));
};

export const showSuccessMessage = (msg: string) => {
  message.success(msg);
};

export const showErrorMessage = (err: any) => {
  message.error(err.message);
};

export const capitalizeSentence = (sentence: string) => {
  const words = sentence.split(" ").filter(Boolean);
  if (words.length === 0) return "";
  return words
    .map((word) => {
      return word[0]?.toUpperCase() + word?.substring(1);
    })
    .join(" ");
};

export const currencyFormatter = (value: number, currency: string = "INR") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "code",
  }).format(value);
};
