'use client';


import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import React from "react";

const links = [
    { key: 'pg1', name: 'Ana Sayfa', href: '/', children: [], route: null },

    { key: 'pg4', name: 'Müşteriler ve Randevu Yönetimi', href: '/panel/customer/customers', route: null },

    { key: 'pg7', name: 'Kullanıcılar', href: '/panel/account/accounts', route: null },

    { key: 'pg6', name: 'Ayarlar', href: '#', route: '/panel/settings',
        children: [

            { key: 'pg61', name: 'Genel Ayarları', href: '/panel/settings/general', icon: 'mdi mdi-settings' },
            { key: 'pg62', name: 'Proxy Ayarları', href: '/panel/settings/proxy', icon: 'mdi mdi-shape-outline' },
        ]
    },
];


interface EventProps {
    LogoutEvent: () => void
}

export default function NavbarAdmin(LogoutEvent: () => void) {


    const pathname = usePathname();
    const menuItems = links.map((link) => {
        if((link.children?.length || 0) > 0){
            return (<li key={link.key}  className={clsx('nav-item dropdown', { 'active': pathname?.includes(link.route || ""), },)}>
                <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
                    {link.name}
                </a>
                <div className="dropdown-menu dropdown-menu-right">
                    {
                        link.children?.map((sub) =>{
                            return (
                                <Link key={sub.key} href={sub.href} className="dropdown-item">
                                    <i className={`dropdown-item-icon ${sub.icon}`}></i>
                                    {sub.name}
                                </Link>)
                        })
                    }
                </div>
            </li>)
        }

        return (
            <li key={link.key} className={clsx('nav-item', {  'active': pathname === link.href,  },)}>
                {<Link key={link.key} href={link.href} className="nav-link">{link.name}</Link>}
            </li>);
    });


    return (<header className="miri-ui-kit-header header-navbar-only header-no-bg-img" style={{borderBottom: "1px solid #c4c4c4"}}>
            <nav className="navbar navbar-expand-lg navbar-light bg-transparent fixed-on-scroll">
                <div className="container">
                    <Link className="navbar-brand" href="/">
                        <span className="display-5 text-danger">Visa</span><span className="display-5">Appointment</span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#miriUiKitNavbar"
                            aria-controls="navbarSupportedContent2" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="mdi mdi-menu"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="miriUiKitNavbar">
                        <div className="navbar-nav ml-auto">
                            {menuItems}
                            <input type="button" onClick={() => LogoutEvent()} className="btn btn-danger btn-sm ml-lg-3" style={{padding: "9px 13px"}} value="Çıkış Yap"/>
                        </div>
                    </div>
                </div>
            </nav>
        </header>

    );
}
