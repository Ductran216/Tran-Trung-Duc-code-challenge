import React from "react";
import { Spin, SpinProps } from "antd";
import "./index.scss";

export const BaseLoading: React.FC<SpinProps> = (props) => {
  return <Spin className="base-loading" {...props} />;
};
