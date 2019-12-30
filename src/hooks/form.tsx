import React, { Context, useContext, useState, ReactNode } from 'react';
import { set, get } from 'lodash';

type Error = string;

interface FormDataItem {
    value: any;
    error?: Error;
    validator?: (value: any) => Error; // return '' when no erros
}

interface FormData {
    [k: string]: FormDataItem;
}

interface ProviderProps {
    context: Context<ProviderData<any>>;
    data: FormData;
    children: ReactNode;
}

type Combine<Origin, Base> = {
    [T in keyof Origin]: Base & Origin[T];
};

export type ProviderData<T> = {
    data: Combine<T, FormData>;
    setValue: (key: keyof T, value: any) => void;
    setError: (key: keyof T, error: string) => void;
    clearError: (key: keyof T) => void;
    checkVerify: (callback: () => void) => boolean;
};

export const Form: React.FC<ProviderProps> = React.memo(({ context, data, children }) => {
    data = Object.assign({}, data);

    type CombinedFormData = Combine<typeof data, FormData>;

    const [value, setValue] = useState<CombinedFormData>(data as CombinedFormData);

    const contextValue: ProviderData<CombinedFormData> = {
        data: value,
        setValue: (key: keyof CombinedFormData, value: any) => {
            const result = set(data, [key, 'value'], value);
            setValue({ ...result } as CombinedFormData);
        },
        setError: (key: keyof CombinedFormData, error: string) => {
            setValue(Object.assign({}, set(data as object, [key, 'error'], error)));
        },
        clearError: (key: keyof CombinedFormData) => {
            setValue(Object.assign({}, set(data as object, [key, 'error'], '')));
        },
        checkVerify: callback => {
            let result = true;
            Object.keys(data).forEach(key => {
                const validator = get(data as object, [key, 'validator']);
                const value = get(data as object, [key, 'value']);

                if (validator) {
                    contextValue.setError(key, validator(value));
                }
                const error = get(data as object, [key, 'error']);
                result = result && !error;
            });
            if (result) {
                callback();
            }
            return result;
        },
    };

    return <context.Provider value={contextValue}>{children}</context.Provider>;
});

export function useForm<T>(context: Context<ProviderData<T>>): ProviderData<T> {
    return useContext<ProviderData<T>>(context);
}
