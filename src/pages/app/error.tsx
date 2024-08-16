import Head from "next/head";
import React from "react";
import {SessionControl} from "@/core/websession/controls/session.control";

export default function Error(){
    return (

        <>

            <Head>
                <title>Hata - Visa Appointment Engine</title>
            </Head>

            <header className="miri-ui-kit-header landing-header header-bg-2">
                <div
                    className="miri-ui-kit-header-content text-center text-white d-flex flex-column justify-content-center align-items-center">
                    <p className="h3 font-weight-light text-black">
                        &nbsp;
                    </p>
                    <p className="h3 font-weight-light text-black">
                        <span className="display-4 text-danger">VISA</span><span
                        className="display-4 text-black">Appointment Engine.</span>
                    </p>


                    <p className="mt-4 text-danger h5 login-desc">
                        Yapmak istediğiniz işlem sırasında bir hata oluştu.
                    </p>
                    <p className="h3 font-weight-light text-black">
                        &nbsp;
                    </p>
                    <div className="card login-card">
                        <div className="card-body">
                            <h3 className="text-center text-white font-weight-light mb-4">Hata</h3>
                            <p>
                                {SessionControl.LastError()}
                            </p>

                        </div>
                    </div>
                </div>
            </header>


        </>

    );
}