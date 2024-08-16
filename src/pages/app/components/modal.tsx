import {FC, ReactElement, useState} from "react";

interface ModalProps {
    children: ReactElement;
}

const Modal = () => {

    const [mboxVisible, setMboxVisible] = useState<boolean>(false);
    const [mboxTitle, setMboxTitle] = useState("");

    const Show = (title: string | undefined) => {
        setMboxTitle(title || "");
        setMboxVisible(true);
    };
    const Hide = () => setMboxVisible(false);


    function ModalBox(props: ModalProps): ReturnType<FC> {
        return (
            <div className={`${"modal"} ${mboxVisible ? "display-block" : "display-none"}`}>
                <div className="modal-main">
                    <div className="h6 mt-4">
                        <h5 style={{ color: '#000000'}}>{mboxTitle}</h5>
                    </div>
                    <div className="modal-body">
                        {props.children}
                    </div>
                    {/*<div className="btn-container mb-4">*/}
                    {/*    <button type="button" className="btn btn-secondary btn-sm" onClick={() => Hide()}>Kapat</button>*/}
                    {/*</div>*/}
                </div>
            </div>
        );
    }

    return {ModalBox, Show, Hide}
}

export default Modal;