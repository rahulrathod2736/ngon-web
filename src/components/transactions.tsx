import { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axios";
import { apiRoutes } from "../utils/constants/apiRoutes";
import { currencyFormatter, getColorBasedOnStatus } from "../utils/functions";
import { Divider, Tag } from "antd";

export const Transactions = ({
  type,
  isRefreshing,
  setIsRefreshing,
  currentTab,
}: {
  type: "wallet" | "asset" | "withdraw";
  isRefreshing: boolean;
  setIsRefreshing: any;
  currentTab: string;
}) => {
  const [transactions, setTransactions] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type === currentTab && isRefreshing) {
      getWalletTransactionsByType(type);
      setIsRefreshing(false);
    }
  }, [type, isRefreshing, currentTab]);

  const getWalletTransactionsByType = async (type: string) => {
    try {
      setLoading(true);
      const filters = {
        type,
      };
      const query = new URLSearchParams(filters).toString();
      const resp = await axiosInstance.get(
        `${apiRoutes.getUserWalletTransactions}?${query}`
      );
      setTransactions(resp?.data?.data?.items || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : transactions.length > 0 ? (
        <div className={"flex flex-col gap-4"}>
          {transactions.map((t) => (
            <div className={"bg-slate-100 p-4 rounded-md gap-4"}>
              <div
                className={
                  "flex gap-4 flex-row justify-between w-full items-center"
                }
              >
                <div className={"flex flex-col gap-2"}>
                  <div className={"flex flex-row gap-2"}>
                    <span>NGON Transaction ID:</span>
                    <span className={"text-gray-500"}>{t._id}</span>
                  </div>
                  <div className={"flex flex-col"}>
                    <span>Amount:</span>
                    <span className={"text-gray-500 text-lg"}>
                      {currencyFormatter({ value: t.amount })}
                    </span>
                  </div>
                </div>
                <div className={"mr-6 flex flex-col gap-2 items-end"}>
                  <span className={"text-gray-500"}>#{t.referenceCode}</span>
                  <span className={"uppercase"}>
                    <Tag
                      className={"border-0"}
                      color={getColorBasedOnStatus(t.status)}
                    >
                      {t.status}
                    </Tag>
                  </span>
                </div>
              </div>
              {t.remark ? (
                <div className={"mt-2"}>
                  <Divider dashed />
                  <div className={"mt-2"}>
                    Remark: <span className={"text-gray-500"}>{t.remark}</span>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={"flex flex-col gap-4 h-40 justify-center items-center"}>
          No Transactions Recorded.
        </div>
      )}
    </div>
  );
};
