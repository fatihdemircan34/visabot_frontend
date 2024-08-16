'use client'
import React, {useEffect, useState} from "react";
import Footer from "@/pages/app/partials/footer";
import Script from "next/script";
import Navbar from "@/pages/app/partials/navbar";
import {SessionControl} from "@/core/websession/controls/session.control";
import NavbarPanel from "@/pages/app/partials/navbarPanel";
import NavbarAdmin from "@/pages/app/partials/navbarAdmin";
import ClientChecker from "@/pages/app/components/clientChecker";
import Prompt from "@/pages/app/components/prompt";
import {useRouter} from "next/router";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import {ThemeProvider} from "@mui/material/styles";
import theme from "tailwindcss/defaultTheme";
import FooterAdmin from "@/pages/app/partials/footerAdmin";
import {WebDeviceControl} from "@/core/webdevice/controls/webDevice.control";

const Layout = ({ children } : any) => {

    const router = useRouter();

    useEffect(() => {
        WebDeviceControl.DeviceRegister();
    }, []);


    if(!ClientChecker())
        return null;


    const LogoutRequest = () => {
        console.log("Runned => LogoutRequest");
        document.getElementById('ModalDivLogout')?.classList.remove('display-none');
        document.getElementById('ModalDivLogout')?.classList.add('display-block');
    }


    const Logout = () => {
        LogoutClose();
        SessionControl.Clear();
        router.push('/').then((off) =>{
            (document.getElementsByTagName('Html')[0] as HTMLElement).className = "userCheck";
        });
    }

    const LogoutClose = () => document.getElementById('ModalDivLogout')?.classList.add('display-none');


    const currentNavBar = () => {
        const user = SessionControl.User();
        if(user != undefined && user.role_id === 1)
            return NavbarAdmin(() => LogoutRequest());
         else
            return Navbar();

    }

    const currentFooter = () => {
        const user = SessionControl.User();
        if(user === undefined || user.role_id !== 1)
            return Footer();
        else{
            return FooterAdmin();
        }
    }


    return (<>
        <Script src="/assets/js/jquery/dist/jquery.min.js" strategy="afterInteractive"/>

        {currentNavBar()}

        <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>

        {currentFooter()}

        <div id="ModalDivLogout" className={`${"modal"} ${"display-none"}`}>
            <div className="modal-main">
                <div className="modal-head mt-4">
                    <h4 style={{ color: "darkgrey"}}>Dikkat</h4>
                </div>
                <div className="modal-body text-center mb-4" style={{fontSize: 18, color: "gray"}}>
                    Kullanıcı hesabınızdan çıkış yapılacaktır! Onaylıyor musunuz?
                </div>
                <div className="btn-container">
                    <div className="row">
                        <div className="col-6">
                            <button type="button" className="btn btn-danger btn-block mb-3" onClick={() => LogoutClose()}>Reddet</button>
                        </div>
                        <div className="col-6">
                            <button type="button" className="btn btn-success btn-block mb-3" onClick={() => Logout()}>Onayla</button>
                        </div>

                    </div>


                </div>
            </div>
        </div>

        <Script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
            crossOrigin="anonymous"
        />
        <Script src="/assets/js/popper.js/dist/umd/popper.min.js" strategy="afterInteractive"/>
        <Script src="/assets/js/bootstrap/dist/js/bootstrap.min.js" strategy="afterInteractive"/>
        <Script src="/assets/js/miri-ui-kit.js" strategy="afterInteractive"/>
    </>)
}

export default Layout;