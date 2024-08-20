import Prompt from "@/pages/app/components/prompt";
import {useEffect, useState} from "react";
import {ApiGet, ApiPost} from "@/core/webrequest/controls/webRequest.control";
import {FormSerializerControl} from "@/core/webrequest/controls/formSerializer.control";
import Head from "next/head";


let UserListData: UserObject[];
let CurrentUserId: string;
export interface UserObject {
    id: number;
    username: string;
    password: string;
    country: string;
}
const  countries = [
    { id: 1, name: 'CzechRepublic' },
    { id: 2, name: 'Estonia' },
    { id: 3, name: 'France' },
    { id: 4, name: 'Netherlands' },
    { id: 5, name: 'Italy' },
    { id: 6, name: 'Bulgaria' }
];

function getCountryNameById(id: number): string | undefined {
    const country = countries.find(c => c.id === id);
    return country ? country.name : undefined;
}

export default function UserAccounts() {

    const iPrompt = Prompt();

    let UserData: UserObject[],
        setUserData: (value: (((prevState: UserObject[]) => UserObject[]) | UserObject[])) => void;
    [UserData, setUserData] = useState<UserObject[]>([]) ;

    const [SelectedCountry,   setSelectedCountry] = useState<number>(0);

    useEffect(() => {
        GetUsers();
    }, []);

    const GetUsers = async () => {
        const usersReq = await ApiGet('/admin/users/list');
        if (!usersReq.success) {
            iPrompt.MessageBoxShow("Hata", usersReq.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        UserListData = usersReq.data;
        setUserData(UserListData);
    }

    const SaveUser = async () => {
        console.log(FormSerializerControl("UserForm"));

        const saveReq = await ApiPost('/admin/users/save', FormSerializerControl("UserForm"));
        if (!saveReq.success) {
            iPrompt.MessageBoxShow("Hata", saveReq.message || "Bilinmeyen bir hata oluştu!");
            return;
        }

        await GetUsers();
        ClearUser();
    }

    function DeleteUserRequest(userId: string) {
        CurrentUserId = userId;
        iPrompt.ConfirmBoxShow("Kullanıcı Silme", "Kullanıcı bilgisi sistemden silinecektir. Onaylıyor musunuz?");
    }

    const DeleteUser = async (isOkay: boolean) => {
        if (!isOkay) return;

        const deleteReq = await ApiPost('/admin/users/delete', { name: CurrentUserId });
        if (!deleteReq.success) {
            iPrompt.MessageBoxShow("Hata", deleteReq.message || "Bilinmeyen bir hata oluştu!");
            return;
        }

        await GetUsers();
        ClearUser();
    }

    const SelectUser = (user: UserObject) => {
       // (document.getElementById('hdnId') as HTMLInputElement).value = user.id.toString();
        (document.getElementById('txtUsername') as HTMLInputElement).value = user.username;
        (document.getElementById('txtPassword') as HTMLInputElement).value = user.password;
        setSelectedCountry(parseInt(user.country));
    }

    function ClearUser() {
        (document.getElementById('hdnId') as HTMLInputElement).value = "0";
        (document.getElementById('txtUsername') as HTMLInputElement).value = "";
        (document.getElementById('txtPassword') as HTMLInputElement).value = "";
        setSelectedCountry(0);
    }

    function UserItem(item: UserObject) {

        return (
            <tr key={item.id}>
                <td>{item.username}</td>
                <td>{item.password}</td>

                <td>{getCountryNameById(parseInt(item.country))}</td>
                <td>
                    <button className="btn btn-sm btn-pill btn-success" style={{paddingTop: 4, paddingBottom: 4}}    onClick={() => SelectUser(item)}>Düzenle
                    </button>

                </td>
            </tr>
        );
    }

    return (
        <>
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
                                <select name="country" className="form-select form-control" id="slcCountry"
                                        value={SelectedCountry}
                                        onChange={(e) => setSelectedCountry(parseInt(e.target.value))}
                                        style={{color: '#000000'}}>
                                    <option id="country_0" value="0" disabled>Başlamak için lütfen ülke seçiniz!
                                    </option>
                                    <option id="country_1" value="1">CzechRepublic</option>
                                    <option id="country_2" value="2">Estonia</option>
                                    <option id="country_3" value="3">France</option>
                                    <option id="country_4" value="4">Netherlands</option>
                                    <option id="country_5" value="5">Italy</option>
                                    <option id="country_6" value="6">Bulgaria</option>
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
                        <hr />
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
                                Kullanıcı Adı
                            </th>
                            <th style={{width: 200}}>
                                Şifre
                            </th>
                            <th style={{width: 200}}>
                                Ülke
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
