import Head from "next/head";
import React, {useEffect, useState} from "react";
import {SocketClientControl} from "@/core/websocket/controls/socketClient.control";
import {SocketActionsEnum} from "@/core/websocket/enums/socketActions.enum";
import {LogInterface} from "@/objects/log.interface";
import { CountryEnum } from "@/enums/country.enum";
import {LogTypesEnum} from "@/enums/logTypes.enum";
import {LogSourceTypesEnum} from "@/enums/logSourceTypes.enum";

export default function LiveLogs(){

    const SocketClient = SocketClientControl(async (socketData) => {
        console.log(`Socket Data: ${JSON.stringify(socketData.data)}`);
        if(socketData.action == SocketActionsEnum.LiveLog){
            AppendToConsole(socketData.data);
        }
    });


    function LogTypeName(logType: number): string | undefined {
        return Object.keys(LogTypesEnum).find(key => LogTypesEnum[key as keyof typeof LogTypesEnum] === logType);
    }

    function SourceTypeName(logSourceType: number): string | undefined {
        return Object.keys(LogSourceTypesEnum).find(key => LogSourceTypesEnum[key as keyof typeof LogSourceTypesEnum] === logSourceType);
    }


    function AppendToConsole(item: LogInterface) {
        const consoleElement = document.getElementById("ConsoleArea");
        if (!consoleElement) return;

        const newLine = document.createElement("div");



        const spanSourceType = document.createElement("span");
        spanSourceType.style.color = "#e74c3c";
        spanSourceType.textContent = SourceTypeName(item.SourceType) ?? "";
        newLine.appendChild(spanSourceType);
        newLine.appendChild(document.createTextNode(" | "));

        const spanLogType = document.createElement("span");
        spanLogType.style.color = "#e74c3c";
        spanLogType.textContent = LogTypeName(item.LogType) ?? "";
        newLine.appendChild(spanLogType);
        newLine.appendChild(document.createTextNode(" | "));

        const spanSourceName = document.createElement("span");
        spanSourceName.style.color = "#2ecc71";
        spanSourceName.textContent = item.SourceName ?? "";
        newLine.appendChild(spanSourceName);
        newLine.appendChild(document.createTextNode(" > "));

        const spanTimeInfo = document.createElement("span");
        spanTimeInfo.style.color = "#f1c40f";
        spanTimeInfo.textContent = item.TimeInfo ?? "";
        newLine.appendChild(spanTimeInfo);
        newLine.appendChild(document.createTextNode(" >>> "));

        const spanLog = document.createElement("span");
        spanLog.style.color = "#ffffff";
        spanLog.textContent = item.Log ?? "";
        newLine.appendChild(spanLog);

        consoleElement.appendChild(newLine);
        consoleElement.scrollTop = consoleElement.scrollHeight;
    }



    return (<>

        <Head>
            <title>LiveLogs - VisaAppointment</title>
        </Head>

        <div className="m-3">
            <div className="row">
                <div className="col-6">
                    <h3>LiveLogs</h3>
                </div>
            </div>
            <br></br>
            <div className="row">
                <div className="col-12">
                    <code id="ConsoleArea" style={{
                        display: "block",
                        width: "100%",
                        height: "700px",
                        backgroundColor: "#1e1e1e",
                        fontFamily: "\"Courier New\", Courier, monospace",
                        padding: 10,
                        overflowY: "auto",
                        whiteSpace: "pre-wrap",
                        borderRadius: 5,
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)"
                    }}></code>
                </div>
            </div>
        </div>


    </>)
}