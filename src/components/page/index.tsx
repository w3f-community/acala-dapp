import React, { ReactNode, CSSProperties } from 'react';
import { Container, Theme, withStyles } from '@material-ui/core';
import { Title } from './title';
import clsx from 'clsx';
import { BaseProps } from '@/types/react-component/props';

type Props = {
    children: ReactNode;
    title?: string;
    fullScreen?: boolean;
} & BaseProps;

const SContainer = withStyles((theme: Theme) => ({
    root: {
        boxSizing: 'content-box',
        padding: '74px 54px',
        marginLeft: 0,
        [theme.breakpoints.down('sm')]: {
            padding: '0 20px',
        },
        '&.full_screen': {
            minWidth: '100%',
            boxSizing: 'border-box',
        },
    },
}))(Container);

const Page: React.FC<Props> = ({ children, title, style, className, fullScreen }) => {
    return (
        <SContainer maxWidth={false} style={style} className={clsx(className, { full_screen: fullScreen })}>
            {title && <Title>{title}</Title>}
            {children}
        </SContainer>
    );
};

export default Page;
