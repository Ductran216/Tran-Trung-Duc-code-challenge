import { Outlet } from "react-router-dom";

const PageLayout = () => {
  return (
    <div className="p-2 mx-auto max-w-screen-lg">
      <Outlet />
    </div>
  );
};

export default PageLayout;
