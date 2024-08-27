import { LogSourceTypesEnum } from "@/enums/logSourceTypes.enum";
import { LogTypesEnum } from "@/enums/logTypes.enum";

export interface LogInterface{
    SourceType: LogSourceTypesEnum;
    SourceName: string;
    LogType: LogTypesEnum;
    Log: string;
    TimeInfo: string;
}