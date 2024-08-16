export class SocketDataObject {
    key: number | undefined;
    auth: string = "";
    sender: string | undefined;
    receiver: string | undefined;
    command: number = 0;
    action: number = 0;
    message: string | undefined;
    data: any;
    serviceType: number | undefined;
}