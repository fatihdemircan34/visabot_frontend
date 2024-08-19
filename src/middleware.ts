"use client"
import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'
import {ApiGet} from "@/core/webrequest/controls/webRequest.control";
import {SessionControl} from "@/core/websession/controls/session.control";
import {GetCookie} from "@/core/webcookie/controls/cookieClient.control";
import {AccountObject} from "@/objects/account.object";


export async function middleware(request: NextRequest) {

    try {

        const response = NextResponse.next();
        console.log(`Request is undefined: ${request == undefined}`)

        const sessionResponse = await ApiGet('/profile/session', GetCookie("uuid", request), GetCookie("ssid",request));
        console.log(`CheckSession => ${JSON.stringify(sessionResponse)}`);

        let user:AccountObject;
        if(sessionResponse.success){
            user = sessionResponse.data;
            SessionControl.SetUser(user, response);
        }else{
            SessionControl.Clear(response);
            if(request.nextUrl.pathname == "/")
                return response;

            const clearResponse = NextResponse.redirect(new URL('/', request.url));
            SessionControl.Clear(clearResponse);
            return clearResponse;
        }

        const perm = UserPermissionValidation(request.nextUrl.pathname, user?.role_id || -1)
        if(perm)
            return response;
        else
            throw new Error("Access denied");

    }
    catch (e: unknown) {
        if (e instanceof Error){
            console.log(e.message);
            let response = NextResponse.redirect(new URL('/app/error', request.url));
            SessionControl.SetLastError(e.message, response)
            return response;
        }
    }
}

export const config = {
    matcher: [
        {
            source: '/((?!app/auth|app/error|site|api|assets|_next/static|_next/image|favicon.ico).*)',
            has: [{ type: 'cookie', key: 'uuid' }],
            // missing: [{ type: 'header', key: 'x-missing', value: 'prefetch' }],
        }
    ]
}


export function UserPermissionValidation(path: string, role: number) {

    if(path === '/')
        return true;

    if (role == 2 && path.startsWith("/panel"))
        return true;

    return role == 1;
}

