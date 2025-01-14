import React from "react";
import { Select as AntSelect, Form, SelectProps } from "antd";
import { Rule } from "antd/es/form";
import "./index.scss";

export interface IBaseSelectProps extends SelectProps {
  width?: number | string;
  dropdownWidth?: number | string;
  name: string;
  rules?: Rule[];
}
export const BaseSelect: React.FC<IBaseSelectProps> = ({
  width = "100%",
  dropdownWidth = "initial",
  name,
  rules,
  ...props
}) => {
  return (
    <Form.Item name={name} rules={rules} className="m-0">
      <AntSelect style={{ width: width }} className="base-select" {...props} dropdownStyle={{ width: dropdownWidth }} />
    </Form.Item>
  );
};
