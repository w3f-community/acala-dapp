import React, { ReactNode } from 'react';
import { Container } from '@material-ui/core';
import { CSSProperties } from '@material-ui/styles';

interface Props {
    children: ReactNode;
    padding: string;
}

const Page: React.FC<Props> = ({ children, padding }) => {
    return (
        <Container maxWidth={false} style={{ padding }}>
            {children}
        </Container>
    );
};

export default Page;
