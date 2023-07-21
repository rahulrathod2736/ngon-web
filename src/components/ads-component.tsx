import {useEffect} from "react";

export function AdsComponent({dataAdSlot}: { dataAdSlot: string }) {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e: any) {
            console.log("adds component error => ", e.message)
        }
    }, []);
    return (
        <>
            <ins className="adsbygoogle"
                 style={{display: "block"}}
                 data-ad-client="ca-pub-3346795427392886"
                 data-ad-slot={dataAdSlot}
                 data-ad-format="auto"
                 data-full-width-responsive="true">
            </ins>
        </>
    );

}