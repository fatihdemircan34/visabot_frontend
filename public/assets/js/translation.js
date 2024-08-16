function TranslateInit() {
    if (!window.__GOOGLE_TRANSLATION_CONFIG__) {
        return;
    }

    console.log("TranslateInit");

    new google.translate.TranslateElement({
        pageLanguage: window.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage,
    });
}