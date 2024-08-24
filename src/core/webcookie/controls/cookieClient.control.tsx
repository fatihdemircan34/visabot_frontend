'use client'
import type {NextRequest, NextResponse} from "next/server";


export function SetCookie(name:string, value: string, response?: NextResponse){
    
    if(response == undefined){
        SetDocCookie(name, value);
    }
    else{
        response.cookies.set(name, value);
    }
}


export function GetCookie(name:string, request?: NextRequest) {
    if (request == undefined) {
        return GetDocCookie(name);
    }else{
        return request?.cookies?.get(name)?.value ?? "";
    }
}




function GetDocCookie(name: string): string {
    console.log(`>>>> GetDocCookie: ${name}`);
    if (typeof document === 'undefined')
    {
        console.log("Document is undefined!");
        return "";
    }
    else
        console.log("Document is defined....");

    const matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : "";
}







interface CookieOptions {
    path?: string;
    expires?: Date | string | number;
    [key: string]: any;
}

function SetDocCookie(name: string, value: string, options: CookieOptions = {}): void {
    console.log('Active domain: ', document.location, );
    
    console.log(`>>>> SetDocCookie: ${name}/${value}`);
    if (typeof document === 'undefined')
    {
        console.log("Document is undefined!");
        return;
    }
    else
        console.log("Document is defined....");


    options = {
        path: '/',
        // eğer istersek başka varsayılanları da buraya ekleyebiliriz
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    console.log("BEFORE: ", document.cookie);
    
    document.cookie = updatedCookie;

    console.log("AFTER: ", document.cookie);
}
