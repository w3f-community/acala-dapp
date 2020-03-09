import React, { FC } from 'react';
import { useEnvironment } from '@honzon-platform/apps/hooks/environment';

export const AcalaLogo: FC = () => {
    const environment = useEnvironment();
    return <img src={environment.logo} width={180} height={25} alt="acala-logo" />;
};
