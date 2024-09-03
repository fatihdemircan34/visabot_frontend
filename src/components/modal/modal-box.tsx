import { FC, ReactElement } from "react";

interface ModalProps {
    children: ReactElement;
}

interface ModalBoxProps extends ModalProps {
    mboxVisible: boolean;
    mboxTitle: string;
    Hide: () => void;
}

const ModalBox: FC<ModalBoxProps> = ({ children, mboxVisible, mboxTitle, Hide }) => {
    return (
        <div className={`modal ${mboxVisible ? "display-block" : "display-none"}`}>
            <div className="modal-main">
                <div className="modal-head p-3">
                    <h4 style={{ color: "#000000" }}>{mboxTitle}</h4>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="btn-container mb-4">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={Hide}>Kapat</button>
                </div>
            </div>
        </div>
    );
};

export default ModalBox;
