import { Col, Row, Tooltip } from "antd";

interface IValueWithLabel {
  label: string;
  value: string;
  isRow?: boolean;
}

export const ValueWithLabel = ({
  label,
  value,
  isRow = true,
}: IValueWithLabel) => {
  return (
    <Row className="my-2">
      <Col span={isRow ? 12 : 24} className="single-line-ellipsis">
        <Tooltip title={label}>
          {label}
          {":"}
        </Tooltip>
      </Col>
      <Col
        span={isRow ? 12 : 24}
        className="single-line-ellipsis text-slate-500"
      >
        <Tooltip title={value}>{value}</Tooltip>
      </Col>
    </Row>
  );
};
