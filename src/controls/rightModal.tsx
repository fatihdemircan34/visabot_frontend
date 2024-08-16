import {FC, ReactDOM, ReactElement} from "react";
import { createRoot } from 'react-dom/client';

export default class RightModal {
    Open(ModalContent: React.JSX.Element) {
        const formRightModalElement = document.getElementById("FormRightModalContent");
        if (formRightModalElement != undefined) {
            const root = createRoot(formRightModalElement);
            root.render(ModalContent);
            (document.getElementById("FormRightModal") as HTMLDivElement).style.display = "block";
        }
    }

    Close(){
        if(document.getElementById("FormRightModal") != undefined)
            (document.getElementById("FormRightModal") as HTMLDivElement).style.display = "none";
    }

    Render = (): ReturnType<FC> => {
        return <div id="FormRightModal" className="right-modal" style={{ zIndex: 99999, width: '100vw' }}>
            <div className="right-modal-back" onClick={() => this.Close()} />
            <div className="right-modal-content">
                <div id="FormRightModalContent" className="right-modal-body" style={{ overflow: 'auto', maxHeight: '100vh' }}>

                </div>
            </div>
        </div>
    }
}