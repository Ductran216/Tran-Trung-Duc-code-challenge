import React from "react";
import { Input, Tooltip, InputProps, Button, message } from "antd";
import { getTruncatedValue } from "./helpers";
import { CopyOutlined } from "@ant-design/icons";
import "./index.scss";

interface IBaseReadOnlyInputProps extends InputProps {
  value: string;
  width?: number;
}

const BaseReadOnlyInput: React.FC<IBaseReadOnlyInputProps> = ({ value, width = 200, ...props }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      message.success("Copied to clipboard!");
    } catch (error) {
      message.error("Failed to copy!");
      console.error("Copy to clipboard failed: ", error);
    }
  };

  return (
    <div className="flex items-center">
      <Tooltip title={value}>
        <Input className="base-input" value={getTruncatedValue(value)} readOnly style={{ width }} {...props} />
      </Tooltip>

      <Tooltip title="Copy">
        <Button icon={<CopyOutlined style={{ color: "white" }} />} onClick={handleCopy} type="text" size="large" />
      </Tooltip>
    </div>
  );
};

export default BaseReadOnlyInput;
