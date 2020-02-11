import React, { FC, ReactNode, createContext, useContext } from 'react';
import AcalaMandalaLogo from '@/assets/acala-mandala-logo.svg';
import { useLocation } from 'react-router';
import queryString from 'query-string';

interface Environment {
    endpoint: string;
    logo: string;
    polkascanPrefix: string;
}

const Context = createContext<Environment>({} as Environment);

interface Props {
    children: ReactNode;
}
export const EnvironmentProvider: FC<Props> = ({ children }) => {
    const location = useLocation();
    const params = queryString.parse(location.search);
    const defaultEndpoint = 'wss://testnet-node-1.acala.laminar.one/ws';
    const environment = {
        endpoint: (params.endpoint as string) || defaultEndpoint,
        logo: AcalaMandalaLogo,
        polkascanPrefix: 'https://polkascan.io/pre/acala-mandala',
    };
    return <Context.Provider value={environment}>{children}</Context.Provider>;
};

export const useEnvironment = () => {
    const enviroment = useContext(Context);
    return enviroment;
};
