'use client';


import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Button from "../../../../public/assets/js/bootstrap/js/src/button";
import React, {FormEvent, useState} from "react";
import {SessionControl} from "@/core/websession/controls/session.control";
import {useRouter} from "next/router";
import ClientChecker from "@/pages/app/components/clientChecker";
import Prompt from "@/pages/app/components/prompt";
import {SocketDataObject} from "@/core/websocket/objects/socketData.object";
import LanguageSwitcher from "@/pages/app/components/lang-switcher";
import Image from "next/image";

const links = [
    { key: 'pg1', name: 'Ana Sayfa', href: '/' },
    // { key: 'pg2', name: 'Geçmiş İşlemler', href: '/panel/history' },
    // { key: 'pg2', name: 'Hakkımızda', href: '/site/aboutus' },

];


interface EventProps {
    LogoutEvent: () => void
}


export default function NavbarPanel(LogoutEvent: () => void) {


    const router = useRouter();
    const pathname = usePathname();



    const menuItems = links.map((link) =>
        <li key={link.key}
            style={{
                color: 'white !important'
            }}
            className={clsx(
                'nav-item',
                {
                    'active': pathname === link.href,
                },
            )}>
            {<Link style={{
                color: '#FFFF'
            }} key={link.key} href={link.href} className="nav-link">{link.name}</Link>}
        </li>
    );



    function Logout(isApproved: boolean){
        SessionControl.Clear();
        router.push('/');
    }

    const LogoutRequest = () => {}// iPrompt.ConfirmBoxShow("Dikkat", "Kullanıcınız için sistemden çıkış yapılacaktır!")


    return (
        <></>

        // <header className="twitter_navbar">
        //     <nav className="navbar navbar-expand-lg navbar-light bg-transparent fixed-on-scroll">
        //         <div className="container">
        //
        //             <Link className='logo_hover' style={{color: 'white', textDecoration: 'none', display: 'flex', placeItems: 'center'}} href={'/'}>
        //                 <Image
        //                     style={{borderRadius: 8, marginRight: 8}}
        //                     src="/assets/images/twitter-white.png"
        //                     alt="Logo"
        //                     width={50}
        //                     height={50}
        //                 />
        //                 <span className="wise-title" style={{fontSize: 22, letterSpacing: 2}}>
        //                     TWİTCİ.com
        //                 </span>
        //             </Link>
        //
        //             <button className="navbar-toggler" type="button" data-toggle="collapse"
        //                     data-target="#miriUiKitNavbar"
        //                     aria-controls="navbarSupportedContent2" aria-expanded="false"
        //                     aria-label="Toggle navigation">
        //                 <span className="mdi mdi-menu"></span>
        //             </button>
        //
        //             <div className="collapse navbar-collapse" id="miriUiKitNavbar">
        //                 <div className="navbar-nav ml-auto">
        //                     <LanguageSwitcher/>
        //                     {menuItems}
        //                     <button onClick={() => LogoutEvent()} className="btn btn-default-twitter ml-lg-3" style={{padding: "9px 13px"}} >Çıkış Yap</button>
        //                 </div>
        //             </div>
        //
        //         </div>
        //     </nav>
        // </header>

    );
}
