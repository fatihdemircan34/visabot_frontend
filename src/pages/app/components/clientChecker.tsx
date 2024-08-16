"use client"
import {useEffect, useState} from "react";

const ClientChecker = () =>{

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    return isMounted;
}

export default ClientChecker;