import {GetCookie} from "@/core/webcookie/controls/cookieClient.control";
import {RequestTypeEnum} from "@/core/webrequest/enums/requestType.enum";
import {WebResponseObject} from "@/core/webrequest/objects/webResponse.object";
import {WebConfigControl} from "@/core/webconfig/controls/webConfig.control";
import router from "next/router";
import { SessionControl } from "@/core/websession/controls/session.control";

export const BackendApi = "/api/v1";

export const WebRequestControl =  async(requestType: RequestTypeEnum, path: string, payload: any = undefined, uuid: string = "", ssid: string = "", apiUrl: string = "") => {

    try {
        console.log("WebRequestControl Running...");

        if(uuid === "")
            uuid = GetCookie('uuid') ?? "";

        if(ssid === "")
            ssid = GetCookie('ssid') ?? "";        
        

        console.log("WebRequestControl Running...");
        console.log(`Request Type: ${requestType} - Path: ${path} - Payload: ${JSON.stringify(payload)} - UUID: ${uuid} - SSID: ${ssid} - ApiUrl: ${apiUrl}`);
        

        const url = apiUrl === "" ? `${WebConfigControl.ApiUrl()}${BackendApi}${path}` : `${apiUrl}${path}`;
        console.log(`WebRequestControl Url: ${url}`);
        const method = requestType === RequestTypeEnum.Post ? "POST" : "GET";
        const headers = {
            'x-uuid': uuid,
            'x-ssid': ssid,
            'Content-Type': 'application/json',
        }

        let response;
        if (requestType === RequestTypeEnum.Post) {
            response = await fetch(url, {method: method, headers: headers, body: JSON.stringify(payload)});
        }else{
            response = await fetch(url, {method: method, headers: headers});
        }

        const result: WebResponseObject = await response.json();


        if (result?.success === false && result?.message === "Unauthorized access request!") {
            console.log("Request Error: ", result.message);
            SessionControl.Clear();
            (document.getElementsByTagName('Html')[0] as HTMLElement).className = "userCheck";
            router.push('/').then((off) =>{
                // router.reload();
            });

          return new WebResponseObject();
        }
        
        return result;
    }
    catch (e) {

        console.log(`Request Error: ${e}`);

        const result = new WebResponseObject();
        result.success = false;

        if(e instanceof Error)
            result.message = e.message;
        else
            result.message = "Bir istek hatası oluştu!";


        return result;
    }
}


export const ApiPost = async(path: string, payload: any, uuid: string = "", ssid: string = "", apiUrl: string = "") => await WebRequestControl(RequestTypeEnum.Post, path, payload, uuid, ssid, apiUrl);
export const ApiGet = async(path: string, uuid: string = "", ssid: string = "", apiUrl: string = "") => {
    console.log(">>> In Api Get");
    return await WebRequestControl(RequestTypeEnum.Get, path, undefined, uuid, ssid, apiUrl);
}



