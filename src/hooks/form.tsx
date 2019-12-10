import React, { Context, useContext, useState, ReactNode } from 'react';
import { set, map } from 'lodash';

type Error = string;

interface FormDataItem {
    value: any;
    error?: Error;
    validator?: (value: any) => Error; // return '' when no erros
}

export interface FormData {
    [k: string]: FormDataItem;
}

interface StringMap {
    [k: string]: any;
}

export const useForm = (context: Context<ProviderData>): ProviderData => {
    const result = useContext<ProviderData>(context);
    return result;
};

interface ProviderProps {
    context: Context<ProviderData>;
    data: FormData;
    children: ReactNode;
}

export interface ProviderData {
    data: FormData;
    setValue: (key: string, value: any) => void;
    setError: (key: string, error: any) => void;
    clearError: (key: string) => void;
}

export const Provider: React.FC<ProviderProps> = ({ context, data, children }) => {
    const _inner = Object.assign({}, data);

    const [value, setValue] = useState<FormData>(_inner);

    const contextValue: ProviderData = {
        data: value,
        setValue: (key: string, value: any) => {
            setValue(Object.assign({}, set(data, [key, 'value'], value)));
        },
        setError: (key: string, error: any) => {
            setValue(Object.assign({}, set(data, [key, 'error'], error)));
        },
        clearError: (key: string) => {
            setValue(Object.assign({}, set(data, [key, 'error'], '')));
        }
    };

    return <context.Provider value={contextValue}>{children}</context.Provider>;
};
