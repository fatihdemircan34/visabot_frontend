import {GetCookie, SetCookie} from "@/core/webcookie/controls/cookieClient.control";
import type {NextRequest, NextResponse} from "next/server";
// import Cookies from "universal-cookie";
import Cookies from "js-cookie";
import {AccountObject} from "@/objects/account.object";

export class SessionControl{


    static User: () => (undefined | AccountObject) = () => {
        try {
            const session = GetCookie('session')
            if(session === undefined)
                return undefined;

            const user: AccountObject = JSON.parse(SessionControl.Decode(session));
            return user;
        }catch (e) {
            // if(e instanceof Error)
            //     console.log(`User Session Read Error => ${e.message} | ${e.stack}`)
            return undefined;
        }
    }
    





    static SetUser(user: AccountObject, response?: NextResponse){
        SetCookie("session", SessionControl.Encode(JSON.stringify(user)), response);
    }


    static Clear(response?: NextResponse){
        if(response === undefined){
            // const cookies = new Cookies();
            Cookies.remove('session');
            Cookies.remove('ssid');
            Cookies.remove('lstrr');
        }else{
            response.cookies.delete('session');
            response.cookies.delete('ssid');
            response.cookies.delete('lstrr');
        }
    }

    static LastError: () => (null | string) = () => {
        try {
            const lastError = GetCookie("lstrr");
            if(lastError === undefined)
                return null;

            const err: string = SessionControl.Decode(lastError);
            return err;
        }catch (e) {
            return null;
        }
    }
    static SetLastError(err: string, response?: NextResponse) {
        SetCookie("lstrr", SessionControl.Encode(err), response);
    }


    static Encode = (str: string) => {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode(parseInt(p1, 16))
        }))
    }

    static Decode =(str: string) => {
        return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
    }


}