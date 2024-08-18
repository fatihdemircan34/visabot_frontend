import Head from "next/head";
import React, {FormEvent, useEffect, useState} from "react";
import {ProxyTypeObject} from "@/objects/proxyType.object";
import {ApiGet, ApiPost} from "@/core/webrequest/controls/webRequest.control";
import Prompt from "@/pages/app/components/prompt";
import {ProxyObject} from "@/objects/proxy.object";
import {FormSerializerControl} from "@/core/webrequest/controls/formSerializer.control";


let ProxyListData: ProxyObject[];
let ProxyTypeListData: ProxyTypeObject[];
let CurrentProxyId: number;


export default function SiteAccounts() {


    const iPrompt = Prompt();

    const [ProxyTypeData, setProxyTypeData] = useState<ProxyTypeObject[]>([]);
    const [ProxyData, setProxyData] = useState<ProxyObject[]>([]);
    const [CurrentProxyType, setCurrentProxyType] = useState(0);




    useEffect(() => {
        GetProxyTypes();
        GetProxies();
    }, []);


    const GetProxyTypes = async () => {
        const proxyTypesReq = await ApiGet('/admin/proxy/types');
        if (!proxyTypesReq.success) {
            iPrompt.MessageBoxShow("Hata", proxyTypesReq.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        setProxyTypeData(proxyTypesReq.data);
        ProxyTypeListData = proxyTypesReq.data;
    }

    function GetProxyTypeName(id: number){
        return ProxyTypeListData.find(proxyType => proxyType.id === id)?.name;
    }

    const GetProxies = async () => {
        let queryParams = {
            proxyType: 1
        }
        const proxiesReq = await ApiGet('/admin/proxy/list?proxyType='+queryParams.proxyType);
        if (!proxiesReq.success) {
            iPrompt.MessageBoxShow("Hata", proxiesReq.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        ProxyListData = proxiesReq.data
        console.log(ProxyListData)
        setProxyData(ProxyListData);
    }

    const SaveProxy = async () => {

        console.log(FormSerializerControl("ProxyForm"))

        const saveReq = await ApiPost('/admin/proxy/save', FormSerializerControl("ProxyForm"));
        if (!saveReq.success) {
            iPrompt.MessageBoxShow("Hata", saveReq.message || "Bilinmeyen bir hata oluştu!");
            return;
        }

        await GetProxies();
        ClearProxy();
    }

    function DeleteProxyRequest(proxyId: number){
        CurrentProxyId = proxyId;
        iPrompt.ConfirmBoxShow("Proxy Silme","Proxy bilgisi sistemden silinecektir. Onaylıyor musunuz?");
    }

    const DeleteProxy = async (isOkay: boolean) => {
        if(!isOkay)
            return;

        const deleteReq = await ApiPost('/admin/proxy/delete', {id: CurrentProxyId});
        if(!deleteReq.success){
            iPrompt.MessageBoxShow("Hata", deleteReq.message || "Bilinmeyen bir hata oluştu!");
            return;
        }

        await GetProxies();
        ClearProxy();
    }

    const SelectProxy = (proxy: ProxyObject) => {
        (document.getElementById('hdnId') as HTMLInputElement).value = proxy.id.toString();
        (document.getElementById('txtName') as HTMLInputElement).value = proxy.name;
        (document.getElementById('txtInfo') as HTMLInputElement).value = proxy.info;
        setCurrentProxyType(proxy.proxy_type)
    }


    function ClearProxy(){
        (document.getElementById('hdnId') as HTMLInputElement).value = "0";
        (document.getElementById('txtName') as HTMLInputElement).value = "";
        (document.getElementById('txtInfo') as HTMLInputElement).value = "";
        setCurrentProxyType(1)
    }


    function ProxyItem(item: ProxyObject) {
        return (<>
            <tr key={item.id}>
                <td>{item.name}</td>
                <td>{GetProxyTypeName(item.proxy_type)}</td>
                <td>{item.info}</td>
                <td>
                    <button className="btn btn-sm btn-pill btn-danger mr-2" style={{ paddingTop: 4, paddingBottom: 4}} onClick={() => DeleteProxyRequest(item.id)}>Sil</button>
                    <button className="btn btn-sm btn-pill btn-success" style={{ paddingTop: 4, paddingBottom: 4}} onClick={() => SelectProxy(item)}>Düzenle</button>
                </td>
            </tr>
        </>);
    }


    return (<>
        <Head>
            <title>Proxy Ayarları - Visa Appointment Engine</title>
        </Head>

        <div className="container mt-3">

            <div className="row">
                <div className="col-12">
                    <h3>Proxy Ayarları</h3>
                </div>
            </div>

            <form id="ProxyForm">
                <input type="hidden" name="id" id="hdnId"/>
                <div className="row">
                    <div className="col-4">
                        <div className="form-group">
                            <label htmlFor="txtName">Proxy Adı</label>
                            <input type="text" name="name" className="form-control" id="txtName" aria-describedby="txtNameHelp" placeholder="Proxy Adı" style={{color: '#000000'}}/>
                            <small id="txtNameHelp" className="form-text text-black">Proxy hakkında bilgi içeren isimlendirme</small>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="form-group">
                            <label>Proxy Tipi</label>
                            <select id="slcProxyType" name="proxy_type" style={{color: '#000000'}} className="form-select form-control">
                                {(ProxyTypeData?.length || 0) <= 0 ? (<></>) : ProxyTypeData.map(t =>  <option key={t.id} id={`proxy_type_${t.id}`} value={t.id} selected={CurrentProxyType == t.id}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-8">
                        <div className="form-group">
                            <label htmlFor="txtInfo">Proxy Bilgisi</label>
                            <input type="text" name="info" className="form-control" id="txtInfo" aria-describedby="txtProxyInfo" placeholder="Proxy Bilgisi" style={{color: '#000000'}}/>
                            <small id="txtProxyInfo" className="form-text text-black">[KULLANICIADI:SIFRESI:SERVER:PORT]</small>
                        </div>
                    </div>
                    <div className="col-12">
                        <button type="button" className="btn btn-danger btn-pill" onClick={() => SaveProxy()}>Kaydet</button>
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
                    <h5>Proxy Listesi</h5>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-sm">
                    <thead>
                    <tr>
                        <th style={{width: 200}}>
                            Proxy Adı
                        </th>
                        <th style={{width: 200}}>
                            Proxy Tipi
                        </th>
                        <th>
                            Proxy Bilgisi
                        </th>
                        <th style={{width: 200}}>
                            İşlem
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {(ProxyData !== null && ProxyData.length || 0) <= 0 ? (<tr><td className="text-center" colSpan={4}>Henüz veri girilmedi.</td></tr>) : ProxyData.map(t => ProxyItem(t))}
                    </tbody>
                </table>
            </div>
        </div>

        <iPrompt.MessageBox/>
        <iPrompt.ConfirmBox Callback={(res) => DeleteProxy(res)}/>

    </>)
}