import { useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import {GetCookie, SetCookie} from "@/core/webcookie/controls/cookieClient.control";
import "/node_modules/flag-icons/css/flag-icons.min.css";


export const COOKIE_NAME = "googtrans";


interface LanguageDescriptor {
    name: string;
    title: string;
}


declare global {
    namespace globalThis {
        var __GOOGLE_TRANSLATION_CONFIG__: {
            languages: LanguageDescriptor[];
            defaultLanguage: string;
        };
    }
}

const LanguageSwitcher = () => {
    const [currentLanguage, setCurrentLanguage] = useState<string>();
    const [languageConfig, setLanguageConfig] = useState<any>();


    useEffect(() => {

        // const cookies = parseCookies()
        const existingLanguageCookieValue = GetCookie(COOKIE_NAME);


        console.log(`existingLanguageCookieValue >>> ${existingLanguageCookieValue}`);


        let languageValue;
        if (existingLanguageCookieValue) {

            const sp = existingLanguageCookieValue.split("/");
            if (sp.length > 2) {
                languageValue = sp[2];
            }
        }

        if (global.__GOOGLE_TRANSLATION_CONFIG__ && !languageValue) {
            languageValue = global.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage;
        }
        if (languageValue) {

            setCurrentLanguage(languageValue);
        }

        if (global.__GOOGLE_TRANSLATION_CONFIG__) {
            setLanguageConfig(global.__GOOGLE_TRANSLATION_CONFIG__);
        }
    }, []);


    if (!currentLanguage || !languageConfig) {
        return null;
    }


    const switchLanguage = (lang: string) => () => {
        if(document.getElementById(':0.container') != undefined){
            const iframe = (document.getElementById(":0.container") as HTMLIFrameElement);
            const clsBtn = (iframe?.contentWindow?.document.getElementById(":0.close") as HTMLLinkElement);
            clsBtn?.click();
        }
        const cookieVal = "/auto/" + lang
        SetCookie(COOKIE_NAME, cookieVal)
        window.location.reload();
    };


    function getFlag(country: string){
        switch (country.toLowerCase()) {
            case 'english':
                return <span className="dropdown-item-icon fi fi-gb-eng"></span>
            case 'deutsch':
                return <span className="dropdown-item-icon fi fi-de"></span>
            case 'español':
                return <span className="dropdown-item-icon fi fi-es"></span>
            case 'türkçe':
                return <span className="dropdown-item-icon fi fi-tr"></span>
            default:
                return <i className={`dropdown-item-icon mdi mdi-mdi`}></i>
        }
    }

    return (<li key="TopLangSelection" className="nav-item dropdown">
        <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
            {languageConfig.languages.map((ld: LanguageDescriptor, i: number) => (
                <>
                    {
                        currentLanguage === ld.name || (currentLanguage === "auto" && languageConfig.defaultLanguage === ld) ?
                        ld.title : ""
                    }
                </>
            ))}
        </a>
        <div className="dropdown-menu dropdown-menu-right">
            {
                languageConfig.languages.map((ld: LanguageDescriptor, i: number) => (
                <>
                    {
                        currentLanguage === ld.name || (currentLanguage === "auto" && languageConfig.defaultLanguage === ld) ?
                        "" :
                        (<a key={`l_s_${ld}`} onClick={switchLanguage(ld.name)} href="#" className="dropdown-item dropdown-item-lang">
                            {getFlag(ld.title)}
                            {ld.title}
                        </a>)
                    }
                </>))
            }
        </div>
    </li>)
};

export default LanguageSwitcher;