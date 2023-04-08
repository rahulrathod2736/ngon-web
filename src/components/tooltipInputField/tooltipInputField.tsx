import { Tooltip } from "antd";

interface IProps {
  message: string | string[] | null;
  children: React.ReactNode;
}

const TooltipInputField = ({ message, children }: IProps) => {
  return (
    <Tooltip
      title={
        message ? (
          <div className="text-center">
            {Array.isArray(message) ? message[0] : message}
          </div>
        ) : null
      }
      placement="bottom"
    >
      {children}
    </Tooltip>
  );
};

export default TooltipInputField;
