"use client";
import {DefaultEventsMap} from "@socket.io/component-emitter";
import {useEffect} from "react";
import {io, Socket} from "socket.io-client";
import {GetCookie} from "@/core/webcookie/controls/cookieClient.control";
import {SocketDataObject} from "@/core/websocket/objects/socketData.object";
import {SocketCommandEnum} from "@/core/websocket/enums/socketCommand.enum";
import {WebConfigControl} from "@/core/webconfig/controls/webConfig.control";



let socket!: Socket<DefaultEventsMap, DefaultEventsMap>;
// const uuid: string = CookieClientControl().uuid;
// const ssid: string = CookieClientControl().ssid;

export class SocketClientControls {
    private static instance: SocketClientControls;
    private io: Socket;
    private ssid: string;
    private uuid: string
    private CurrentIncomingCommand: SocketDataObject | undefined
    private Commands: SocketDataObject[] = []
    private constructor() {
        this.io = io(WebConfigControl.ApiUrl())
        this.uuid = GetCookie('uuid') || '';
        this.ssid = GetCookie('ssid') || '';
    }
    public static getInstance(): SocketClientControls {
        if (!SocketClientControls.instance) {
            SocketClientControls.instance = new SocketClientControls();
        }

        return SocketClientControls.instance;
    }

    public SocketClientControl = (callback: (data: SocketDataObject) => void) => {
        this.io.connect();

        this.io.on('connect', () => {
            console.log('Connected to the server');
        });

        this.io.on('disconnect', () => {
            console.log('Disconnected from the server');
        });

        this.io.on('connect_error', (error) => {
            console.log('Socket Connection Error:', error);
        });

        this.io.on('reconnect', (attemptNumber) => {
            console.log('Reconnected to the server. Attempt:', attemptNumber);
        });

        this.io.on('reconnect_error', (error) => {
            console.log('Reconnection error:', error);
        });

        this.io.on('reconnect_failed', () => {
            console.log('Failed to reconnect to the server');
        });

        this.io.on('error', (error) => {
            console.log('Socket Error:', error);
        });

        this.io.on('publicchannel', (data) => {
            console.log("Public => " + JSON.stringify(data));
        });

        this.io.on('clientchannel_' + this.uuid, (data: SocketDataObject) => {
            this.CurrentIncomingCommand = data;
            callback(data);
        });
    }

    public Disconnect = () => {
        this.io.disconnect();
    }

    public Send = (command: SocketCommandEnum, msg: string, data: any, commandKey: number | undefined = undefined) => {
        const sdo: SocketDataObject = new SocketDataObject();

        if(this.ssid == undefined){
            console.log("Geçersiz oturum. Komut çalıştırılamaz!")
            return;
        }

        if (commandKey)
            sdo.key = commandKey;
        else
            sdo.key = this.GenerateKey();

        sdo.auth = this.ssid;
        sdo.sender = this.uuid;
        sdo.receiver = "SERVER";
        sdo.command = command;
        sdo.message = msg;
        sdo.data = data;

        if(this.io === undefined)
            console.log("Socket kopmus!");

        this.io.emit('client', sdo);
    }

    public ServerAnswer = (commandKey: number, msg: string, data: any) => {
        this.Send(SocketCommandEnum.ProcessAnswer, msg, data, commandKey);
    }
    public ServerCommandAnswer = (socketCommand: SocketDataObject, msg: string, data: any = null) => {
        console.log("Answer command => " + JSON.stringify(socketCommand));
        if (socketCommand?.key == undefined)
            throw new Error("Command key not found!");
        this.ServerAnswer(socketCommand.key || 0, msg, data);
    }


    private GenerateKey = () => {
        let min: number = 10000000000000000;
        let max: number = 99999999999999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public FindCommand = (key: number) => this.Commands.find((cmd) => {
        return cmd.key == key
    });
    public FilterCommand = (key: number) => this.Commands.filter((cmd) => {
        return cmd.key == key
    });
}

export const SocketClientControl = (callback: (data: SocketDataObject) => void) => {

    const uuid = GetCookie('uuid');
    const ssid = GetCookie('ssid');


    if(uuid == undefined){
        console.log("Device not registered. Socket can't start!");
        return
    }

    console.log(`Socket Device Id >>> ${uuid}`);

    let CurrentIncomingCommand: SocketDataObject | undefined;
    let Commands: SocketDataObject[] = [];


    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {

        socket = io(WebConfigControl.ApiUrl());

        socket.on('connect', () => {
            console.log('Connected to the server');
        });
        socket.on('disconnect', () => {
            console.log('Disconnected from the server');
        });
        socket.on('connect_error', (error) => {
            console.log(error.message);
            // console.log(error.description);
            // console.log(error.context);
        });
        socket.on('reconnect', (attemptNumber) => {
            // console.log('Reconnected to the server. Attempt:', attemptNumber);
        });
        socket.on('reconnect_error', (error) => {
            console.log('Reconnection error:', error);
        });
        socket.on('reconnect_failed', () => {
            console.log('Failed to reconnect to the server');
        });


        socket.on('publicchannel', (data) => {
            // console.log("Public => " + JSON.stringify(data));
        });

        socket.on('clientchannel_' + uuid, (data: SocketDataObject) => {
            CurrentIncomingCommand = data;
            callback(data);
        });

        return () => {
            socket.disconnect();
        };

    }, []);


    const Send = (command: SocketCommandEnum, msg: string, data: any, commandKey: number | undefined = undefined) => {
        const sdo: SocketDataObject = new SocketDataObject();

        if(ssid == undefined){
            console.log("Geçersiz oturum. Komut çalıştırılamaz!")
            return;
        }

        if (commandKey)
            sdo.key = commandKey;
        else
            sdo.key = GenerateKey();

        sdo.auth = ssid;
        sdo.sender = uuid;
        sdo.receiver = "SERVER";
        sdo.command = command;
        sdo.message = msg;
        sdo.data = data;

        if(socket === undefined)
            console.log("Socket kopmus!");

        socket.emit('client', sdo);
    }

    const ServerAnswer = (commandKey: number, msg: string, data: any) => {
        Send(SocketCommandEnum.ProcessAnswer, msg, data, commandKey);
    }
    const ServerCommandAnswer = (socketCommand: SocketDataObject, msg: string, data: any = null) => {
        console.log("Answer command => " + JSON.stringify(socketCommand));
        if (socketCommand?.key == undefined)
            throw new Error("Command key not found!");
        ServerAnswer(socketCommand.key || 0, msg, data);
    }


    const GenerateKey = () => {
        let min: number = 10000000000000000;
        let max: number = 99999999999999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const FindCommand = (key: number) => Commands.find((cmd) => {
        return cmd.key == key
    });
    const FilterCommand = (key: number) => Commands.filter((cmd) => {
        return cmd.key == key
    });


    return {Send, ServerAnswer, ServerCommandAnswer, GenerateKey, FindCommand, FilterCommand};}

