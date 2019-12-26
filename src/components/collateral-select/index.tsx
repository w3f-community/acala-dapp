import React, { ChangeEvent, ReactNode } from 'react';
import { MenuItem, Select, withStyles, Theme } from '@material-ui/core';
import { createTypography } from '@/theme';
import { BaseVaultData } from '@/types/store';
import { getAssetName } from '@/utils';

const SMenuItem = withStyles((theme: Theme) => ({
    root: {
        ...createTypography(18, 22, 500, 'Roboto', theme.palette.common.black),
    },
}))(MenuItem);

interface Props {
    selected: number;
    vaults: BaseVaultData[];
    onChange: (event: ChangeEvent<{ name?: string | undefined; value: unknown }>, child: ReactNode) => void;
}
const CollateralSelect: React.FC<Props> = ({ selected, vaults, onChange }) => {
    // hidden, if vaults doesn't contain selecte
    if (!vaults.find(item => item.asset === selected)) {
        return null;
    }

    return (
        <Select value={selected} onChange={onChange} disableUnderline>
            {vaults.map(item => (
                <SMenuItem value={item.asset} key={`colateral-${item.asset}`}>
                    {getAssetName(item.asset)}
                </SMenuItem>
            ))}
        </Select>
    );
};

export default CollateralSelect;
