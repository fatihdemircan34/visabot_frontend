import {FC, ReactElement, useState} from "react";
import {SocketDataObject} from "@/core/websocket/objects/socketData.object";

interface ConfirmProps {
    Callback: (result: boolean) => void
}

const Prompt = () =>{


    const [mboxVisible, setMboxVisible] = useState<boolean>(false);
    const [mboxTitle, setMboxTitle] = useState("");
    const [mboxMessage, setMboxMessage] = useState("");



    const [cboxVisible, setCboxVisible] = useState<boolean>(false);
    const [cboxTitle, setCboxTitle] = useState("");
    const [cboxMessage, setCboxMessage] = useState("");


    const MessageBoxShow = (title: string, message: string) =>{
        setMboxVisible(true);
        setMboxTitle(title || "");
        setMboxMessage(message || "");
    }

    const MessageBoxHide = () => setMboxVisible(false);




    const ConfirmBoxShow = (title: string, message: string) =>{
        setCboxVisible(true);
        setCboxTitle(title || "");
        setCboxMessage(message || "");
    }

    const ConfirmBoxHide = () => setCboxVisible(false);




    function MessageBox(): ReturnType<FC> {
        return (
            <div className={`${"modal"} ${mboxVisible ? "display-block" : "display-none"}`}>
                <div className="modal-main">
                    <div className="modal-head p-3">
                        <h4 style={{ color: '#000000'}}>{mboxTitle}</h4>
                    </div>
                    <div className="modal-body" style={{ fontSize: 18,  color: "gray"}}>
                        {mboxMessage}
                    </div>
                    <div className="btn-container">
                        <button type="button" className="btn btn-danger btn-block mb-3" onClick={() => setMboxVisible(false)}>Kapat</button>
                    </div>
                </div>
            </div>
        );
    }


    function ConfirmBox(props: ConfirmProps): ReturnType<FC> {
        const ConfirmBoxAnswer = (result: boolean) => {
            ConfirmBoxHide();
            props.Callback(result);
        }
        return (
            <div className={`${"modal"} ${cboxVisible ? "display-block" : "display-none"}`}>
                <div className="modal-main">
                    <div className="modal-head p-3">
                        <h6 style={{ color: '#000000'}}>{cboxTitle}</h6>
                    </div>
                    <div className="modal-body" style={{ fontSize: 18, color: "gray"}}>
                        {cboxMessage}
                    </div>
                    <div className="btn-container">
                        <button type="button" className="btn btn-success m-3" onClick={() => ConfirmBoxAnswer(true)}>Onayla</button>
                        <button type="button" className="btn btn-danger m-3" onClick={() => ConfirmBoxAnswer(false)}>Reddet</button>
                    </div>
                </div>
            </div>);
    }


    return {MessageBox, ConfirmBox, MessageBoxShow, MessageBoxHide, ConfirmBoxShow, ConfirmBoxHide}
}

export default Prompt;


