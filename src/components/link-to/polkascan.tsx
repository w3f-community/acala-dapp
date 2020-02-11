import React, { FC, ReactNode } from 'react';
import { useEnvironment } from '@/hooks/environment';

interface Props {
    extrinsic?: string;
    children: ReactNode;
}
export const LinkToPolkascan: FC<Props> = props => {
    const environment = useEnvironment();
    let link = '';
    // transaction
    if (props.extrinsic) {
        link = `${environment.polkascanPrefix}/extrinsic/${props.extrinsic}`;
    }
    return (
        <a href={link} target="_blank">
            {props.children}
        </a>
    );
};
