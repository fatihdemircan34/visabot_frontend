import Prompt from "@/pages/app/components/prompt";
import React, {useEffect, useState} from "react";
import {ApiGet, ApiPost} from "@/core/webrequest/controls/webRequest.control";
import {FormSerializerControl} from "@/core/webrequest/controls/formSerializer.control";
import Head from "next/head";
import {EnumObject} from "@/objects/enum.object";
import {SiteAccountObject} from "@/objects/siteAccount.object";
import RightModal from "@/controls/rightModal";
import {GridCustomFilterModel} from "@/pages/app/components/dataGridControl";
import DataGridComponent from "@/components/DataGrid/DataGridComponent";
import {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import {AppointmentStatusEnum} from "@/enums/appointmentStatus.enum";
import {ProgramObject} from "@/objects/program.object";


let UserListData: SiteAccountObject[];
let CountryListData: EnumObject[];
let DeleteCountryKey: number;





export default function SiteAccounts() {

    const rightModal: RightModal = new RightModal();
    const iPrompt = Prompt();

    const [CustomFilter1, setCustomFilter1] = React.useState<GridCustomFilterModel>();
    const [CustomFilter2, setCustomFilter2] = React.useState<GridCustomFilterModel>();
    const [CustomFilter3, setCustomFilter3] = React.useState<GridCustomFilterModel>();
    const [CustomFilter4, setCustomFilter4] = React.useState<GridCustomFilterModel>();


    const [ProgramData, setProgramData] = useState<ProgramObject[]>([]);
    const [CurrentProgram, setCurrentProgram] = useState<number>(0);


    useEffect(() => {
        GetPrograms();
    }, []);



    async function GetPrograms(){
        const resp = await ApiGet('/admin/program/list');
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        setProgramData(resp.data);
        CountryListData = resp.data;
    }



    const SaveUser = async () => {
        console.log(FormSerializerControl("UserForm"));

        const saveReq = await ApiPost('/admin/siteaccount/save', FormSerializerControl("UserForm"));
        if (!saveReq.success) {
            iPrompt.MessageBoxShow("Hata", saveReq.message || "Bilinmeyen bir hata oluştu!");
            return;
        }

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

        ClearUser();
    }

    const SelectUser = (user: SiteAccountObject) => {
       // (document.getElementById('hdnId') as HTMLInputElement).value = user.id.toString();
        (document.getElementById('txtUsername') as HTMLInputElement).value = user.username;
        (document.getElementById('txtPassword') as HTMLInputElement).value = user.password;
        setCurrentProgram(user.country);
    }

    function ClearUser() {
        (document.getElementById('hdnId') as HTMLInputElement).value = "0";
        (document.getElementById('txtUsername') as HTMLInputElement).value = "";
        (document.getElementById('txtPassword') as HTMLInputElement).value = "";
        setCurrentProgram(0);
    }




    const columns: GridColDef[] = [

        { field: 'key', headerName: 'Key', flex: 1},
        { field: 'program_name', headerName: 'Program', flex: 1},
        { field: 'username', headerName: 'Kullanıcı Adı', flex: 1},
        { field: 'password', headerName: 'Şifresi', flex: 1},
        { field: 'email', headerName: 'E-Posta', flex: 1},
        { field: 'run_count', headerName: 'Çalışma Sayısı', flex: 1},
        { field: 'detail', headerName: 'Detay', flex: 1, sortable: false, editable: false, renderCell: (params: GridRenderCellParams<any, number>) => {
                return <button type="button" className="btn btn-sm btn-primary py-1" onClick={() => SelectUser(params.row)}>Detay</button>;
            }
        },
        { field: 'delete', headerName: 'Kayıt Sil', flex: 1, sortable: false, editable: false, renderCell: (params: GridRenderCellParams<any, number>) => {
                if(params.row?.status == AppointmentStatusEnum.New || params.row?.status == AppointmentStatusEnum.InQueue)
                    return <button type="button" className="btn btn-sm btn-soft-danger py-1" onClick={() => DeleteUserRequest(parseInt(params.row?.key ?? "0"))}>Hesap Sil</button>;
                else
                    return <></>
            }
        },
    ];





    return (<>
            <Head>
                <title>Hedef Site Hesapları - Visa Appointment Engine</title>
            </Head>

            <div className="m-3">
                <div className="row">
                    <div className="col-12">
                        <h3>Hedef Site Hesapları</h3>
                    </div>
                </div>
                <br></br>

                <div className="row">

                    <div className="col-12">

                        <div style={{height: 700, width: '100%'}}>
                            <DataGridComponent filterText="Kullanıcı adı veya mail adresi" api={'/admin/siteaccount/dataservice'}
                                               columns={columns} isRedis={true}
                                               customFilterModel={CustomFilter1}
                                               customFilterModel2={CustomFilter2}
                                               customFilterModel3={CustomFilter3}
                                               customFilterModel4={CustomFilter4}/>
                        </div>

                    </div>
                </div>
            </div>

            <rightModal.Render/>
            <iPrompt.MessageBox/>
            <iPrompt.ConfirmBox Callback={(res) => DeleteUser(res)}/>
        </>)
}
