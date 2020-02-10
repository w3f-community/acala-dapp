import React, { ElementType } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import MainLayout from '@/layouts/main';
import Dashboard from '@/pages/dashboard';
import Loan from '@/pages/loan';
import Exchange from '@/pages/exchange';
import Governance from '@/pages/governance';

interface RouteConfig {
    path: string;
    Component: ElementType;
    routes?: RouteConfig[];
}

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
                path: '',
                Component: Dashboard,
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
            {config.map(({ Component, routes, path }: RouteConfig, key: number) => (
                <Route key={`route_${prefix}_${key}`} path={`${prefix}${path}`}>
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
