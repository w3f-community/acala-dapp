import React, { ElementType } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import MainLayout from '@/layouts/main';
import Dashboard from '@/pages/dashboard';
import Loan from '@/pages/loan';

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
    return (
        <Router>
            <SubRoutes config={config} prefix="" />
        </Router>
    );
};

export default buildRoutes(routesConfig);
