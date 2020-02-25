import React, { ElementType, FC } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import MainLayout from '@/layouts/main';
import Loan from '@/pages/loan';
import Exchange from '@/pages/exchange';
import Governance from '@/pages/governance';
import Wallet from '@/pages/wallet';

interface RouteConfig {
    exact?: boolean;
    path: string;
    Component: ElementType;
    routes?: RouteConfig[];
}

const ToLoan: FC = () => <Redirect to="/loan" />;
const routesConfig: RouteConfig[] = [
    {
        path: '/',
        Component: MainLayout,
        routes: [
            {
                path: 'loan',
                Component: Loan,
            },
            {
                path: 'exchange',
                Component: Exchange,
            },
            {
                path: 'governance',
                Component: Governance,
            },
            {
                path: 'wallet',
                Component: Wallet,
            },
            {
                path: '',
                Component: ToLoan,
            },
        ],
    },
];

interface SubRoutesProps {
    config: RouteConfig[];
    prefix: string;
}

const SubRoutes: React.FC<SubRoutesProps> = ({ config, prefix = '' }) => {
    return (
        <Switch>
            {config.map(({ Component, routes, path, exact }: RouteConfig, key: number) => (
                <Route key={`route_${prefix}_${key}`} path={`${prefix}${path}`} exact={exact}>
                    <Component>{routes && <SubRoutes config={routes} prefix={path} />}</Component>
                </Route>
            ))}
        </Switch>
    );
};

const buildRoutes = (config: RouteConfig[]) => {
    return <SubRoutes config={config} prefix="" />;
};

export default buildRoutes(routesConfig);
