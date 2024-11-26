import enTranslation from "./en.json"
export const t = (label) => {
    // const langData = store.getState().CurrentLanguage?.language?.file_name && store.getState().CurrentLanguage?.language?.file_name[label];

    // if (langData) {

    //     return langData;
    // } else {
    return enTranslation[label];
    // }
};