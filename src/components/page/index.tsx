import React, { ReactNode } from 'react';
import { Container } from '@material-ui/core';
import useMobileMatch from '@/hooks/mobile-match';

interface Props {
    children: ReactNode;
    padding: string;
}

const Page: React.FC<Props> = ({ children, padding }) => {
    const match = useMobileMatch('sm');
    return (
        <Container maxWidth={false} style={match ? { padding: 20 } : { padding: padding }}>
            {children}
        </Container>
    );
};

export default Page;
