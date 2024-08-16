import {LineChart} from "@mui/x-charts/LineChart";
import * as React from "react";


export interface CountProps{
    Count: any,
    Title: string
}

export default function CountCard(prop: CountProps) {

    return (<div className="card p-3 mb-2">
            <div className="d-flex justify-content-between">
                <div className="d-flex flex-row align-items-center">
                    <div className="c-details">
                        <h6 className="mb-0">{prop.Title}</h6>
                    </div>
                </div>
            </div>
            <div className="mt-1">
                <h3 className="heading">{prop.Count}</h3>
            </div>
        </div>);
}