import {CustomerObject} from "@/objects/customer.object";
import React from "react";
import {ApiPost} from "@/core/webrequest/controls/webRequest.control";


interface DetailProps{
    user: CustomerObject;
    closeAction: (isRefresh: boolean) => void
}

const Detail = (props: DetailProps) => {
    const user:CustomerObject = props.user;

    async function SaveSettings(){



        // if(!resp.success){
        //     if(document.getElementById('ErrorResultLabel') != undefined)
        //         (document.getElementById('ErrorResultLabel') as HTMLSpanElement).innerHTML = "Hata Oluştu!" +( resp.message ?? "Bilinmeyen bir hata!");
        // }

        props.closeAction(true);
    }









    return (<>

        <div className="row m-3">
            <div className="col-6">
                <h4>Hesap Detayı</h4>
            </div>
        </div>

        <hr/>



        <div className="row mt-2">
            <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                <div className="form-group">
                    <label htmlFor="txtInfo">Takip Kredisi</label>

                    <input type="text" name="user_follow_credit" className="form-control" id="user_follow_credit"
                           aria-describedby="user_follow_credit" style={{color: '#000000'}} defaultValue={user?.credit_follow ?? "0"}/>

                </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                <div className="form-group">
                    <label htmlFor="txtInfo">Beğeni Kredisi</label>
                    <input type="text" name="user_like_credit" className="form-control" id="user_like_credit"
                           aria-describedby="user_like_credit" style={{color: '#000000'}} defaultValue={user?.credit_like ?? "0"}/>
                </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                <div className="form-group">
                    <label htmlFor="txtInfo">Yorum Kredisi</label>
                    <input type="text" name="user_comment_credit" className="form-control" id="user_comment_credit"
                           aria-describedby="user_comment_credit" style={{color: '#000000'}} defaultValue={user?.credit_comment ?? "0"}/>
                </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                <div className="form-group">
                    <label htmlFor="txtInfo">İzleme Kredisi</label>
                    <input type="text" name="user_watch_credit" className="form-control" id="user_watch_credit"
                           aria-describedby="user_watch_credit" style={{color: '#000000'}} defaultValue={user?.credit_watch ?? "0"}/>
                </div>
            </div>
        </div>

        <div className="row mt-2">
            <div className="col-12 col-md-6 mt-3">
                <button onClick={() => SaveSettings()} type="button" className="btn btn-danger btn-pill mr-3">Kaydet & Kapat</button>
                <button onClick={() => props.closeAction(false)} type="button" className="btn btn-secondary btn-pill">Kapat</button>
            </div>

        </div>



        <div className="row mt-5">
            <div className="col-12">
                <span id="ErrorResultLabel" style={{color: "red"}}></span>
            </div>
        </div>

    </>);
}

export default Detail;