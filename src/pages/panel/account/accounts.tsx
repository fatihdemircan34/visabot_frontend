import Head from "next/head";
import React, {useEffect, useState} from "react";
import {AccountObject} from "@/objects/account.object";
import {SocketClientControl} from "@/core/websocket/controls/socketClient.control";
import {SocketActionsEnum} from "@/core/websocket/enums/socketActions.enum";
import {ApiGet, ApiPost} from "@/core/webrequest/controls/webRequest.control";
import Prompt from "@/pages/app/components/prompt";
import Link from "next/link";

let AccountsDataArray: AccountObject[] = [];

export default function Accounts(){

    const iPrompt = Prompt();
    const [AccountsData, setAccountsData] = useState<AccountObject[]>([]);
    const [CurrentAccount, setCurrentAccount] = useState<AccountObject|undefined>(undefined);

    useEffect(() => {
        GetAccounts();
    }, []);

    async function GetAccounts(isVip: boolean = false){
        const response = await ApiGet('/admin/account/list?isvip='+isVip);
        if(!response.success){
            iPrompt.MessageBoxShow("Hata", response.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        AccountsDataArray = response.data;
        setAccountsData(response.data);
    }


    async function SelectAccount(data: AccountObject){

    }

    async function DeleteAccount(id: number){

    }

    async function SaveAccount(){

    }







    const AccountItem = (item: AccountObject) => {
        return (<>
            <tr className="dListItem">
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>
                    <button className="btn btn-sm btn-pill btn-danger mr-2" style={{paddingTop: 4, paddingBottom: 4}} onClick={() => DeleteAccount(item.id)}>Sil</button>
                    <button className="btn btn-sm btn-pill btn-success" style={{paddingTop: 4, paddingBottom: 4}} onClick={() => SelectAccount(item)}>Düzenle</button>
                </td>
            </tr>
        </>)
    }

    return (<>

        <Head>
            <title>Hesaplar - Visa Appointment Engine</title>
        </Head>

        <div className="container mt-3">

            <div className="row">
                <div className="col-12">
                    <h3>Hesaplar</h3>
                </div>
            </div>

            <form id="ProxyForm">
                <input type="hidden" name="id" id="hdnId"/>
                <div className="row">
                    <div className="col-4">
                        <div className="form-group">
                            <label htmlFor="txtName">Adı Soyadı</label>
                            <input type="text" name="name" className="form-control" id="txtName" aria-describedby="txtNameHelp" placeholder="Adı Soyadı" style={{color: '#000000'}}/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <div className="form-group">
                            <label htmlFor="txtInfo">Kullanıcı Adı</label>
                            <input type="text" name="username" className="form-control" id="txtUsername" aria-describedby="txtProxyInfo" placeholder="Kullanıcı Adı" style={{color: '#000000'}}/>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="form-group">
                            <label htmlFor="txtInfo">Şifresi</label>
                            <input type="text" name="password" className="form-control" id="txtPassword" aria-describedby="txtProxyInfo" placeholder="Şifresi" style={{color: '#000000'}}/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <div className="form-group">
                            <label htmlFor="txtInfo">EPosta</label>
                            <input type="text" name="username" className="form-control" id="txtUsername" aria-describedby="txtProxyInfo" placeholder="Kullanıcı Adı" style={{color: '#000000'}}/>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="form-group">
                            <label htmlFor="txtInfo">Telefon</label>
                            <input type="text" name="password" className="form-control" id="txtPassword" aria-describedby="txtProxyInfo" placeholder="Şifresi" style={{color: '#000000'}}/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <button type="button" className="btn btn-danger btn-pill" onClick={() => SaveAccount()}>Kaydet</button>
                    </div>
                </div>
            </form>

            <div className="row m-5">
                <div className="col-12">
                    <hr/>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <h5>Hesap Listesi</h5>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-sm">
                    <thead>
                    <tr>
                        <th>
                            Adı Soyadı
                        </th>
                        <th>
                            Kullanıcı Adı
                        </th>
                        <th>
                            Şifresi
                        </th>
                        <th>
                            EPosta
                        </th>
                        <th>
                            Telefon
                        </th>
                        <th style={{width: 200}}>
                            İşlem
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {(AccountsData !== null && AccountsData.length || 0) <= 0 ? (<tr>
                        <td className="text-center" colSpan={6}>Henüz veri girilmedi.</td>
                    </tr>) : AccountsData.map(t => AccountItem(t))}
                    </tbody>
                </table>
            </div>
        </div>

        <iPrompt.MessageBox/>

    </>)
}