'use client'

import '@/styles/import.scss'
import '@/stylesadmin/import.scss'

import type {AppProps} from "next/app";
import Layout from "./app/layout";
import Transition from "@/pages/app/components/transition";
import React, {useEffect} from "react";
import {AppCacheProvider, DocumentHeadTagsProps} from "@mui/material-nextjs/v13-pagesRouter";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Roboto} from 'next/font/google';
import {SessionControl} from "@/core/websession/controls/session.control";
import Cookies from "universal-cookie";
import {WebConfigControl} from "@/core/webconfig/controls/webConfig.control";
import {WebResponseObject} from "@/core/webrequest/objects/webResponse.object";


const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const theme = createTheme({
    typography: {
        fontFamily: roboto.style.fontFamily,
    },
});

export default function App(props: AppProps & DocumentHeadTagsProps) {
    const {Component, pageProps} = props;

    useEffect(() => {
        const userSession = SessionControl.User();
        console.log(`userSession >>> ${userSession}`);
        const isUserStyle: boolean = (userSession === undefined || userSession?.role_id !== 1);
        (document.getElementsByTagName('Html')[0] as HTMLElement).className = isUserStyle ? "adminCheck" : "adminCheck";

    }, []);




    return (<Layout>
            <AppCacheProvider {...props}>
                <ThemeProvider theme={theme}>
                    <Transition>
                        <Component {...pageProps} />
                    </Transition>
                </ThemeProvider>
            </AppCacheProvider>
        </Layout>)
}
