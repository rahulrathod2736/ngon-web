import React, { useEffect, useState } from "react";
import {
  currencyFormatter,
  showErrorMessage,
  showSuccessMessage,
} from "../utils/functions";
import { Button, Divider, Modal, Tabs } from "antd";
import * as Yup from "yup";
import { useFormik } from "formik";
import { PaymentForm } from "../components/payment-form";
import { axiosInstance } from "../utils/axios";
import { apiRoutes } from "../utils/constants/apiRoutes";
import { RootState, useAppSelector } from "../redux/store";
import { Transactions } from "../components/transactions";
import EWallet from "../assets/e-wallet.jpg";

export const WalletPage = () => {
  const { userProfile } = useAppSelector((state: RootState) => state.user);
  const [wallet, setWallet] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [createWalletLoading, setCreateWalletLoading] = useState(false);
  const [addMoneyModal, setAddMoneyModal] = useState({
    open: false,
    loading: false,
  });
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [currentTab, setCurrentTab] = useState("wallet");

  useEffect(() => {
    if (userProfile?._id && userProfile?.wallet?._id) {
      getWalletData();
    } else {
      setLoading(false);
    }
  }, [userProfile]);

  const getWalletData = async () => {
    try {
      setLoading(true);
      const resp = await axiosInstance.get(`${apiRoutes.getUserWallet}`);
      setWallet(resp?.data?.data || {});
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const openAddMoneyModal = () => {
    setAddMoneyModal({ open: true, loading: false });
  };
  const closeAddMoneyModal = () => {
    resetForm();
    setAddMoneyModal({ open: false, loading: false });
  };

  const {
    values,
    handleChange,
    setFieldValue,
    handleSubmit,
    errors,
    resetForm,
  } = useFormik({
    initialValues: {
      referenceCode: "",
      amount: 0,
      type: "upi",
    },
    validationSchema: Yup.object().shape({
      referenceCode: Yup.string()
        .required("Transaction Id is required.")
        .typeError("Valid Transaction Id is required."),
      amount: Yup.number()
        .required("Amount is required.")
        .typeError("Valid amount is required.")
        .min(1, "Amount should be greater than 1."),
    }),
    validateOnChange: false,
    onSubmit: () => {
      console.log("values", values);
      makeWalletTransactionRequest();
    },
  });

  const makeWalletTransactionRequest = async () => {
    try {
      setAddMoneyModal((val) => ({ ...val, loading: true }));
      const payload = {
        amount: values.amount,
        type: "wallet",
        referenceCode: values.referenceCode,
        paymentType: values.type,
      };
      const resp = await axiosInstance.post(
        `${apiRoutes.addMoneyToWalletRequest}`,
        payload
      );
      if (resp) {
        showSuccessMessage(resp?.data?.message ?? "Request sent successfully.");
        setAddMoneyModal({ open: false, loading: false });
        setIsRefreshing(true);
      }
    } catch (error) {
      showErrorMessage(error);
    } finally {
      setAddMoneyModal((val) => ({ ...val, loading: false }));
    }
  };

  const createNGONWallet = async () => {
    try {
      setCreateWalletLoading(true);
      const resp = await axiosInstance.post(`${apiRoutes.initializeWallet}`);
      if (resp) {
        showSuccessMessage(
          resp?.data?.message ?? "Wallet Created Successfully."
        );
        setWallet(resp?.data?.data || {});
        setCreateWalletLoading(false);
      }
    } catch (error) {
      showErrorMessage(error);
    } finally {
      setCreateWalletLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-4">
      {loading ? (
        <div>Loading...</div>
      ) : wallet?._id ? (
        <>
          <div className={"flex flex-col items-start gap-4"}>
            <div className={"flex flex-row justify-between w-full"}>
              <div className={"text-2xl"}>NGON Wallet</div>
              <Button
                type={"dashed"}
                shape={"round"}
                onClick={openAddMoneyModal}
              >
                Add Money to Wallet
              </Button>
            </div>

            <div
              className={
                "flex flex-col bg-slate-100 w-auto p-4 rounded-lg gap-2"
              }
            >
              <div>Your Current Wallet Amount</div>
              <div className={"text-2xl"}>
                {currencyFormatter({
                  value: wallet?.amount ?? 0,
                  currencyDisplay: "narrowSymbol",
                })}
              </div>
            </div>
            <div className={"w-full"}>
              <Tabs
                onChange={(key: string) => {
                  setCurrentTab(key);
                  setIsRefreshing(true);
                }}
                activeKey={currentTab}
                items={[
                  {
                    key: "wallet",
                    label: (
                      <div className={"w-[175px] text-center"}>
                        Wallet Transactions
                      </div>
                    ),
                    children: (
                      <Transactions
                        type={"wallet"}
                        isRefreshing={isRefreshing}
                        setIsRefreshing={setIsRefreshing}
                        currentTab={currentTab}
                      />
                    ),
                  },
                  {
                    key: "asset",
                    label: (
                      <div className={"w-[175px] text-center"}>
                        Assets Transactions
                      </div>
                    ),
                    children: (
                      <Transactions
                        type={"asset"}
                        isRefreshing={isRefreshing}
                        setIsRefreshing={setIsRefreshing}
                        currentTab={currentTab}
                      />
                    ),
                  },
                  {
                    key: "withdraw",
                    label: (
                      <div className={"w-[175px] text-center"}>
                        Withdraw Transactions
                      </div>
                    ),
                    children: (
                      <Transactions
                        type={"withdraw"}
                        isRefreshing={isRefreshing}
                        setIsRefreshing={setIsRefreshing}
                        currentTab={currentTab}
                      />
                    ),
                  },
                ]}
              />
            </div>
          </div>
          {addMoneyModal?.open && (
            <Modal
              open={addMoneyModal?.open}
              onCancel={closeAddMoneyModal}
              footer={null}
            >
              <div className="p-4">Add money to Wallet</div>
              <Divider dashed />
              <div className={"px-4 pb-4"}>
                <Tabs
                  onChange={(key: string) => {
                    setFieldValue("type", key);
                    resetForm();
                  }}
                  items={[
                    {
                      key: "upi",
                      label: (
                        <div className={"min-w-[75px] text-center"}>UPI</div>
                      ),
                      children: (
                        <PaymentForm
                          type={"upi"}
                          values={values}
                          handleChange={handleChange}
                          setFieldValue={setFieldValue}
                          errors={errors}
                        />
                      ),
                    },
                    {
                      key: "paypal",
                      label: (
                        <div className={"min-w-[75px] text-center"}>Paypal</div>
                      ),
                      children: (
                        <PaymentForm
                          type={"paypal"}
                          values={values}
                          handleChange={handleChange}
                          setFieldValue={setFieldValue}
                          errors={errors}
                        />
                      ),
                    },
                  ]}
                />
              </div>
              <Divider dashed />
              <div className="p-4">
                <div className="flex gap-4 justify-end">
                  <Button
                    disabled={addMoneyModal?.loading}
                    type={"primary"}
                    onClick={() => handleSubmit()}
                  >
                    Send Request
                  </Button>
                  <Button
                    onClick={closeAddMoneyModal}
                    disabled={addMoneyModal?.loading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Modal>
          )}
        </>
      ) : (
        <div className="p-6">
          <div className="flex flex-col items-center gap-6">
            <div className="text-xl">Create Own NGON Wallet</div>
            <img src={EWallet} className="w-9/12  md:w-2/3 lg:w-1/2 xl:w-1/3" />
            <div className="text-slate-500 text-center">
              Create your NGON Wallet and monetize your 3D Skills with NGON.
            </div>
            <Button shape="round" type="primary" onClick={createNGONWallet}>
              {createWalletLoading
                ? "Wailt, We're creating your Wallet..."
                : "Create Own NGON Wallet"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
