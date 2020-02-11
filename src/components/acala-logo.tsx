import React, { FC } from 'react';
import { useEnvironment } from '@/hooks/environment';

export const AcalaLogo: FC = () => {
    const environment = useEnvironment();
    return <img src={environment.logo} width={225} height={30} alt="acala-logo" />;
};
