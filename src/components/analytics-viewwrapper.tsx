import * as React from "react";
import ReactGa from "react-ga";
import { useLocation } from "react-router";

declare global {
  interface Window {
    gtag: any;
  }
}

interface IWrapperProps {
  initialized: boolean;
  children: React.PropsWithChildren<any>;
}

export function AnalyticsWrapper(props: IWrapperProps) {
  const location = useLocation();

  React.useEffect(() => {
    console.log("Event logged");
    window.gtag("event", "page_view", {
      page_title: "title",
      page_path: location.pathname + location.search,
      page_location: window.location.href,
    });
  }, [location]);

  return props.children;
}
