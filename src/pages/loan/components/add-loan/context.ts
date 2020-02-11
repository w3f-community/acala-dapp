import React from 'react';
import { ProviderData } from '@/hooks/form';

export interface FormData {
    asset: {
        value: number;
    };
    collateral: {
        value: number;
    };
    borrow: {
        value: number;
    };
    agree: {
        value: number;
    };
}

export const formContext = React.createContext<ProviderData<FormData>>({} as ProviderData<FormData>);
