import { Col, Row, Tooltip } from "antd";

interface IValueWithLabel {
  label: string;
  value: string | React.ReactNode;
  isRow?: boolean;
  hideTooltip?: boolean;
}

export const ValueWithLabel = ({
  label,
  value,
  isRow = true,
  hideTooltip = false,
}: IValueWithLabel) => {
  return (
    <Row className="my-2">
      <Col span={isRow ? 12 : 24} className="single-line-ellipsis">
        <Tooltip title={!hideTooltip && label}>
          {label}
          {":"}
        </Tooltip>
      </Col>
      <Col
        span={isRow ? 12 : 24}
        className="single-line-ellipsis text-slate-500"
      >
        <Tooltip title={!hideTooltip && typeof value === "string" && value}>
          {value}
        </Tooltip>
      </Col>
    </Row>
  );
};
