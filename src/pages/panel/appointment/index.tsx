import Head from "next/head";
import React, {useEffect, useState} from "react";
import Prompt from "@/pages/app/components/prompt";
import RightModal from "@/controls/rightModal";
import {ApiGet, ApiPost} from "@/core/webrequest/controls/webRequest.control";
import {ProxyObject} from "@/objects/proxy.object";
import {EnumObject} from "@/objects/enum.object";
import {CountryEnum} from "@/enums/country.enum";
import FormRenderer from "@/pages/panel/appointment/formRenderer";
import {CountryStepsInterface} from "@/interfaces/countrySteps.interface";
import {CzechiaForm} from "@/countryForms/czechia.form";
import {ItalyForm} from "@/countryForms/italy.form";
import {NetherlandsForm} from "@/countryForms/netherlands.form";
import {BulgariaForm} from "@/countryForms/bulgaria.form";
import {EstoniaForm} from "@/countryForms/estonia.form";
import {FranceForm} from "@/countryForms/france.form";
import {FormSerializerControl} from "@/core/webrequest/controls/formSerializer.control";



export default function AppointmentIndex(){

    const iPrompt = Prompt();

    const [CountryData, setCountryData] = useState<EnumObject[]>([]);
    const [CurrentCountry, setCurrentCountry] = useState<number>(0);

    const [PriorityData, setPriorityData] = useState<EnumObject[]>([]);
    const [CurrentPriority, setCurrentPriority] = useState<number>(0);


    useEffect(() => {
        GetCounties();
        GetPriorities();
    }, []);



    async function GetCounties(){
        const resp = await ApiGet('/admin/appointment/countries');
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        setCountryData(resp.data);
    }

    async function GetPriorities(){
        const resp = await ApiGet('/admin/appointment/priorities');
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        setPriorityData(resp.data);
    }

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
            return (<FormRenderer Steps={steps.Steps} FormSave={Save}/>);
        else
            return (<></>);
    }




    const Save = async (formData: Record<string, any>) => {

        formData = {
            ...formData,
            ...FormSerializerControl("AppointmentForm")
        }

        const saveReq = await ApiPost('/admin/appointment/save', formData);
        if (!saveReq.success) {
            iPrompt.MessageBoxShow("Hata", saveReq.message || "Bilinmeyen bir hata oluştu!");
            return;
        }

        iPrompt.MessageBoxShow("Başarılı", "Randevu başarılı bir şekilde oluşturuldu!");
        setCurrentCountry(0);
    }











    return (<>
        <Head>
            <title>Randevu Oluştur - Visa Appointment Engine</title>
        </Head>

        <div className="container mt-3">

            <div className="row">
                <div className="col-6">
                    <h3>Randevu Oluştur</h3>
                </div>
                <div className="col-6">
                    {/*{!ShowForm && (<button onClick={handleAddCustomer} className="btn btn-danger float-right">Müşteri Ekleme</button>)}*/}
                </div>
            </div>

            <form id="AppointmentForm" className="mt-3">

                <input type="hidden" name="key"/>

                <div className="row d-flex justify-content-center">

                    <div className="col-4">
                        <div className="form-group">
                            <h5>Başvuru Ülkesi</h5>
                            <select name="country" style={{color: '#000000'}} className="form-select form-control" value={CurrentCountry} onChange={(e) => setCurrentCountry(Number(e.target.value))}>
                                <option key="0" id={`country_0`} value="0" selected={true} disabled={true}>Başlamak için lütfen ülke seçiniz!</option>
                                {(CountryData?.length || 0) <= 0 ? (<></>) : CountryData.map(t => <option key={t.key} id={`country_${t.key}`} value={t.key}>{t.code}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="col-4">
                        <div className="form-group">
                            <h5>Randevu Tipi</h5>
                            <select name="is_vip" style={{color: '#000000'}} className="form-select form-control">
                                <option value="0">Standart Randevu</option>
                                <option value="1">Vip Randevu</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-4">
                        <div className="form-group">
                            <h5>Öncelik</h5>
                            <select name="priority" style={{color: '#000000'}} className="form-select form-control" value={CurrentPriority} onChange={(e) => setCurrentPriority(Number(e.target.value))}>
                                {(PriorityData?.length || 0) <= 0 ? (<></>) : PriorityData.map(t => <option key={t.key} id={`priority_${t.key}`} value={t.key}>{t.code}</option>)}
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

        </div>

        <iPrompt.MessageBox/>

    </>)
}