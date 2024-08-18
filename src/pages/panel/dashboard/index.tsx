import React, { FC, useEffect, useState } from 'react';
import Prompt from '@/pages/app/components/prompt';
import CountCard from './components/countCard';

export default function AdminDashboard(): ReturnType<FC> {
  const iPrompt = Prompt();


  return (
    <>
        <div className="m-5">

            <div className="row">
                <div className="col-12">
                    <h6 className="text-xl text-[#414b5d]">Sistem Verisi</h6>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                    <CountCard Title="Toplam Müşteri" Count={"0"}/>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                    <CountCard Title="Yeni" Count={'0'}/>
                </div>
                <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                    <CountCard Title="Kuyrukta" Count={'0'}/>
                </div>
                <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                    <CountCard Title="İşlemde" Count={'0'}/>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                    <CountCard Title="Başarılı Toplam" Count={'0'}/>
                </div>
                <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                    <CountCard Title="Hatalı Toplam" Count={'0'}/>
                </div>
                <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                    <CountCard Title="İptal Toplam" Count={'0'}/>
                </div>
            </div>


        </div>

        <iPrompt.MessageBox/>
    </>);
}
