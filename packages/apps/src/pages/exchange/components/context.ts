import React from 'react';
import { ProviderData } from '@honzon-platform/apps/hooks/form';
import FixedU128 from '@honzon-platform/apps/utils/fixed_u128';

export interface FormData {
    payAsset: {
        value: number;
        error: string;
    };
    pay: {
        value: FixedU128;
        error: string;
        validator: (value: FixedU128) => string;
    };
    receiveAsset: {
        value: number;
        error: string;
    };
    receive: {
        value: FixedU128;
        error: string;
        validator: (value: FixedU128) => string;
    };
}

export const formContext = React.createContext<ProviderData<FormData>>({} as ProviderData<FormData>);
