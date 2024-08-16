'use client'
import React, {useState} from "react";
import Head from "next/head";
import ClientChecker from "@/pages/app/components/clientChecker";
import {SessionControl} from "@/core/websession/controls/session.control";
import AdminDashboard from "@/pages/panel/dashboard";
import Auth from "@/pages/app/auth";

export default function Home() {

    if(!ClientChecker())
        return null;

    const userSession = SessionControl.User();

    return (
        <>
            <Head>
                <title>Visa Appointment Engine </title>
            </Head>

            {
                userSession !== undefined && userSession.role_id === 1 ?
                <AdminDashboard /> :
                <Auth/>
            }

        </>
    );
}
