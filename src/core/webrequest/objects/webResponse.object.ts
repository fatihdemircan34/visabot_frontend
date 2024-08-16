export class WebResponseObject {
    success?:boolean;
    message?:string;
    code?:string;
    data:any;

    constructor(success?: boolean, message?: string, code?: string, data: any = null) {
        this.success = success;
        this.message = message;
        this.code = code;
        this.data = data;
    }
}