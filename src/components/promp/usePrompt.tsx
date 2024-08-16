import { useState } from "react";

export const usePrompt = () => {
    const [mboxVisible, setMboxVisible] = useState<boolean>(false);
    const [mboxTitle, setMboxTitle] = useState("");
    const [mboxMessage, setMboxMessage] = useState("");

    const [cboxVisible, setCboxVisible] = useState<boolean>(false);
    const [cboxTitle, setCboxTitle] = useState("");
    const [cboxMessage, setCboxMessage] = useState("");

    const [masonryVisible, setMasonryVisible] = useState<boolean>(false);
    const [masonryItems, setMasonryItems] = useState<string[]>([]);
    const [masonryTitle, setMasonryTitle] = useState("");

    const setBodyHeightForModals = () => {
        document.body.style.overflow = "hidden";
    };

    const resetBodyHeightForModals = () => {
        document.body.style.overflow = "auto";
    };

    const MessageBoxShow = (title: string, message: string) => {
        setBodyHeightForModals();
        setMboxVisible(true);
        setMboxTitle(title || "");
        setMboxMessage(message || "");
    };

    const MessageBoxHide = () => {
        setMboxVisible(false);
        resetBodyHeightForModals();
    };

    const ConfirmBoxShow = (title: string, message: string) => {
        setBodyHeightForModals();
        setCboxVisible(true);
        setCboxTitle(title || "");
        setCboxMessage(message || "");
    };

    const ConfirmBoxHide = () => {
        resetBodyHeightForModals();
        setCboxVisible(false)
    };

    const MasonryBoxShow = (items: string[], title: string) => {
        setBodyHeightForModals();
        setMasonryVisible(true);
        setMasonryItems(items || []);
        setMasonryTitle(title || "");
    };

    const MasonryBoxHide = () => {
        setMasonryVisible(false);
        resetBodyHeightForModals();
    };

    return {
        mboxVisible,
        mboxTitle,
        mboxMessage,
        cboxVisible,
        cboxTitle,
        cboxMessage,
        masonryVisible,
        masonryItems,
        masonryTitle,
        MessageBoxShow,
        MessageBoxHide,
        ConfirmBoxShow,
        ConfirmBoxHide,
        MasonryBoxShow,
        MasonryBoxHide,
    };
};
