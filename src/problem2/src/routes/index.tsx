import PageLayout from "@/layout";
import CurrencyConvertPage from "@/pages/CurrencyConvert";
import ErrorPage from "@/pages/Error";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <PageLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <CurrencyConvertPage />,
        },
      ],
    },
  ],
  { basename: "/" }
);

export default router;
