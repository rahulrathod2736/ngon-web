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
  message.error(err?.response?.data?.message ?? err.message);
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

export const currencyFormatter = ({
  value,
  currency = "INR",
  currencyDisplay = "code",
}: {
  value: number;
  currency?: string;
  currencyDisplay?: "code" | "narrowSymbol";
}) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay,
  }).format(value);
};

export const numberFormatter = ({ value }: { value: number }) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
  }).format(value);
};

export const getCurrencySymbol = ({
  locale = "en-US",
  currency,
}: {
  locale?: string;
  currency: string;
}) => {
  return (0)
    .toLocaleString(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, "")
    .trim();
};

/**
 * Parse a localized number to a float.
 * @param {string} number - the localized number
 * @param {string} locale - [optional] the locale that the number is represented in. Omit this parameter to use the current locale.
 */
export const parseLocaleNumber = (number: string, locale: string = "en-US") => {
  const thousandSeparator = Intl.NumberFormat(locale)
    .format(11111)
    .replace(/\p{Number}/gu, "");
  const decimalSeparator = Intl.NumberFormat(locale)
    .format(1.1)
    .replace(/\p{Number}/gu, "");

  return parseFloat(
    number
      .replace(new RegExp("\\" + thousandSeparator, "g"), "")
      .replace(new RegExp("\\" + decimalSeparator), ".")
  );
};

export const getColorBasedOnStatus = (status: string) => {
  let color = "default";
  switch (status) {
    case "pending":
      color = "default";
      break;
    case "accepted":
      color = "green";
      break;
    case "rejected":
      color = "red";
      break;
  }
  return color;
};
