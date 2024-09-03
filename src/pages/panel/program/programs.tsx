import Head from "next/head";
import React, {FormEvent, useEffect, useState} from "react";
import {ApiGet, ApiPost} from "@/core/webrequest/controls/webRequest.control";
import Prompt from "@/pages/app/components/prompt";
import {FormSerializerControl} from "@/core/webrequest/controls/formSerializer.control";
import { ProgramObject } from "@/objects/program.object";


let ProgramListData: ProgramObject[];
let CurrentKey: number;


export default function Program() {


    const iPrompt = Prompt();

    const [ProgramData, setProgramData] = useState<ProgramObject[]>([]);

    useEffect(() => {
        GetPrograms();
    }, []);



    const GetPrograms = async () => {
        let queryParams = {
            programType: 1
        }
        const proxiesReq = await ApiGet('/admin/program/list');
        if (!proxiesReq.success) {
            iPrompt.MessageBoxShow("Hata", proxiesReq.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        ProgramListData = proxiesReq.data
        console.log(ProgramListData)
        setProgramData(ProgramListData);
    }

    const SaveProgram = async () => {

        console.log(FormSerializerControl("ProgramForm"))

        const saveReq = await ApiPost('/admin/program/save', FormSerializerControl("ProgramForm"));
        if (!saveReq.success) {
            iPrompt.MessageBoxShow("Hata", saveReq.message || "Bilinmeyen bir hata oluştu!");
            return;
        }

        await GetPrograms();
        ClearProgram();

        iPrompt.MessageBoxShow("Başarılı", "Kayıt işlemi başarılı!");
    }

    function DeleteProgramRequest(programId: number){
        CurrentKey = programId;
        iPrompt.ConfirmBoxShow("Program Silme","Program bilgisi sistemden silinecektir. Onaylıyor musunuz?");
    }

    const DeleteProgram = async (isOkay: boolean) => {
        if(!isOkay)
            return;

        const deleteReq = await ApiPost('/admin/program/delete', {key: CurrentKey});
        if(!deleteReq.success){
            iPrompt.MessageBoxShow("Hata", deleteReq.message || "Bilinmeyen bir hata oluştu!");
            return;
        }

        await GetPrograms();
        ClearProgram();
    }

    const SelectProgram = (program: ProgramObject) => {
        (document.getElementById('key') as HTMLInputElement).value = program.key.toString();
        (document.getElementById('name') as HTMLInputElement).value = program.name;
        (document.getElementById('login_link') as HTMLInputElement).value = program.login_link;
        (document.getElementById('process_link') as HTMLInputElement).value = program.process_link;
    }


    function ClearProgram(){
        (document.getElementById('key') as HTMLInputElement).value = "0";
        (document.getElementById('name') as HTMLInputElement).value = "";
        (document.getElementById('login_link') as HTMLInputElement).value = "";
        (document.getElementById('process_link') as HTMLInputElement).value = "";

    }


    function ProgramItem(item: ProgramObject) {
        return (<>
            <tr key={item.key}>
                <td>{item.key}</td>
                <td>{item.name}</td>
                <td><div style={{wordBreak: "break-all", overflowWrap: "break-word"}}>{item.login_link}</div></td>
                <td><div style={{wordBreak: "break-all", overflowWrap: "break-word"}}>{item.process_link}</div></td>
                <td>
                    <button className="btn btn-sm btn-pill btn-danger mr-2" style={{paddingTop: 4, paddingBottom: 4}} onClick={() => DeleteProgramRequest(item.key)}>Sil</button>
                    <button className="btn btn-sm btn-pill btn-success" style={{paddingTop: 4, paddingBottom: 4}} onClick={() => SelectProgram(item)}>Düzenle</button>
                </td>
            </tr>
        </>);
    }


    return (<>
        <Head>
            <title>Program Tanımları - Visa Appointment Engine</title>
        </Head>

        <div className="container mt-3">

            <div className="row">
                <div className="col-12">
                    <h3>Program Tanımları</h3>
                </div>
            </div>

            <form id="ProgramForm">

                <div className="row">
                    <div className="col-4">
                        <div className="form-group">
                            <label>Program Key</label>
                            <input type="number" name="key" id="key" className="form-control" value="0" readOnly={true} style={{color: '#000000'}}/>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="form-group">
                            <label>Program Adı</label>
                            <input type="text" name="name" id="name" className="form-control" style={{color: '#000000'}}/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-8">
                        <div className="form-group">
                            <label>Login Link</label>
                            <input type="text" name="login_link" id="login_link" className="form-control" style={{color: '#000000'}}/>
                        </div>
                    </div>
                    <div className="col-8">
                        <div className="form-group">
                            <label>Process Link</label>
                            <input type="text" name="process_link" id="process_link" className="form-control" style={{color: '#000000'}}/>
                        </div>
                    </div>
                    <div className="col-12">
                        <button type="button" className="btn btn-danger btn-pill" onClick={() => SaveProgram()}>Kaydet</button>
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
                    <h5>Program Listesi</h5>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-sm">
                    <thead>
                    <tr>
                        <th>
                            Key
                        </th>
                        <th>
                            Program
                        </th>
                        <th>
                            Login Link
                        </th>
                        <th>
                            Process Link
                        </th>
                        <th style={{width: 200}}>
                            İşlemler
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {(ProgramData !== null && ProgramData.length || 0) <= 0 ? (<tr><td className="text-center" colSpan={4}>Henüz veri girilmedi.</td></tr>) : ProgramData.map(t => ProgramItem(t))}
                    </tbody>
                </table>
            </div>
        </div>

        <iPrompt.MessageBox/>
        <iPrompt.ConfirmBox Callback={(res) => DeleteProgram(res)}/>

    </>)
}