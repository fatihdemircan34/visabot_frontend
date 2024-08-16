import {WebConfigControl} from "@/core/webconfig/controls/webConfig.control";
import {WebResponseObject} from "@/core/webrequest/objects/webResponse.object";
import {GetCookie, SetCookie} from "@/core/webcookie/controls/cookieClient.control";
import Cookies from "universal-cookie";
import {ApiGet} from "@/core/webrequest/controls/webRequest.control";

export class WebDeviceControl{
    static async DeviceRegister(){
        try{
            // const cookies = new Cookies();
            const uuidSet = GetCookie('uuid-set');
            if(uuidSet != undefined){
                const diff = WebDeviceControl.GetDiffSecondsByNow(parseInt(uuidSet));
                if(diff < 3)
                    return;
            }

            SetCookie('uuid-set', Date.now().toString());
            const uuid = GetCookie('uuid');
            if(uuid == undefined || uuid == ""){
                const url = `${WebConfigControl.ApiUrl()}/waf/deviceregister`;
                console.log(`DeviceRegisterUrl >>> ${url}`);
                const response = await fetch(url, {method: 'GET', headers: {'Content-Type': 'application/json'}});
                const result: WebResponseObject = await response.json();
                if(result.success)
                    SetCookie('uuid', result.data);
            }
        }
        catch (e) {}
    }

    static async VisitorStats(){

        const cookies = new Cookies();
        const vset = cookies.get('visitor-set');
        if(vset != undefined){
            const diff = WebDeviceControl.GetDiffSecondsByNow(parseInt(vset));
            if(diff < 3)
                return;
        }
        cookies.set('visitor-set', Date.now(), {path: '/'});
        await ApiGet('/visitor');
    }

    static GetDiffSecondsByNow(milliseconds: number){
        const firstDate: Date = new Date(milliseconds);
        const secondDate: Date = new Date();
        const milliDiff: number = firstDate.getTime() - secondDate.getTime();
        return Math.floor(milliDiff / 1000);
    }
}