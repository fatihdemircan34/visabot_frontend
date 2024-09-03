import { useState } from "react";

export const useModal = () => {
    const [mboxVisible, setMboxVisible] = useState<boolean>(false);
    const [mboxTitle, setMboxTitle] = useState("");

    const Show = (title: string | undefined) => {
        setMboxTitle(title || "");
        setMboxVisible(true);
    };

    const Hide = () => setMboxVisible(false);

    return { mboxVisible, mboxTitle, Show, Hide };
};
