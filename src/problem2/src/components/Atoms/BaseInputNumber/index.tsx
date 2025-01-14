import React from "react";
import { InputNumber as AntInputNumber, InputNumberProps, Form } from "antd";
import { Rule } from "antd/es/form";
import "./index.scss";

export interface IInputNumberProps extends InputNumberProps {
  width?: number | string;
  name: string;
  rules?: Rule[];
}
export const BaseInputNumber: React.FC<IInputNumberProps> = ({ width = "100%", name, rules, ...props }) => {
  return (
    <Form.Item name={name} rules={rules} className="m-0">
      <AntInputNumber className="base-input-number" style={{ width }} {...props} />
    </Form.Item>
  );
};
