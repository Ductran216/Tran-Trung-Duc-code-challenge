import React from "react";
import { Skeleton, SkeletonProps } from "antd";
import "./index.scss";

interface IBaseIconSkeleton extends SkeletonProps {
  width?: number;
  height?: number;
}

export const BaseIconSkeleton: React.FC<IBaseIconSkeleton> = ({
  width = 48,
  height = 48,
  ...props
}: IBaseIconSkeleton) => {
  return <Skeleton.Avatar className="base-icon-skeleton" style={{ width, height }} {...props} />;
};
