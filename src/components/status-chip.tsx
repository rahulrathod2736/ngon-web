import { assetStatus } from "../utils/constants/constants";

export const StatusChip = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    if (status === assetStatus.CREATED) {
      return "text-slate-500 bg-slate-100";
    } else if (status === assetStatus.ONBOARDED) {
      return "text-yellow-500 bg-yellow-100";
    } else if (status === assetStatus.PUBLISHED) {
      return "text-green-500 bg-green-100";
    } else if (status === assetStatus.UNPUBISHED) {
      return "text-red-500 bg-red-100";
    }
    return "text-slate-500 bg-slate-100";
  };
  return (
    <span
      className={`ml-4 uppercase text-[10px] px-4 rounded-full h-7 flex items-center ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
};
