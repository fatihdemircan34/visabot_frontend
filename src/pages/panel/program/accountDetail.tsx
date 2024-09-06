import React, {FC, useEffect, useState} from "react";
import Moment from "moment/moment";
import {ApiPost} from "@/core/webrequest/controls/webRequest.control";
import { Box, FormControl, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { usePromptAndElement } from "@/components/promp/prompt";
import {ProgramObject} from "@/objects/program.object";
import {ProgramAccountObject} from "@/objects/programAccount.object";
import {FormSerializerControl} from "@/core/webrequest/controls/formSerializer.control";


interface DetailProps{
    programData: ProgramObject[],
    programAccount: ProgramAccountObject|undefined,
    closeAction: (isRefresh: boolean) => void,
    messageShow: (title:string, message: string) => void
}

const AccountDetail = ({programData, programAccount, closeAction, messageShow}: DetailProps) => {


    async function Save() {
        SetInfo("Lütfen bekleyiniz...");
        const resp = await ApiPost('/admin/programaccount/save', FormSerializerControl('ProgramAccountForm'));
        SetInfo("");
        if(!resp.success){
            messageShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        messageShow("Başarılı", "Hesap kayıt edildi!");
    }


    function SetInfo(val: string){
        const lblResult = document.getElementById('lblResult');
        if(lblResult != null){
            lblResult.textContent = val;
        }
    }


    return (<>
            <form id="ProgramAccountForm" style={{display: "flex", flexDirection: "column"}}>
                <div style={{flex: 1}}>
                    <div className="row d-flex justify-content-between align-items-center text-center px-4 pt-2">
                        <h4 style={{marginBottom: 0}}>Hesap Detayı</h4>
                        <Box sx={{display: 'flex', flexDirection: {xs: 'column', md: 'row'}, alignItems: {xs: 'end', md: 'center'}, gap: {xs: 2, md: 0}}}>
                            <button onClick={() => Save()} type="button" className="btn btn-danger btn-pill float-right mr-3">Kaydet ve Kapat</button>
                            <button onClick={() => closeAction(false)} type="button" className="btn btn-secondary btn-pill float-right">Kapat</button>
                        </Box>
                    </div>

                    <hr/>

                    <div className="row">
                        <div className="col-6">
                            <div className="form-group">
                                <label>Key</label>
                                <input type="text" name="key" id="key" className="form-control" value={programAccount?.key ?? 0} readOnly={true} style={{color: '#000000'}}/>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <label className="text-black" style={{fontSize: "1rem"}}>Program</label>
                                <select name="program" style={{color: '#000000'}} className="form-select form-control">
                                    {(programData?.length || 0) <= 0 ? (<></>) : programData.map(t => <option key={t.key} id={`program_${t.key}`} value={t.key} selected={programAccount?.key == t.key}>{t.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-6">
                            <div className="form-group">
                                <label>Login</label>
                                <input type="text" name="username" id="username" defaultValue={programAccount?.username ?? ""} className="form-control" style={{color: '#000000'}}/>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <label>Şifre</label>
                                <input type="text" name="password" id="password" defaultValue={programAccount?.password ?? ""} className="form-control" style={{color: '#000000'}}/>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-6">
                            <div className="form-group">
                                <label>EPosta</label>
                                <input type="text" name="email" id="email" defaultValue={programAccount?.email ?? ""} className="form-control" style={{color: '#000000'}}/>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-2 ml-3">
                        <div className="col-12">
                            <label id="lblResult" style={{fontSize: 15, color: '#880000'}}></label>
                        </div>
                    </div>
                </div>
            </form>
        </>);
}

export default AccountDetail;