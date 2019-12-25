import React, { ReactNode } from 'react';
import { Container } from '@material-ui/core';

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
