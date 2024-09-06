import React, { FC, useEffect, useState } from 'react';
import Prompt from '@/pages/app/components/prompt';
import CountCard from './components/countCard';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {ProxyObject} from "@/objects/proxy.object";
import {AppointmentObject} from "@/objects/appointment.object";
import {ApiGet} from "@/core/webrequest/controls/webRequest.control";
import {FormattedDate, FormattedDay} from "@/controls/utilities";
import RightModal from "@/controls/rightModal";
import {EnumObject} from "@/objects/enum.object";
import Detail from "@/pages/panel/appointment/detail";
import {StatisticsObject} from "@/objects/statistics.object";
import {ProgramObject} from "@/objects/program.object";


let ProgramDataList: ProgramObject[] = [];
let StatusDataList: EnumObject[] = [];
let PriorityDataList: EnumObject[] = [];
let CurrentDateTime: Date|undefined = undefined ;
export default function AdminDashboard(): ReturnType<FC> {

    const iPrompt = Prompt();
    const rightModal: RightModal = new RightModal();

    const [loading, setLoading] = useState<boolean>(true);
    const [CurrentDate, setCurrentDate] = useState<Date | null>(new Date());
    const [AppointmentData, setAppointmentData] = useState<AppointmentObject[]>([]);
    const [StatisticsData, setStatisticsData] = useState<StatisticsObject>({
        all_count: 0,
        new_count: 0,
        inQueue_count: 0,
        inProgress_count: 0,
        success_count: 0,
        fail_count: 0,
        cancel_count: 0,
    });

    useEffect(() => {
        GetStatistics();
        GetDailyAppointments(new Date());
        GetPrograms();
        GetStatuses();
        GetPriorities();
    }, []);




    async function GetStatistics(){
        setLoading(true);
        const resp = await ApiGet(`/admin/dashboard`);
        setLoading(false)
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        setStatisticsData(resp.data);
    }



    async function GetDailyAppointments(date: Date|null){
        CurrentDateTime = date ?? undefined;
        setCurrentDate(date);
        const day = FormattedDay(date ?? undefined);
        const resp = await ApiGet(`/admin/appointment/daily?day=${day}`);
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        setAppointmentData(resp.data);
    }


    async function GetPrograms(){
        const resp = await ApiGet('/admin/program/list');
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        ProgramDataList = resp.data;
    }

    async function GetStatuses(){
        const resp = await ApiGet('/admin/appointment/statuses');
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        StatusDataList = resp.data;
    }

    async function GetPriorities(){
        const resp = await ApiGet('/admin/appointment/priorities');
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        PriorityDataList = resp.data;
    }

    async function GetProgram(programKey: number){

        const resp = await ApiGet(`/admin/program/scraper/${programKey}`);
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }

        return JSON.parse(resp.data)
    }



    async function SelectAppointment(item: AppointmentObject){
        rightModal.Open(Detail({
            appointment: item,
            scraper: await GetProgram(item.program),
            programData: ProgramDataList,
            statusData: StatusDataList,
            priorityData: PriorityDataList,
            closeAction: (isRefresh) => {
                if(isRefresh){
                    GetDailyAppointments(CurrentDateTime ?? new Date());
                    GetStatistics();
                }

                rightModal.Close();
            },
            showMessage: (title, message) => iPrompt.MessageBoxShow(title, message)
        }));
    }




    function AppointmentItem(item: AppointmentObject) {
        return (<>
            <tr key={item.key}>
                <td>{item.key}</td>
                <td>{item.program_name}</td>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.contactNumber}</td>
                <td>{item.passportNumber}</td>
                <td>{FormattedDate(item.appointment_date)}</td>
                <td>
                    <button className="btn btn-sm btn-pill btn-success" style={{paddingTop: 4, paddingBottom: 4}} onClick={() => SelectAppointment(item)}>Düzenle</button>
                </td>
            </tr>
        </>);
    }


    return (<>
        <div className="m-5">

            <div className="row">
                <div className="col-12">
                    <h3>Randevu Listesi</h3>
                </div>
                <div className="col-4">
                    <div className="form-group">
                        <label style={{display: "block"}} className="inter-title">Randevu Tarihi</label>
                        <DatePicker className="form-control text-black w-100" selected={CurrentDate} onChange={(date: Date | null) => GetDailyAppointments(date)} dateFormat="yyyy-MM-dd"/>
                        <label style={{display: "block"}} className="text-secondary">Lütfen görüntülemek istediğiniz tarihi seçiniz.</label>
                    </div>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-12">
                    <div className="table-responsive">
                        <table className="table table-sm">
                            <thead>
                            <tr>
                                <th>
                                    İşlem No
                                </th>
                                <th>
                                    Program
                                </th>
                                <th>
                                    İsim
                                </th>
                                <th>
                                    Soyisim
                                </th>
                                <th>
                                    Telefon
                                </th>
                                <th>
                                    Pasaport No
                                </th>
                                <th>
                                    Tarih
                                </th>
                                <th style={{width: 130}}>
                                    Detay
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {(AppointmentData !== null && AppointmentData.length || 0) <= 0 ? (<tr>
                                <td className="text-center" colSpan={8}>Seçilen tarih için randevu alınmamış.</td>
                            </tr>) : AppointmentData.map(t => AppointmentItem(t))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="row my-5">
                <div className="col-12">
                    <hr/>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <h3>Sistem İstatistikleri</h3>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                    <CountCard Title="Toplam Randevu" Count={StatisticsData.all_count} loading={loading}/>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                    <CountCard Title="Yeni" Count={StatisticsData.new_count} loading={loading}/>
                </div>
                <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                    <CountCard Title="Kuyrukta" Count={StatisticsData.inQueue_count} loading={loading}/>
                </div>
                <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                    <CountCard Title="İşlemde" Count={StatisticsData.inProgress_count} loading={loading}/>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                    <CountCard Title="Başarılı Toplam" Count={StatisticsData.success_count} loading={loading}/>
                </div>
                <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                    <CountCard Title="Hatalı Toplam" Count={StatisticsData.fail_count} loading={loading}/>
                </div>
                <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                    <CountCard Title="İptal Toplam" Count={StatisticsData.cancel_count} loading={loading}/>
                </div>
            </div>


        </div>

        <rightModal.Render/>
        <iPrompt.MessageBox/>
    </>);
}
