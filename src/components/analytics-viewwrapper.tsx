import * as React from 'react';
import ReactGa from "react-ga";
import { useLocation } from 'react-router';

interface IWrapperProps {
    initialized: boolean;
    children: React.PropsWithChildren<any>;
}

export function AnalyticsWrapper(props: IWrapperProps) {
    const location = useLocation();

    React.useEffect(() => {
        if (props.initialized) {
            ReactGa.pageview(location.pathname + location.search);
        }
    }, [props.initialized, location]);

    return props.children;

}