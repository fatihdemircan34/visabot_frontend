"use client";
import React, {FormEvent, useEffect, useState} from "react";
import {GetCookie, SetCookie} from "@/core/webcookie/controls/cookieClient.control";

import {SocketCommandEnum} from "@/core/websocket/enums/socketCommand.enum";
import {SocketDataObject} from "@/core/websocket/objects/socketData.object";
import { SocketClientControl } from "@/core/websocket/controls/socketClient.control";
import Head from "next/head";

import {ApiGet, ApiPost} from "@/core/webrequest/controls/webRequest.control";
import Modal from "@/pages/app/components/modal";
import {useRouter} from "next/router";
import Prompt from "@/pages/app/components/prompt";
import {SessionControl} from "@/core/websession/controls/session.control";
import {SocketActionsEnum} from "@/core/websocket/enums/socketActions.enum";

import { Input, Button } from 'antd';
import Link from "next/link";
import { LoginOutlined } from '@ant-design/icons';
import {CustomerObject} from "@/objects/customer.object";
import Cookies from "universal-cookie";
import {WebConfigControl} from "@/core/webconfig/controls/webConfig.control";
import {WebResponseObject} from "@/core/webrequest/objects/webResponse.object";


let currentServerCommand: SocketDataObject;

export default function Auth() {

    const router = useRouter();
    const iModal = Modal();
    const iPrompt = Prompt();



    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [socketMessage, setSocketMessage] = useState('');
    const [warningMessage, setWarningMessage] = useState('');
    const [LoginWaitingVisibility, setLoginWaitingVisibility] = useState<boolean>(false);



    const socketClient = SocketClientControl(async (data) => {

        console.log(`Socket Action >>> ${JSON.stringify(data)}`);

        if(data.action != SocketActionsEnum.Auth)
            return;

        currentServerCommand = data;
        if(data.command == SocketCommandEnum.ProcessQuestion){
            setSocketMessage(data.message || "")
            iModal.Show("Sunucu Mesajı")
        }

        if(data.command == SocketCommandEnum.ProcessSuccess){
            SetCookie("ssid", data.data.access_token);
            const sessionResponse = await ApiGet('/profile/session');
            setLoginWaitingVisibility(false);
            if(sessionResponse.success){
                SessionControl.SetUser(sessionResponse.data);
                router.push('/').then((off) => {
                    if((sessionResponse.data as CustomerObject).role_id === 1)
                        (document.getElementsByTagName('Html')[0] as HTMLElement).className = "adminCheck";
                });
            }else{
                iPrompt.MessageBoxShow("Error", "Giriş sırasında bir hata oluştu!");
            }
        }

        if(data.command == SocketCommandEnum.ProcessInfo || data.command == SocketCommandEnum.ProcessError || data.command == SocketCommandEnum.Log)
        {
            setLoginWaitingVisibility(false);
            setWarningMessage(data.message || "");

            if(data.command === SocketCommandEnum.ProcessError)
                iModal.Hide();
        }

    });

    const handleSubmitForLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoginWaitingVisibility(true);
        ApiPost('/auth/login', {username: email, password: password}).then((resp) => {
            if(!resp.success){
                setLoginWaitingVisibility(false);
                iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            }
        });
    }

    const handleSubmitForVerify = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const verifyCode = (document.getElementById("txtVerifyCode") as HTMLInputElement).value
        socketClient?.ServerCommandAnswer(currentServerCommand, verifyCode);
        iModal.Hide();
    }


    return (

        <>

            <Head>
                <title>Visa Appointment Engine | Giriş</title>
                <link href='/assets/landing/css/style.css' rel='stylesheet' type='text/css'/>
            </Head>

            <header className="miri-ui-kit-header landing-header header-bg-2">
                <div
                    className="miri-ui-kit-header-content text-center text-white d-flex flex-column justify-content-center align-items-center">


                    <div className='card login-card'>
                        <div className="card-body">

                            <br></br>

                            <form onSubmit={handleSubmitForLogin}>
                                <div className="form-group">
                                    <input type="text" id="email" name="email" style={{color: '#000000'}}
                                           placeholder="Kullanıcı Adı, EPosta, Telefon"
                                           value={email} onChange={event => setEmail(event.target.value)}
                                           className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <input type="password" id="password" name="password" placeholder="Şifre"  style={{color: '#000000'}}
                                           value={password} onChange={event => setPassword(event.target.value)}
                                           className="form-control"/>
                                </div>

                                {LoginWaitingVisibility ? (<div className="btn btn-primary btn-block mb-3">
                                    <div className="spinner-border" role="status" style={{ width: 18, height: 18}}>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>) : (<button type="submit" className="btn btn-primary btn-block mb-3">
                                    <LoginOutlined/> Giriş Yap
                                </button>)}

                                <p>
                                    {warningMessage}
                                </p>

                            </form>

                        </div>
                    </div>
                </div>
            </header>

            <iModal.ModalBox>
                <form onSubmit={handleSubmitForVerify}>
                    <div className="form-group">
                        <span style={{ color: '#000000'}}>{socketMessage}</span>
                        <input id="txtVerifyCode" type="text" name="password" className="form-control w-100" style={{ color: '#000000'}}/>
                    </div>
                    <input type="submit" value="Gönder" className="btn btn-danger btn-block mb-3"/>
                </form>
            </iModal.ModalBox>

            <iPrompt.MessageBox/>


        </>

    );
}


