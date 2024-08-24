import Prompt from "@/pages/app/components/prompt";
import React, {useEffect, useState} from "react";
import {ApiGet, ApiPost} from "@/core/webrequest/controls/webRequest.control";
import {FormSerializerControl} from "@/core/webrequest/controls/formSerializer.control";
import Head from "next/head";
import {EnumObject} from "@/objects/enum.object";
import {SiteAccountObject} from "@/objects/siteAccount.object";


let UserListData: SiteAccountObject[];
let CountryListData: EnumObject[];
let DeleteCountryKey: number;





export default function UserAccounts() {

    const iPrompt = Prompt();

    let UserData: SiteAccountObject[],
        setUserData: (value: (((prevState: SiteAccountObject[]) => SiteAccountObject[]) | SiteAccountObject[])) => void;
    [UserData, setUserData] = useState<SiteAccountObject[]>([]) ;



    const [CountryData, setCountryData] = useState<EnumObject[]>([]);
    const [CurrentCountry, setCurrentCountry] = useState<number>(0);


    useEffect(() => {
        GetUsers();
        GetCounties();
    }, []);

    const GetUsers = async () => {
        const usersReq = await ApiGet('/admin/siteaccount/list');
        if (!usersReq.success) {
            iPrompt.MessageBoxShow("Hata", usersReq.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        UserListData = usersReq.data;
        setUserData(UserListData);
    }

    async function GetCounties(){
        const resp = await ApiGet('/admin/appointment/countries');
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        setCountryData(resp.data);
        CountryListData = resp.data;
    }

    function getCountryNameById(key: number){
        return CountryListData.find(t => t.key == key)?.code;
    }



    const SaveUser = async () => {
        console.log(FormSerializerControl("UserForm"));

        const saveReq = await ApiPost('/admin/siteaccount/save', FormSerializerControl("UserForm"));
        if (!saveReq.success) {
            iPrompt.MessageBoxShow("Hata", saveReq.message || "Bilinmeyen bir hata oluştu!");
            return;
        }

        await GetUsers();
        ClearUser();
    }

    function DeleteUserRequest(country: number) {
        DeleteCountryKey = country;
        iPrompt.ConfirmBoxShow("Kullanıcı Silme", "Kullanıcı bilgisi sistemden silinecektir. Onaylıyor musunuz?");
    }

    const DeleteUser = async (isOkay: boolean) => {
        if (!isOkay) return;

        const deleteReq = await ApiPost('/admin/siteaccount/delete', { country: DeleteCountryKey });
        if (!deleteReq.success) {
            iPrompt.MessageBoxShow("Hata", deleteReq.message || "Bilinmeyen bir hata oluştu!");
            return;
        }

        await GetUsers();
        ClearUser();
    }

    const SelectUser = (user: SiteAccountObject) => {
       // (document.getElementById('hdnId') as HTMLInputElement).value = user.id.toString();
        (document.getElementById('txtUsername') as HTMLInputElement).value = user.username;
        (document.getElementById('txtPassword') as HTMLInputElement).value = user.password;
        setCurrentCountry(user.country);
    }

    function ClearUser() {
        (document.getElementById('hdnId') as HTMLInputElement).value = "0";
        (document.getElementById('txtUsername') as HTMLInputElement).value = "";
        (document.getElementById('txtPassword') as HTMLInputElement).value = "";
        setCurrentCountry(0);
    }

    function UserItem(item: SiteAccountObject) {

        return (<tr key={item.id}>
                <td>{getCountryNameById(item.country)}</td>
                <td>{item.username}</td>
                <td>{item.password}</td>
            <td>
                <button className="btn btn-sm btn-pill btn-success py-1 mx-1" onClick={() => SelectUser(item)}>Düzenle
                </button>
                <button className="btn btn-sm btn-pill btn-danger py-1" onClick={() => DeleteUserRequest(item.country)}>Sil
                </button>

            </td>
        </tr>);
    }

    return (<>
            <Head>
                <title>Kullanıcı Ayarları - Visa Appointment Engine</title>
            </Head>

            <div className="container mt-3">
                <div className="row">
                    <div className="col-12">
                        <h3>Kullanıcı Ayarları</h3>
                    </div>
                </div>

                <form id="UserForm">
                    <input type="hidden" name="id" id="hdnId" />
                    <div className="row">
                        <div className="col-4">
                            <div className="form-group">
                                <label htmlFor="txtUsername">Kullanıcı Adı</label>
                                <input type="text" name="username" className="form-control" id="txtUsername" aria-describedby="txtUsernameHelp" placeholder="Kullanıcı Adı" style={{ color: '#000000' }} />
                                <small id="txtUsernameHelp" className="form-text text-black">Kullanıcı adı bilgisi</small>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="form-group">
                                <label htmlFor="txtPassword">Şifre</label>
                                <input type="password" name="password" className="form-control" id="txtPassword" aria-describedby="txtPasswordHelp" placeholder="Şifre" style={{ color: '#000000' }} />
                                <small id="txtPasswordHelp" className="form-text text-black">Kullanıcı şifresi</small>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <div className="form-group">
                                <label htmlFor="slcCountry">Ülke</label>
                                <select name="country" style={{color: '#000000'}} className="form-select form-control" value={CurrentCountry} onChange={(e) => setCurrentCountry(Number(e.target.value))}>
                                    <option key="0" id={`country_0`} value="0" selected={true} disabled={true}>Başlamak için lütfen ülke seçiniz!</option>
                                    {(CountryData?.length || 0) <= 0 ? (<></>) : CountryData.map(t => <option key={t.key} id={`country_${t.key}`} value={t.key}>{t.code}</option>)}
                                </select>
                                <small id="txtCountryHelp" className="form-text text-black">Kullanıcının ülkesi</small>
                            </div>
                        </div>
                        <div className="col-12">
                            <button type="button" className="btn btn-danger btn-pill" onClick={() => SaveUser()}>Kaydet</button>
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
                        <h5>Kullanıcı Listesi</h5>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-sm">
                        <thead>
                        <tr>
                            <th style={{width: 200}}>
                                Ülke
                            </th>
                            <th style={{width: 200}}>
                                Kullanıcı Adı
                            </th>
                            <th style={{width: 200}}>
                                Şifre
                            </th>
                            <th style={{width: 200}}>
                                İşlem
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {(UserData !== null && UserData.length || 0) <= 0 ? (<tr><td className="text-center" colSpan={3}>Henüz veri girilmedi.</td></tr>) : UserData.map(t => UserItem(t))}
                        </tbody>
                    </table>
                </div>
            </div>

            <iPrompt.MessageBox />
            <iPrompt.ConfirmBox Callback={(res) => DeleteUser(true)} />
        </>
    )
}
