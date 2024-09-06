import Head from "next/head";
import React, {useEffect, useState} from "react";
import {ApiGet, ApiPost} from "@/core/webrequest/controls/webRequest.control";
import Prompt from "@/pages/app/components/prompt";
import Link from "next/link";
import DataGridControl, {GridCustomFilterModel} from "@/pages/app/components/dataGridControl";
import {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import RightModal from "@/controls/rightModal";
import Detail from "@/pages/panel/appointment/detail";
import {v4 as uuidv4} from "uuid";
import {AppointmentStatusEnum} from "@/enums/appointmentStatus.enum";
import DataGridComponent from "@/components/DataGrid/DataGridComponent";
import {EnumObject} from "@/objects/enum.object";
import {AppointmentObject} from "@/objects/appointment.object";
import { PriorityEnum } from "@/enums/priority.enum";
import {ProgramObject} from "@/objects/program.object";

let CurrentKey: number;
let CurrentConfirmAction: (isOkay: boolean) => Promise<void>;
let CountryDataList: EnumObject[] = [];
let StatusDataList: EnumObject[] = [];
let PriorityDataList: EnumObject[] = [];

export default function List(){

    const rightModal: RightModal = new RightModal();
    const iPrompt = Prompt();

    const [CustomFilter1, setCustomFilter1] = React.useState<GridCustomFilterModel>();
    const [CustomFilter2, setCustomFilter2] = React.useState<GridCustomFilterModel>();
    const [CustomFilter3, setCustomFilter3] = React.useState<GridCustomFilterModel>();
    const [CustomFilter4, setCustomFilter4] = React.useState<GridCustomFilterModel>();

    const [ProgramData, setProgramData] = useState<ProgramObject[]>([]);
    const [CurrentProgram, setCurrentProgram] = useState<number>(-1);

    const [StatusData, setStatusData] = useState<EnumObject[]>([]);
    const [CurrentStatus, setCurrentStatus] = useState<number>(-1);

    const [PriorityData, setPriorityData] = useState<EnumObject[]>([]);
    const [CurrentPriority, setCurrentPriority] = useState<number>(-1);

    const [CurrentType, setCurrentType] = useState<number>(-1);

    const [IsLoading, setIsLoading] = useState<boolean>(false);


    useEffect(() => {
        GetPrograms();
        GetStatuses();
        GetPriorities();
    }, []);



    async function GetPrograms(){
        const resp = await ApiGet('/admin/program/list');
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        setProgramData(resp.data);
        CountryDataList = resp.data;
    }

    async function GetStatuses(){
        const resp = await ApiGet('/admin/appointment/statuses');
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        setStatusData(resp.data);
        StatusDataList = resp.data;
    }

    async function GetPriorities(){
        const resp = await ApiGet('/admin/appointment/priorities');
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        setPriorityData(resp.data);
        PriorityDataList = resp.data;
    }

    async function GetProgram(programKey: number){
        setIsLoading(true);
        const resp = await ApiGet(`/admin/program/scraper/${programKey}`);
        setIsLoading(false);
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }

        return JSON.parse(resp.data)
    }

    async function SelectAppointment(item: AppointmentObject) {

        rightModal.Open(Detail({
            appointment: item,
            scraper: await GetProgram(item.program),
            programData: ProgramData,
            statusData: StatusDataList,
            priorityData: PriorityDataList,
            closeAction: (isRefresh) => {
                if(isRefresh){
                    setCustomFilter1(undefined);
                    setCustomFilter2(undefined);
                    setCustomFilter3(undefined);
                    setCustomFilter4(undefined);
                }

                rightModal.Close();
            },
            showMessage: (title, message) => iPrompt.MessageBoxShow(title, message)
        }));
    }


    async function CancelAppointmentRequest(key: number){
        CurrentKey = key;
        CurrentConfirmAction = CancelAppointment;
        iPrompt.ConfirmBoxShow("Randevu İptal Etme","Randevu sistem tarafından iptal edilecektir ve tekrar işleme alınamaz. Onaylıyor musunuz?");
    }

    const CancelAppointment = async(isOkay: boolean) => {
        if(!isOkay)
            return;

        const resp = await ApiPost('/admin/appointment/cancel', {key: CurrentKey});
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        iPrompt.MessageBoxShow("Başarılı", "Randevu başarılı bir şekilde iptal edildi!");
    }



    async function DeleteAppointmentRequest(key: number){
        CurrentKey = key;
        CurrentConfirmAction = DeleteAppointment;
        iPrompt.ConfirmBoxShow("Randevu Silme","Randevu sistemden silinecektir ve tekrar işleme alınamaz. Onaylıyor musunuz?");
    }

    const DeleteAppointment = async (isOkay: boolean)=> {
        if(!isOkay)
            return;

        const resp = await ApiPost('/admin/appointment/delete', {key: CurrentKey});
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        iPrompt.MessageBoxShow("Başarılı", "Randevu başarılı bir şekilde silindi!");
    }



    function SelectProgram(item: number){
        setCurrentProgram(item);
        if(item > -1)
            setCustomFilter1({
                RunKey: Date.now().toString(),
                FieldName: "program",
                FilterValue: item,
                IsString: true
            });
        else
            setCustomFilter1(undefined);
    }

    function SelectType(item: number){
        setCurrentType(item ?? undefined);
        if(item > -1)
            setCustomFilter2({
                RunKey: Date.now().toString(),
                FieldName: "is_vip",
                FilterValue: item == 1,
                IsString: false
            });
        else
            setCustomFilter2(undefined);
    }

    function SelectStatus(item: number){
        setCurrentStatus(item);
        if(item > -1)
            setCustomFilter3({
                RunKey: Date.now().toString(),
                FieldName: "status",
                FilterValue: item,
                IsString: true
            });
        else
            setCustomFilter3(undefined);
    }

    function SelectPriority(item: number){
        setCurrentPriority(item);
        if(item > -1)
            setCustomFilter4({
                RunKey: Date.now().toString(),
                FieldName: "priority",
                FilterValue: item,
                IsString: true
            });
        else
            setCustomFilter4(undefined);
    }






    const getStatusName = (status: number) => {
        switch (status){
            case AppointmentStatusEnum.New: return "Yeni";
            case AppointmentStatusEnum.InQueue: return "Kuyrukta";
            case AppointmentStatusEnum.InProgress: return "İşlemde";
            case AppointmentStatusEnum.Success: return "Randevu Alındı";
            case AppointmentStatusEnum.Canceled: return "İptal Edildi";
            default:
            case AppointmentStatusEnum.Fail: return "Hata Var";
        }
    }

    const getPriorityName = (priority: number) => {
        switch (priority){
            default:
            case PriorityEnum.Standard: return "Standart";
            case PriorityEnum.Level1: return "Level1";
            case PriorityEnum.Level2: return "Level2";
            case PriorityEnum.Level3: return "Level3";
            case PriorityEnum.Level4: return "Level4";
            case PriorityEnum.Level5: return "Level5";
        }
    }


    const columns: GridColDef[] = [

        { field: 'key', headerName: 'İşlem Numarası', flex: 1},
        { field: 'firstName', headerName: 'İsim', flex: 1},
        { field: 'lastName', headerName: 'Soyisim', flex: 1},
        { field: 'passportNumber', headerName: 'Pasaport No', flex: 1},
        { field: 'contactNumber', headerName: 'Telefon', flex: 1},
        { field: 'country_name', headerName: 'Vize Ülkesi', flex: 1},
        { field: 'priority', headerName: 'Öncelik', flex: 1, renderCell: (params: GridRenderCellParams<any, number>) => {
                if (!params.value)
                    return '';
                return getPriorityName(params.value);
            }
        },
        { field: 'appointment_date', headerName: 'Randevu Tarihi', flex: 1},
        { field: 'is_vip', headerName: 'Tipi', flex: 1, renderCell: (params: GridRenderCellParams<any, boolean>) => {
                if (!params.value)
                    return 'Standart';
                return 'Vip';
            }
        },
        { field: 'status', headerName: 'Durum', flex: 1, renderCell: (params: GridRenderCellParams<any, number>) => {
                if (!params.value)
                    return '';
                return getStatusName(params.value);
            }
        },
        { field: 'detail', headerName: 'Detay', flex: 1, sortable: false, editable: false, renderCell: (params: GridRenderCellParams<any, number>) => {
                return <button type="button" className="btn btn-sm btn-primary py-1" onClick={() => SelectAppointment(params.row)}>Detay</button>;
            }
        },
        { field: 'cancel', headerName: 'İptal', flex: 1, sortable: false, editable: false, renderCell: (params: GridRenderCellParams<any, number>) => {

            if(params.row?.status == AppointmentStatusEnum.New || params.row?.status == AppointmentStatusEnum.InQueue || params.row?.status == AppointmentStatusEnum.InProgress)
                return <button type="button" className="btn btn-sm btn-danger py-1" onClick={() => CancelAppointmentRequest(parseInt(params.row?.key ?? "0"))}>Randevu İptal</button>;
            else
                return <></>

            }
        },
        { field: 'delete', headerName: 'Kayıt Sil', flex: 1, sortable: false, editable: false, renderCell: (params: GridRenderCellParams<any, number>) => {
                if(params.row?.status == AppointmentStatusEnum.New || params.row?.status == AppointmentStatusEnum.InQueue)
                    return <button type="button" className="btn btn-sm btn-soft-danger py-1" onClick={() => DeleteAppointmentRequest(parseInt(params.row?.key ?? "0"))}>Randevu Sil</button>;
                else
                    return <></>
            }
        },
    ];




    return (<>

        <Head>
            <title>Randevu Listesi - Visa Appointment Engine</title>
        </Head>

        <div className="m-3">
            <div className="row">
                <div className="col-12">
                    <h3>Randevu Listesi</h3>
                </div>
            </div>
            <br></br>

            <div className="row">
                <div className="col-6">
                    <div className="form-group">
                        <label className="text-black" style={{fontSize: "1rem"}}>Program</label>
                        <select name="program" style={{color: '#000000'}} className="form-select form-control" value={CurrentProgram} onChange={(e) => SelectProgram(parseInt(e.target.value ?? "-1"))}>
                            <option value="-1">Tümü</option>
                            {(ProgramData?.length || 0) <= 0 ? (<></>) : ProgramData.map(t => <option key={t.key} id={`program_${t.key}`} value={t.key}>{t.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="col-6">
                    <div className="form-group">
                        <label className="text-black" style={{fontSize: "1rem"}}>Randevu Tipi</label>
                        <select name="is_vip" style={{color: '#000000'}} className="form-select form-control" value={CurrentType} onChange={(e) => SelectType(parseInt(e.target.value ?? "-1"))}>
                            <option value="-1">Tümü</option>
                            <option value="0">Standart Randevu</option>
                            <option value="1">Vip Randevu</option>
                        </select>
                    </div>
                </div>

                <div className="col-6">
                    <div className="form-group">
                        <label className="text-black" style={{fontSize: "1rem"}}>Durumu</label>
                        <select name="status" style={{color: '#000000'}} className="form-select form-control" value={CurrentStatus} onChange={(e) => SelectStatus(parseInt(e.target.value ?? "-1"))}>
                            <option value="-1">Tümü</option>
                            {(StatusData?.length || 0) <= 0 ? (<></>) : StatusData.map(t => <option key={t.key} id={`status_${t.key}`} value={t.key}>{t.code}</option>)}
                        </select>
                    </div>
                </div>

                <div className="col-6">
                    <div className="form-group">
                        <label className="text-black" style={{fontSize: "1rem"}}>Öncelik</label>
                        <select name="priority" style={{color: '#000000'}} className="form-select form-control" value={CurrentPriority} onChange={(e) => SelectPriority(parseInt(e.target.value ?? "-1"))}>
                            <option value="-1">Tümü</option>
                            {(PriorityData?.length || 0) <= 0 ? (<></>) : PriorityData.map(t => <option key={t.key} id={`status_${t.key}`} value={t.key}>{t.code}</option>)}
                        </select>
                    </div>
                </div>

                <div className="col-12">

                    <div style={{height: 700, width: '100%'}}>
                        <DataGridComponent filterText="Pasaport Numarası, isim, soyisim, telefon" api={'/admin/appointment/dataservice'}
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
        <iPrompt.ConfirmBox Callback={(res) => CurrentConfirmAction(res)}/>
    </>)
}