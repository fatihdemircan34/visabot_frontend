import {GetCookie} from "@/core/webcookie/controls/cookieClient.control";
import {RequestTypeEnum} from "@/core/webrequest/enums/requestType.enum";
import {WebResponseObject} from "@/core/webrequest/objects/webResponse.object";
import {WebConfigControl} from "@/core/webconfig/controls/webConfig.control";

const BackendApi = "/api/v1";

export const WebRequestControl =  async(requestType: RequestTypeEnum, path: string, payload: any = undefined, uuid: string = "", ssid: string = "") => {

    try {
        if(uuid === "")
            uuid = GetCookie('uuid') ?? "";

        if(ssid === "")
            ssid = GetCookie('ssid') ?? "";


        const url = `${WebConfigControl.ApiUrl()}${BackendApi}${path}`;
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
        return result;
    }
    catch (e) {
        const result = new WebResponseObject();
        result.success = false;

        if(e instanceof Error)
            result.message = e.message;
        else
            result.message = "Bir istek hatası oluştu!";


        return result;
    }
}


export const ApiPost = async(path: string, payload: any, uuid: string = "", ssid: string = "") => await WebRequestControl(RequestTypeEnum.Post, path, payload, uuid, ssid);
export const ApiGet = async(path: string, uuid: string = "", ssid: string = "") => await WebRequestControl(RequestTypeEnum.Get, path, undefined, uuid, ssid);