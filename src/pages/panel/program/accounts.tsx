import Prompt from "@/pages/app/components/prompt";
import React, {useEffect, useState} from "react";
import {ApiGet, ApiPost} from "@/core/webrequest/controls/webRequest.control";
import {FormSerializerControl} from "@/core/webrequest/controls/formSerializer.control";
import Head from "next/head";
import {EnumObject} from "@/objects/enum.object";
import {ProgramAccountObject} from "@/objects/programAccount.object";
import RightModal from "@/controls/rightModal";
import {GridCustomFilterModel} from "@/pages/app/components/dataGridControl";
import DataGridComponent from "@/components/DataGrid/DataGridComponent";
import {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import {AppointmentStatusEnum} from "@/enums/appointmentStatus.enum";
import {ProgramObject} from "@/objects/program.object";
import AccountDetail from "@/pages/panel/program/accountDetail";


let DeleteCountryKey: number;


export default function Accounts() {

    const rightModal: RightModal = new RightModal();
    const iPrompt = Prompt();

    const [CustomFilter1, setCustomFilter1] = React.useState<GridCustomFilterModel>();
    const [CustomFilter2, setCustomFilter2] = React.useState<GridCustomFilterModel>();
    const [CustomFilter3, setCustomFilter3] = React.useState<GridCustomFilterModel>();
    const [CustomFilter4, setCustomFilter4] = React.useState<GridCustomFilterModel>();


    const [ProgramData, setProgramData] = useState<ProgramObject[]>([]);


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
    }



    function DeleteUserRequest(country: number) {
        DeleteCountryKey = country;
        iPrompt.ConfirmBoxShow("Kullanıcı Silme", "Kullanıcı bilgisi sistemden silinecektir. Onaylıyor musunuz?");
    }

    const DeleteUser = async (isOkay: boolean) => {
        if (!isOkay) return;

        const deleteReq = await ApiPost('/admin/programaccount/delete', { country: DeleteCountryKey });
        if (!deleteReq.success) {
            iPrompt.MessageBoxShow("Hata", deleteReq.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
    }



    function SelectAccount(acc: ProgramAccountObject){
        rightModal.Open(AccountDetail({
            programData: ProgramData,
            programAccount: acc,
            closeAction: () => rightModal.Close(),
            messageShow: (title: string, message: string) => iPrompt.MessageBoxShow(title, message)
        }));
    }

    function NewAccount(){
        rightModal.Open(AccountDetail({
            programData: ProgramData,
            programAccount: undefined,
            closeAction: () => rightModal.Close(),
            messageShow: (title: string, message: string) => iPrompt.MessageBoxShow(title, message)
        }));
    }





    const columns: GridColDef[] = [

        { field: 'key', headerName: 'Key', flex: 1},
        { field: 'program_name', headerName: 'Program', flex: 1},
        { field: 'username', headerName: 'Kullanıcı Adı', flex: 1},
        { field: 'password', headerName: 'Şifresi', flex: 1},
        { field: 'email', headerName: 'E-Posta', flex: 1},
        { field: 'run_count', headerName: 'Çalışma Sayısı', flex: 1},
        { field: 'detail', headerName: 'Detay', flex: 1, sortable: false, editable: false, renderCell: (params: GridRenderCellParams<any, number>) => {
                return <button type="button" className="btn btn-sm btn-primary py-1" onClick={() => SelectAccount(params.row)}>Detay</button>;
            }
        },
        { field: 'delete', headerName: 'Hesap Sil', flex: 1, sortable: false, editable: false, renderCell: (params: GridRenderCellParams<any, number>) => {
                return <button type="button" className="btn btn-sm btn-soft-danger py-1" onClick={() => DeleteUserRequest(parseInt(params.row?.key ?? "0"))}>Hesap Sil</button>;
            }
        },
    ];





    return (<>
            <Head>
                <title>Program Hesapları - Visa Appointment Engine</title>
            </Head>

            <div className="m-3">
                <div className="row">
                    <div className="col-6">
                        <h3>Program Hesapları</h3>
                    </div>
                    <div className="col-6">
                        <button className="btn btn-danger float-right mb-2 mx-3" type="button" onClick={() => NewAccount()}>Yeni Hesap</button>
                    </div>
                </div>
                <br></br>

                <div className="row">

                    <div className="col-12">

                        <div style={{height: 700, width: '100%'}}>
                            <DataGridComponent filterText="Kullanıcı adı veya mail adresi" api={'/admin/programaccount/dataservice'}
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
