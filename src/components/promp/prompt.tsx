import { FC } from "react";
import { usePrompt } from "./usePrompt";

interface ConfirmProps {
    Callback: (result: boolean) => void;
}

interface PromptProps {
    mboxVisible: boolean;
    mboxTitle: string;
    mboxMessage: string;
    cboxVisible: boolean;
    cboxTitle: string;
    cboxMessage: string;
    masonryVisible: boolean;
    masonryItems: string[];
    masonryTitle: string;
    MessageBoxHide: () => void;
    ConfirmBoxHide: () => void;
    MasonryBoxHide: () => void;
    confirmCallback: (result: boolean) => void;
}

const Prompt: FC<PromptProps> = ({
    mboxVisible,
    mboxTitle,
    mboxMessage,
    cboxVisible,
    cboxTitle,
    cboxMessage,
    masonryVisible,
    masonryItems,
    masonryTitle,
    MessageBoxHide,
    ConfirmBoxHide,
    MasonryBoxHide,
    confirmCallback,
}) => {

    const MessageBox: FC = () => (
        <div className={`modal ${mboxVisible ? "d-flex" : "display-none"}`}>
            <div className="modal-main">
                <div className="modal-head p-3">
                    <h4 style={{ color: "#000000" }}>{mboxTitle}</h4>
                </div>
                <div className="modal-body" style={{ fontSize: 18, color: "gray" }}>
                    {mboxMessage}
                </div>
                <div className="btn-container">
                    <button type="button" className="btn btn-danger btn-block mt-3" onClick={MessageBoxHide}>
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );

    const ConfirmBox: FC<ConfirmProps> = ({ Callback }) => {
        const ConfirmBoxAnswer = (result: boolean) => {
            ConfirmBoxHide();
            Callback(result);
        };
        return (
            <div className={`modal ${cboxVisible ? "d-flex" : "display-none"}`}>
                <div className="modal-main">
                    <div className="modal-head p-3">
                        <h6 style={{ color: "#000000" }}>{cboxTitle}</h6>
                    </div>
                    <div className="modal-body" style={{ fontSize: 18, color: "gray" }}>
                        {cboxMessage}
                    </div>
                    <div className="btn-container">
                        <button type="button" className="btn btn-success m-3" onClick={() => ConfirmBoxAnswer(true)}>
                            Onayla
                        </button>
                        <button type="button" className="btn btn-danger m-3" onClick={() => ConfirmBoxAnswer(false)}>
                            Reddet
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const MasonryBox: FC = () => (
        <div className={`modal ${masonryVisible ? "d-flex" : "display-none"}`}>
            <div className="modal-main">
                <div className="modal-head p-3">
                    <h6 style={{ color: "#000000" }}>{masonryTitle}</h6>
                </div>
                <div className="modal-body">
                    <div className="d-flex flex-wrap" style={{ gap: "1rem" }}>
                        {masonryItems?.map((item, index) => (
                            <div key={index} className="bg-primary text-white rounded-lg py-1 px-2">
                                @user-{item}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="btn-container">
                    <button type="button" className="btn btn-danger m-3" onClick={MasonryBoxHide}>
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <MessageBox />
            <ConfirmBox Callback={confirmCallback} />
            <MasonryBox />
        </>
    );
};

export default Prompt;

export const usePromptAndElement = () => {
    const prompt = usePrompt();

    const PromptElement: FC<{ confirmCallback: (result: boolean) => void }> = ({ confirmCallback }) => (
        <Prompt
            confirmCallback={confirmCallback}
            mboxVisible={prompt.mboxVisible}
            mboxTitle={prompt.mboxTitle}
            mboxMessage={prompt.mboxMessage}
            cboxVisible={prompt.cboxVisible}
            cboxTitle={prompt.cboxTitle}
            cboxMessage={prompt.cboxMessage}
            masonryVisible={prompt.masonryVisible}
            masonryItems={prompt.masonryItems}
            masonryTitle={prompt.masonryTitle}
            MessageBoxHide={prompt.MessageBoxHide}
            ConfirmBoxHide={prompt.ConfirmBoxHide}
            MasonryBoxHide={prompt.MasonryBoxHide}
        />
    );

    return { PromptElement, ...prompt };
};
