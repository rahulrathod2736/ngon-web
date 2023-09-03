import { useState } from "react";
import { AiOutlineClose } from "react-icons/all";
import { Link } from "react-router-dom";
import { RootState, useAppSelector } from "../redux/store";
import { STRINGS } from "../utils/constants/strings";

import { useLocation } from "react-router";

export const WalletWarning = () => {
  const { userProfile } = useAppSelector((state: RootState) => state.user);
  const [isClosed, setIsClosed] = useState(false);
  const location = useLocation();

  const onClose = () => {
    setIsClosed(true);
  };

  if (
    userProfile?._id &&
    !userProfile?.wallet &&
    !isClosed &&
    !location.pathname.includes("wallet")
  ) {
    return (
      <div
        className={
          "flex text-center text-[12px] p-1 bg-red-50 text-red-500 items-center justify-center z-[5]"
        }
      >
        Heyy, Still you haven't created Wallet. Create a wallet and monetize
        yourself.
        <Link className={"ml-1"} to={STRINGS.WALLET_PATH}>
          Create a Wallet
        </Link>
        <AiOutlineClose
          className={"absolute right-1 cursor-pointer"}
          onClick={onClose}
        />
      </div>
    );
  }

  return <></>;
};