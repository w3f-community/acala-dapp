import React, { useContext } from 'react';
import { get, template } from 'lodash';

type Language = 'zh' | 'en';

interface Options {
    language?: Language;
    feedback?: Language;
    i18n: object;
}

// promise context vaule is not empty
const context = React.createContext<Translator>({} as Translator);
const Provider = context.Provider;

class Translator {
    private language: Language;
    private feedback: Language;
    private i18n: object;

    constructor({ language, feedback = 'en', i18n }: Options) {
        this.language = language ? language : (navigator.language as Language);
        this.feedback = feedback;
        this.i18n = i18n;
        this.translate = this.translate.bind(this);
    }

    translate(name: string, options?: object): string {
        const origin = get(this.i18n, `${this.language}.${name}`) || name;
        const formatter = template(origin, { interpolate: /{{([\s\S]+?)}}/g });
        return formatter(options);
    }
}

const useTranslate = () => {
    const translator = useContext(context);
    return {
        t: translator && translator.translate,
    };
};

export { useTranslate, Translator, Provider };
