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

        if ((document.getElementById('user_work_interval') as HTMLInputElement) !== undefined) (document.getElementById('user_work_interval') as HTMLInputElement).value = String(settings?.user_work_interval ?? "");
        if ((document.getElementById('user_max_follow') as HTMLInputElement) !== undefined) (document.getElementById('user_max_follow') as HTMLInputElement).value = String(settings?.user_max_follow ?? "");
        if ((document.getElementById('user_max_like') as HTMLInputElement) !== undefined) (document.getElementById('user_max_like') as HTMLInputElement).value = String(settings?.user_max_like ?? "");
        if ((document.getElementById('user_max_comment') as HTMLInputElement) !== undefined) (document.getElementById('user_max_comment') as HTMLInputElement).value = String(settings?.user_max_comment ?? "");
        if ((document.getElementById('user_max_watch') as HTMLInputElement) !== undefined) (document.getElementById('user_max_watch') as HTMLInputElement).value = String(settings?.user_max_watch ?? "");
        if ((document.getElementById('user_max_retweet') as HTMLInputElement) !== undefined) (document.getElementById('user_max_retweet') as HTMLInputElement).value = String(settings?.user_max_retweet ?? "");
        //


        if ((document.getElementById('credit_renewal_minute') as HTMLInputElement) !== undefined) (document.getElementById('credit_renewal_minute') as HTMLInputElement).value = String(settings?.credit_renewal_minute ?? "");
        if ((document.getElementById('user_follow_credit') as HTMLInputElement) !== undefined) (document.getElementById('user_follow_credit') as HTMLInputElement).value = String(settings?.user_follow_credit ?? "");
        if ((document.getElementById('user_like_credit') as HTMLInputElement) !== undefined) (document.getElementById('user_like_credit') as HTMLInputElement).value = String(settings?.user_like_credit ?? "");
        if ((document.getElementById('user_comment_credit') as HTMLInputElement) !== undefined) (document.getElementById('user_comment_credit') as HTMLInputElement).value = String(settings?.user_comment_credit ?? "");
        if ((document.getElementById('user_watch_credit') as HTMLInputElement) !== undefined) (document.getElementById('user_watch_credit') as HTMLInputElement).value = String(settings?.user_watch_credit ?? "");
        if ((document.getElementById('user_retweet_credit') as HTMLInputElement) !== undefined) (document.getElementById('user_retweet_credit') as HTMLInputElement).value = String(settings?.user_retweet_credit ?? "");

        if ((document.getElementById('device_create_per_login') as HTMLInputElement) !== undefined) (document.getElementById('device_create_per_login') as HTMLInputElement).checked = settings?.device_create_per_login == 1;

        if ((document.getElementById('sent_req_interval') as HTMLInputElement) !== undefined) (document.getElementById('sent_req_interval') as HTMLInputElement).value = String(settings?.sent_req_interval ?? "");
        if ((document.getElementById('max_follow_thread') as HTMLInputElement) !== undefined) (document.getElementById('max_follow_thread') as HTMLInputElement).value = String(settings?.max_follow_thread ?? "");
        if ((document.getElementById('max_like_thread') as HTMLInputElement) !== undefined) (document.getElementById('max_like_thread') as HTMLInputElement).value = String(settings?.max_like_thread ?? "");
        if ((document.getElementById('max_comment_thread') as HTMLInputElement) !== undefined) (document.getElementById('max_comment_thread') as HTMLInputElement).value = String(settings?.max_comment_thread ?? "");
        if ((document.getElementById('max_watch_thread') as HTMLInputElement) !== undefined) (document.getElementById('max_watch_thread') as HTMLInputElement).value = String(settings?.max_watch_thread ?? "");
        if ((document.getElementById('max_retweet_thread') as HTMLInputElement) !== undefined) (document.getElementById('max_retweet_thread') as HTMLInputElement).value = String(settings?.max_retweet_thread ?? "");

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

         console.log(`device_create_per_login >>> ${(document.getElementById('device_create_per_login') as HTMLInputElement).type}`);


        const saveReq = await ApiPost('/admin/settings/save', FormSerializerControl("SettingsForm"));
        if (!saveReq.success) {
            iPrompt.MessageBoxShow("Hata", saveReq.message || "Bilinmeyen bir hata oluştu!");
            return;
        }else{
            iPrompt.MessageBoxShow("Başarılı", "Kayıt işlemi başarılı!");
        }
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
                        <h6>Login Ayarları</h6>
                        <hr/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <div className="form-group">
                            <label htmlFor="device_create_per_login">Her Loginde Bir Cihaz Oluştur? </label>
                            <input type="checkbox" name="device_create_per_login" id="device_create_per_login"
                                   className="ml-4" aria-describedby="device_create_per_login" style={{color: '#000000'}}/>
                        </div>
                    </div>
                </div>


                <div className="row mt-5">
                    <div className="col-12">
                        <h6>Bot Ayarları</h6>
                        <hr/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <div className="form-group">
                            <label htmlFor="txtName">Çalışma Aralığı (Saniye)</label>
                            <input type="text" name="user_work_interval" className="form-control" id="user_work_interval"
                                   aria-describedby="user_work_interval" style={{color: '#000000'}}/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-2">
                        <div className="form-group">
                            <label htmlFor="txtInfo">Max Takip</label>

                            <input type="text" name="user_max_follow" className="form-control" id="user_max_follow"
                                   aria-describedby="user_max_follow" style={{color: '#000000'}}/>

                        </div>
                    </div>
                    <div className="col-2">
                        <div className="form-group">
                            <label htmlFor="txtInfo">Max Beğeni</label>

                            <input type="text" name="user_max_like" className="form-control" id="user_max_like"
                                   aria-describedby="user_max_like" style={{color: '#000000'}}/>

                        </div>
                    </div>
                    <div className="col-2">
                        <div className="form-group">
                            <label htmlFor="txtInfo">Max Yorum</label>

                            <input type="text" name="user_max_comment" className="form-control" id="user_max_comment"
                                   aria-describedby="user_max_comment" style={{color: '#000000'}}/>

                        </div>
                    </div>
                    <div className="col-2">
                        <div className="form-group">
                            <label htmlFor="txtInfo">Max İzleme</label>

                            <input type="text" name="user_max_watch" className="form-control" id="user_max_watch"
                                   aria-describedby="user_max_watch" style={{color: '#000000'}}/>

                        </div>
                    </div>
                    <div className="col-2">
                        <div className="form-group">
                            <label htmlFor="txtInfo">Max Retweet</label>

                            <input type="text" name="user_max_retweet" className="form-control" id="user_max_retweet"
                                   aria-describedby="user_max_retweet" style={{color: '#000000'}}/>

                        </div>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-12">
                        <h6>Otomatik Kredi Ayarları</h6>
                        <hr/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <div className="form-group">
                            <label htmlFor="txtName">Yenilenme Aralığı (Dakika)</label>
                            <input type="text" name="credit_renewal_minute" className="form-control" id="credit_renewal_minute"
                                   aria-describedby="credit_renewal_minute" style={{color: '#000000'}}/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-2">
                        <div className="form-group">
                            <label htmlFor="txtInfo">Takip Kredisi</label>

                            <input type="text" name="user_follow_credit" className="form-control" id="user_follow_credit"
                                   aria-describedby="user_follow_credit" style={{color: '#000000'}}/>

                        </div>
                    </div>
                    <div className="col-2">
                        <div className="form-group">
                            <label htmlFor="txtInfo">Beğeni Kredisi</label>
                            <input type="text" name="user_like_credit" className="form-control" id="user_like_credit"
                                   aria-describedby="user_like_credit" style={{color: '#000000'}}/>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="form-group">
                            <label htmlFor="txtInfo">Yorum Kredisi</label>
                            <input type="text" name="user_comment_credit" className="form-control" id="user_comment_credit"
                                   aria-describedby="user_comment_credit" style={{color: '#000000'}}/>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="form-group">
                            <label htmlFor="txtInfo">İzleme Kredisi</label>
                            <input type="text" name="user_watch_credit" className="form-control" id="user_watch_credit"
                                   aria-describedby="user_watch_credit" style={{color: '#000000'}}/>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="form-group">
                            <label htmlFor="txtInfo">Retweet Kredisi</label>
                            <input type="text" name="user_retweet_credit" className="form-control" id="user_retweet_credit"
                                   aria-describedby="user_retweet_credit" style={{color: '#000000'}}/>
                        </div>
                    </div>
                </div>


                <div className="row mt-5">
                    <div className="col-12">
                        <h6>Gönderim Ayarları</h6>
                        <hr/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-4">
                        <div className="form-group">
                            <label htmlFor="txtName">Gönderim Çalışma Aralığı (Saniye)</label>
                            <input type="text" name="sent_req_interval" className="form-control" id="sent_req_interval"
                                   aria-describedby="sent_req_interval" style={{color: '#000000'}}/>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-2">
                        <div className="form-group">
                            <label htmlFor="txtInfo">Max Takip Thread</label>

                            <input type="text" name="max_follow_thread" className="form-control" id="max_follow_thread"
                                   aria-describedby="max_follow_thread" style={{color: '#000000'}}/>

                        </div>
                    </div>
                    <div className="col-2">
                        <div className="form-group">
                            <label htmlFor="txtInfo">Max Beğeni Thread</label>

                            <input type="text" name="max_like_thread" className="form-control" id="max_like_thread"
                                   aria-describedby="max_like_thread" style={{color: '#000000'}}/>

                        </div>
                    </div>
                    <div className="col-2">
                        <div className="form-group">
                            <label htmlFor="txtInfo">Max Yorum Thread</label>

                            <input type="text" name="max_comment_thread" className="form-control" id="max_comment_thread"
                                   aria-describedby="max_comment_thread" style={{color: '#000000'}}/>

                        </div>
                    </div>
                    <div className="col-2">
                        <div className="form-group">
                            <label htmlFor="txtInfo">Max İzleme Thread</label>

                            <input type="text" name="max_watch_thread" className="form-control" id="max_watch_thread"
                                   aria-describedby="max_watch_thread" style={{color: '#000000'}}/>

                        </div>
                    </div>
                    <div className="col-2">
                        <div className="form-group">
                            <label htmlFor="txtInfo">Max Retweet Thread</label>

                            <input type="text" name="max_retweet_thread" className="form-control" id="max_retweet_thread"
                                   aria-describedby="max_retweet_thread" style={{color: '#000000'}}/>

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