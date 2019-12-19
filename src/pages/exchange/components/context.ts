import React from 'react';
import { ProviderData } from '@/hooks/form';
import FixedU128 from '@/utils/fixed_u128';

export interface FormData {
    payAsset: {
        value: number;
    };
    pay: {
        value: FixedU128;
    };
    receiveAsset: {
        value: number;
    };
    receive: {
        value: FixedU128;
    };
}

export const formContext = React.createContext<ProviderData<FormData>>({} as ProviderData<FormData>);
