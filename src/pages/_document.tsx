import { Html, Head, Main, NextScript } from "next/document";
import {documentGetInitialProps, DocumentHeadTags} from "@mui/material-nextjs/v13-pagesRouter";
import React, {useEffect} from "react";
import Script from "next/script";
import {SessionControl} from "@/core/websession/controls/session.control";
import Cookies from "universal-cookie";
import {WebConfigControl} from "@/core/webconfig/controls/webConfig.control";
import {WebResponseObject} from "@/core/webrequest/objects/webResponse.object";

export default function MyDocument(props: any) {


    return (<Html lang="en" className="userCheck">
        <Head>
            <Script src="/assets/js/lang-config.js" strategy="beforeInteractive"/>
            <Script src="/assets/js/translation.js" strategy="beforeInteractive"/>
            <Script src="//translate.google.com/translate_a/element.js?cb=TranslateInit" strategy="afterInteractive"/>
            <DocumentHeadTags {...props} />

            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link href='https://fonts.googleapis.com/css?family=Oswald' rel='stylesheet' type='text/css'/>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet"/>
        </Head>

        <body>

        <Main/>
        <NextScript/>

        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/assets/js/jquery/dist/jquery.min.js"></script>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/assets/js/zoom.js"></script>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/assets/js/custom.js"></script>

        </body>
    </Html>);
}


MyDocument.getInitialProps = async (ctx: any) => {
    const finalProps = await documentGetInitialProps(ctx);
    return finalProps;
}
