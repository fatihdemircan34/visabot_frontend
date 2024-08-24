import Head from "next/head";
import React, {useEffect, useState} from "react";
import {ApiGet, ApiPost} from "@/core/webrequest/controls/webRequest.control";
import {FormSerializerControl} from "@/core/webrequest/controls/formSerializer.control";
import {SettingsObject} from "@/objects/settings.object";
import Prompt from "@/pages/app/components/prompt";

export default function General() {

    const iPrompt = Prompt();

    useEffect(()=> {
        getSettings();
    },[]);



    const setParameters = (settings: SettingsObject) => {

        if ((document.getElementById('card_name') as HTMLInputElement) !== undefined) (document.getElementById('card_name') as HTMLInputElement).value = String(settings?.card_name ?? "");
        if ((document.getElementById('card_number') as HTMLInputElement) !== undefined) (document.getElementById('card_number') as HTMLInputElement).value = String(settings?.card_number ?? "");
        if ((document.getElementById('card_month') as HTMLInputElement) !== undefined) (document.getElementById('card_month') as HTMLInputElement).value = String(settings?.card_month ?? "");
        if ((document.getElementById('card_year') as HTMLInputElement) !== undefined) (document.getElementById('card_year') as HTMLInputElement).value = String(settings?.card_year ?? "");
        if ((document.getElementById('card_vcc') as HTMLInputElement) !== undefined) (document.getElementById('card_vcc') as HTMLInputElement).value = String(settings?.card_vcc ?? "");
        if ((document.getElementById('external_api_key') as HTMLInputElement) !== undefined) (document.getElementById('external_api_key') as HTMLInputElement).value = String(settings?.external_api_key ?? "");

    }







    const getSettings = async () => {
        const resp = await ApiGet('/admin/settings');
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        setParameters(resp.data);
    }

    const saveSettings = async () => {

        const saveReq = await ApiPost('/admin/settings/save', FormSerializerControl("SettingsForm"));
        if (!saveReq.success) {
            iPrompt.MessageBoxShow("Hata", saveReq.message || "Bilinmeyen bir hata oluştu!");
            return;
        }else{
            iPrompt.MessageBoxShow("Başarılı", "Kayıt işlemi başarılı!");
        }
    }


    function getRandom(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }


    const GenerateApiKey = async () => {
        if(document.getElementById('external_api_key') != undefined)
            (document.getElementById('external_api_key') as HTMLInputElement).value = getRandom(30);
    }

    return (<>
        <Head>
            <title>Genel Ayarlar - Visa Appointment Engine</title>
        </Head>


        <div className="container mt-3">

            <div className="row">
                <div className="col-12">
                    <h3>Genel Ayarlar</h3>
                </div>
            </div>


            <form id="SettingsForm">
                <div className="row mt-5">
                    <div className="col-12">
                        <h6>Robot Bağlantı Keyi</h6>
                        <hr/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-12 col-xl-6">
                        <div className="form-group">
                            <label htmlFor="external_api_key">Api Key</label>
                            <div>


                            </div>
                            <div className="input-group">
                                <input type="text" name="external_api_key" className="form-control" id="external_api_key" aria-describedby="txtProxyInfo" placeholder="Key" style={{color: '#000000'}}/>
                                <span className="input-group-btn">
                                <button type="button" className="btn btn-soft-secondary" onClick={() => GenerateApiKey()}>
                                     <i className="mdi mdi-coffee-maker"></i>
                                    Oluştur
                                </button>
                              </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-4">

                    </div>
                </div>


                <div className="row mt-5">
                    <div className="col-12">
                        <h6>Kredi Kartı</h6>
                        <hr/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <div className="form-group">
                            <label htmlFor="card_name">Kart Üzerinde Yazan İsim</label>
                            <input type="text" name="card_name" className="form-control" id="card_name" aria-describedby="card_name" style={{color: '#000000'}}/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <div className="form-group">
                            <label htmlFor="card_number">Kart Numarası</label>
                            <input type="text" name="card_number" className="form-control" id="card_number" aria-describedby="card_number" style={{color: '#000000'}}/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-2">
                        <div className="form-group">
                            <label htmlFor="card_month">Ay</label>
                            <input type="text" name="card_month" className="form-control" id="card_month" aria-describedby="card_month" style={{color: '#000000'}}/>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="form-group">
                            <label htmlFor="card_year">Yıl</label>
                            <input type="text" name="card_year" className="form-control" id="card_year" aria-describedby="card_year" style={{color: '#000000'}}/>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="form-group">
                            <label htmlFor="card_vcc">VCC</label>
                            <input type="text" name="card_vcc" className="form-control" id="card_vcc" aria-describedby="card_vcc" style={{color: '#000000'}}/>
                        </div>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-12">
                        <button onClick={() => saveSettings()} type="button" className="btn btn-danger btn-pill">Kaydet</button>
                    </div>
                </div>
            </form>

        </div>

        <iPrompt.MessageBox/>
    </>)
}