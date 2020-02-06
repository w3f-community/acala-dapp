import React, { ReactNode, CSSProperties } from 'react';
import { Container, Theme, withStyles } from '@material-ui/core';
import { Title } from './title';
import clsx from 'clsx';

interface Props {
    children: ReactNode;
    title?: string;
    style?: CSSProperties;
    fullScreen?: boolean
}

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
        }
    },
}))(Container);

const Page: React.FC<Props> = ({ children, title, style, fullScreen }) => {
    return (
        <SContainer maxWidth={false} style={style} className={clsx({ full_screen: fullScreen })}>
            {title && <Title>{title}</Title>}
            {children}
        </SContainer>
    );
};

export default Page;
