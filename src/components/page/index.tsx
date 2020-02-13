import React, { ReactNode } from 'react';
import { Container, Theme, withStyles } from '@material-ui/core';
import { Title } from './title';
import clsx from 'clsx';
import { BaseProps } from '@/types/react-component/props';

interface Props extends BaseProps {
    children: ReactNode;
    title?: string;
    fullScreen?: boolean;
}

const SContainer = withStyles((theme: Theme) => ({
    root: {
        boxSizing: 'border-box',
        padding: `${theme.spacing(4)}px ${theme.spacing(2)}px`,
        marginLeft: 0,
        [theme.breakpoints.down('sm')]: {
            padding: '0 20px',
        },
        '&.fullScreen': {
            minWidth: '100%',
            boxSizing: 'border-box',
        },
    },
}))(Container);

const Page: React.FC<Props> = ({ children, title, style, className, fullScreen }) => {
    return (
        <SContainer maxWidth={false} style={style} className={clsx(className, { fullScreen: fullScreen })}>
            {title && <Title>{title}</Title>}
            {children}
        </SContainer>
    );
};

export default Page;
