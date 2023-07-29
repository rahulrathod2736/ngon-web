import TooltipInputField from "./tooltipInputField/tooltipInputField";
import { Form, Input, InputNumber } from "antd";
import React from "react";
import {
  getCurrencySymbol,
  numberFormatter,
  parseLocaleNumber,
} from "../utils/functions";

export const PaymentForm = ({
  values,
  handleChange,
  setFieldValue,
  errors,
  type,
}: {
  values: any;
  handleChange: any;
  setFieldValue: any;
  errors: any;
  type: "upi" | "paypal";
}) => {
  return (
    <div className={""}>
      <div className={"flex flex-row gap-4"}>
        <img
          src={
            "https://goqr.me/_Resources/Static/Packages/GoQrMe.Ui/Images/qr_default.png"
          }
          className={"aspect-square w-40"}
          loading={"lazy"}
        />
        <div className={"flex flex-col flex-1"}>
          <Form layout={"vertical"}>
            <Form.Item
              label={`${type === "upi" ? "UPI" : "Paypal"} Transaction ID`}
              className={"w-full"}
            >
              <TooltipInputField
                message={errors.referenceCode ? errors.referenceCode : null}
              >
                <Input
                  placeholder={`${
                    type === "upi" ? "UPI" : "Paypal"
                  } Transaction ID`}
                  className={"w-full"}
                  value={values.referenceCode}
                  onChange={handleChange}
                  name={"referenceCode"}
                  status={errors.referenceCode ? "error" : ""}
                />
              </TooltipInputField>
            </Form.Item>
            <Form.Item label={"Amount"} className={"w-full"}>
              <TooltipInputField message={errors.amount ? errors.amount : null}>
                <InputNumber
                  placeholder={"Enter Amount"}
                  className={"w-full"}
                  prefix={getCurrencySymbol({ currency: "INR" })}
                  value={values.amount}
                  formatter={(value) => numberFormatter({ value: value ?? 0 })}
                  parser={(value) => parseLocaleNumber(value ?? "0")}
                  onChange={(e) => setFieldValue("amount", e)}
                  name={"amount"}
                  status={errors.amount ? "error" : ""}
                />
              </TooltipInputField>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};
