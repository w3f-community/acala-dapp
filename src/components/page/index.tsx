import React, { ReactNode, CSSProperties } from 'react';
import { Container, Theme, withStyles } from '@material-ui/core';
import { Title } from './title';

interface Props {
    children: ReactNode;
    title?: string;
    style?: CSSProperties;
}

const SContainer = withStyles((theme: Theme) => ({
    root: {
        boxSizing: 'content-box',
        padding: '74px 54px',
        marginLeft: 0,
        [theme.breakpoints.down('sm')]: {
            padding: '0 20px',
        },
    },
}))(Container);

const Page: React.FC<Props> = ({ children, title, style }) => {
    return (
        <SContainer maxWidth={false} style={style}>
            {title && <Title>{title}</Title>}
            {children}
        </SContainer>
    );
};

export default Page;
