import React from "react";
import { Button, ButtonProps, Tooltip } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import "./index.scss";

interface ISwapButtonProps extends ButtonProps {
  loading: boolean;
}
export const SwapButton: React.FC<ISwapButtonProps> = ({ loading, disabled, ...props }) => {
  return (
    <div className="swap-button-container">
      <Tooltip title={loading ? "Converting..." : "Click to swap"} placement="bottom">
        <Button
          shape="circle"
          style={{ width: 80, height: 80 }}
          className={`swap-button ${loading ? "loading" : ""}`}
          icon={<SwapOutlined size={3} />}
          disabled={disabled || loading}
          {...props}
        />
      </Tooltip>
      {loading && <div className="circle-loading-animation"></div>}
    </div>
  );
};
