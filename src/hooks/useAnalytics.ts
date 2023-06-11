//  useAnalytics
import React from "react";
import ReactGA from "react-ga";
export function useAnalytics() {
  const [initialized, setInitialized] = React.useState(false);
  React.useEffect(() => {
    if (
      !window.location.href.includes("localhost") ||
      !window.location.href.includes("127.0.0.1")
    ) {
      const trackingId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
      ReactGA.initialize(trackingId);
    }
    setInitialized(true);
  }, []);
  return {
    initialized,
  };
}
