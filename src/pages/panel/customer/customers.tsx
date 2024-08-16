import Head from "next/head";
import React, {useEffect, useState} from "react";
import {AccountObject} from "@/objects/account.object";
import {SocketClientControl} from "@/core/websocket/controls/socketClient.control";
import {SocketActionsEnum} from "@/core/websocket/enums/socketActions.enum";
import {ApiGet, ApiPost} from "@/core/webrequest/controls/webRequest.control";
import Prompt from "@/pages/app/components/prompt";
import Link from "next/link";
import DataGridControl, {GridCustomFilterModel} from "@/pages/app/components/dataGridControl";
import {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import RightModal from "@/controls/rightModal";
import Detail from "@/pages/panel/customer/detail";
import {CustomerObject} from "@/objects/customer.object";
import {v4 as uuidv4} from "uuid";
import {AppointmentStatusEnum} from "@/enums/appointmentStatus.enum";

let AccountsDataArray: AccountObject[] = [];
let CurrentFilter: GridCustomFilterModel | undefined = undefined;

export default function Accounts(){


    // const [currentUser, setCurrentUser] = React.useState<UserObject>(new UserObject());
    const [customFilter, setCustomFilter] = React.useState<GridCustomFilterModel>();
    const [userTypeTitle, setUserTypeTitle] = React.useState<string>("Müşteri Tipi: Tümü");

    const dataGrid: DataGridControl = new DataGridControl();
    const rightModal: RightModal = new RightModal();
    const iPrompt = Prompt();





    function SelectUserType(isBot: Boolean|undefined){
        let title = "Kullanıcı Türü: ";
        if(isBot == undefined){
            setCustomFilter(undefined);
            title += "Tümü";
        }
        else{
            CurrentFilter = { RunKey: uuidv4(), FieldName: "is_bot", FilterValue: isBot, IsString: false};
            setCustomFilter(CurrentFilter);
            title += isBot ? "Müşteri Hesapları" : "Kullanıcı Müşteri Hesapları";
        }

        setUserTypeTitle(title);
    }


    async function SelectUser(userId: number) {
        const resp = await ApiPost('/admin/customer/select', {id: userId})
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }

        rightModal.Open(Detail({
            user: resp.data,
            closeAction: (isRefresh) => {
                if(isRefresh)
                    setCustomFilter({RunKey: "-1", FieldName: "is_bot", FilterValue: false, IsString: false});

                rightModal.Close();
            }
        }));
    }

    const createDynamicComponent = (component: React.ComponentType<any>, props: any) => {
        return React.createElement(component, props);
    };




    const getStatusName = (status: number) => {
        switch (status){
            case AppointmentStatusEnum.New: return "Yeni";
            case AppointmentStatusEnum.InQueue: return "Kuyrukta";
            case AppointmentStatusEnum.InProgress: return "İşlemde";
            case AppointmentStatusEnum.Success: return "Randevu Alındı";
            default:
            case AppointmentStatusEnum.Fail: return "Hata Var";
        }
    }


    const columns: GridColDef[] = [

        { field: 'username', headerName: 'Kullanıcı Adı', flex: 1},
        { field: 'password', headerName: 'Şifresi', flex: 1},
        { field: 'email', headerName: 'EPosta', flex: 1},
        { field: 'email_password', headerName: 'EPosta Şifresi', flex: 1},
        { field: 'spam_status', headerName: 'Durum', flex: 1, renderCell: (params: GridRenderCellParams<any, number>) => {
                if (!params.value)
                    return '';
                return getStatusName(params.value);
            }},
        { field: 'credit_follow', headerName: 'Takip Kredi', flex: 1},
        { field: 'credit_like', headerName: 'Beğeni Kredi', flex: 1},
        { field: 'credit_comment', headerName: 'Yorum Kredi', flex: 1},
        { field: 'credit_watch', headerName: 'İzlm Krdi', flex: 1},

    ];



    const FilterControl = () =>{
        return(<>
            <div className="btn-group">
                <button type="button" className="btn btn-outline-danger btn-sm dropdown-toggle dropdown-toggle-split btn-pill" style={{ fontSize: 14, paddingTop: 0, paddingBottom: 0, height: 36}}
                        data-bs-toggle="dropdown" aria-expanded="false">
                    <span className="visually-hidden">{ userTypeTitle }</span>
                </button>
                <ul className="dropdown-menu">
                    <li>
                        <Link onClick={(e) => SelectUserType(false)} href={''}>
                            <span className="dropdown-item">Standart Müşteri Hesapları</span>
                        </Link>
                    </li>
                    <li>
                        <Link onClick={(e) => SelectUserType(true)} href={''}>
                            <span className="dropdown-item">Vip Müşteri Hesapları</span>
                        </Link>
                    </li>
                    <li>
                        <Link onClick={(e) => SelectUserType(undefined)} href={''}>
                            <span className="dropdown-item">Tüm Müşteri Hesapları</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </>)
    }

    return (<>

        <Head>
            <title>Müşteri Hesapları - Visa Appointment Engine</title>
        </Head>

        <div className="m-3">
            <div className="row">
                <div className="col-6">
                    <h3>Müşteri Hesapları</h3>
                </div>

                <div className="col-6 table_controller">
                    <FilterControl/>
                </div>
            </div>
            <br></br>
            <div className="row">
                <div className="col-12">

                    <div style={{height: 700, width: '100%'}}>
                        <dataGrid.Render api={'/admin/customer/dataservice'} columns={columns} customFilterModel={customFilter} isMongo={true}/>
                    </div>

                </div>
            </div>
        </div>

        <rightModal.Render />

        <iPrompt.MessageBox/>
    </>)
}