import { Form, Input, InputNumber, Button } from "antd";
import {
  getCurrencySymbol,
  numberFormatter,
  parseLocaleNumber,
} from "../utils/functions";
import TooltipInputField from "./tooltipInputField/tooltipInputField";

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
  const openPaypalTab = () => {
    if (import.meta.env.VITE_PAYPAL_ID) {
      window.open(import.meta.env.VITE_PAYPAL_ID, "_blank", "noreferrer");
    }
  };
  return (
    <div className={""}>
      <div className={`flex gap-4 ${type === "upi" ? "flex-row" : "flex-col"}`}>
        {type === "upi" ? (
          import.meta.env.VITE_UPI_ID ? (
            <img
              src={import.meta.env.VITE_UPI_ID}
              className={"aspect-square w-40"}
              loading={"lazy"}
            />
          ) : (
            <></>
          )
        ) : (
          <Button shape="round" type="dashed" onClick={openPaypalTab}>
            Pay Using Paypal
          </Button>
        )}
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
