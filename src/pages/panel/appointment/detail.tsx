import React from "react";
import {ApiPost} from "@/core/webrequest/controls/webRequest.control";
import {AppointmentObject} from "@/objects/appointment.object";
import {EnumObject} from "@/objects/enum.object";
import {CountryStepsInterface} from "@/interfaces/countrySteps.interface";
import {CountryEnum} from "@/enums/country.enum";
import {CzechiaForm} from "@/countryForms/czechia.form";
import {EstoniaForm} from "@/countryForms/estonia.form";
import {FranceForm} from "@/countryForms/france.form";
import {NetherlandsForm} from "@/countryForms/netherlands.form";
import {ItalyForm} from "@/countryForms/italy.form";
import {BulgariaForm} from "@/countryForms/bulgaria.form";
import FormRenderer from "@/pages/panel/appointment/formRenderer";
import {FormSerializerControl} from "@/core/webrequest/controls/formSerializer.control";
import {AppointmentStatusEnum} from "@/enums/appointmentStatus.enum";


interface DetailProps{
    appointment: AppointmentObject;
    countryData: EnumObject[],
    statusData: EnumObject[],
    priorityData: EnumObject[],
    closeAction: (isRefresh: boolean) => void,
    showMessage: (title: string, message: string) => void,
}

const Detail = (props: DetailProps) => {
    const app:AppointmentObject = props.appointment;
    const CountryData = props.countryData;
    const PriorityData = props.priorityData;
    const StatusData = props.statusData;
    const CurrentCountry = app.country;




    function CountryForm(props: {CurrentCountry: number}){
        let steps: CountryStepsInterface|undefined = undefined;

        switch (props.CurrentCountry){
            case CountryEnum.CzechRepublic: steps = new CzechiaForm(); break;
            case CountryEnum.Estonia: steps = new EstoniaForm(); break;
            case CountryEnum.France: steps = new FranceForm(); break;
            case CountryEnum.Netherlands: steps = new NetherlandsForm(); break;
            case CountryEnum.Italy: steps = new ItalyForm(); break;
            case CountryEnum.Bulgaria: steps = new BulgariaForm(); break;
        }

        if(steps != undefined)
            return (<FormRenderer Steps={steps.Steps} FormSave={Save} Dataset={app.dataset}/>);
        else
            return (<></>);
    }




    const Save = async (formData: Record<string, any>) => {

        formData = {
            ...formData,
            ...FormSerializerControl("AppointmentDetailForm")
        }

        const saveReq = await ApiPost('/admin/appointment/save', formData);
        if (!saveReq.success) {
            props.showMessage("Hata", saveReq.message || "Bilinmeyen bir hata oluştu!");
            return;
        }

        props.showMessage("Başarılı", "Randevu başarılı bir şekilde oluşturuldu!");
        props.closeAction(true);
    }






    return (<>

        <div className="row m-3">
            <div className="col-6">
                <h4>Randevu Detayı</h4>
            </div>
            <div className="col-6">
                <button onClick={() => props.closeAction(false)} type="button" className="btn btn-secondary btn-pill float-right">Kapat</button>
            </div>
        </div>

        <hr/>

        <form id="AppointmentDetailForm" className="mt-3">

            <input type="hidden" name="key"/>

            <div className="row d-flex justify-content-center">

                <div className="col-6">
                    <div className="form-group">
                        <label className="h6">Başvuru Ülkesi</label>
                        <select name="country" disabled={true} style={{color: '#000000'}} className="form-select form-control" value={app.country}>
                            {(CountryData?.length || 0) <= 0 ? (<></>) : CountryData.map(t => <option key={t.key} id={`country_${t.key}`} value={t.key}>{t.code}</option>)}
                        </select>
                    </div>
                </div>

                <div className="col-6">
                    <div className="form-group">
                        <label className="h6">Durumu</label>
                        <select name="status" disabled={app.status >= AppointmentStatusEnum.InProgress} style={{color: '#000000'}} className="form-select form-control">
                            <option value="-1">Tümü</option>
                            {(StatusData?.length || 0) <= 0 ? (<></>) : StatusData.map(t => <option key={t.key} id={`status_${t.key}`} value={t.key} selected={app.status == t.key}>{t.code}</option>)}
                        </select>
                    </div>
                </div>

                <div className="col-6">
                    <div className="form-group">
                        <label className="h6">Randevu Tipi</label>
                        <select name="is_vip" style={{color: '#000000'}} className="form-select form-control">
                            <option value="0" selected={!app.is_vip}>Standart Randevu</option>
                            <option value="1" selected={app.is_vip}>Vip Randevu</option>
                        </select>
                    </div>
                </div>

                <div className="col-6">
                    <div className="form-group">
                        <label className="h6">Öncelik</label>
                        <select name="priority" style={{color: '#000000'}} className="form-select form-control">
                            {(PriorityData?.length || 0) <= 0 ? (<></>) : PriorityData.map(t => <option key={t.key} id={`priority_${t.key}`} value={t.key} selected={t.key == app.priority}>{t.code}</option>)}
                        </select>
                    </div>
                </div>

            </div>
        </form>

        <div className="row">
            <div className="col-12">
                <hr/>
            </div>
        </div>

        <CountryForm CurrentCountry={CurrentCountry}/>

        <div className="row mt-5">
            <div className="col-12">
                <span id="ErrorResultLabel" style={{color: "red"}}></span>
            </div>
        </div>

    </>);
}

export default Detail;