import React, { ChangeEvent, useEffect } from 'react';
import { MenuItem, Select, withStyles, Theme } from '@material-ui/core';
import { createTypography } from '@honzon-platform/apps/theme';
import { CdpTypeData } from '@honzon-platform/apps/types/store';
import { getAssetName } from '@honzon-platform/apps/utils';

const SMenuItem = withStyles((theme: Theme) => ({
    root: {
        ...createTypography(18, 22, 500, 'Roboto', theme.palette.common.black),
    },
}))(MenuItem);

interface Props {
    selected: number;
    cdpTypes: CdpTypeData[];
    onChange: (asset: number) => void;
}
const CollateralSelect: React.FC<Props> = ({ selected, cdpTypes, onChange }) => {
    useEffect(() => {
        if (!cdpTypes.find(item => item.asset === selected)) {
            onChange(cdpTypes[0].asset);
        }
        return () => {};
    }, []);

    const handleChange = (event: ChangeEvent<{ name?: string | undefined; value: unknown }>): void => {
        const result = Number(event.target.value);
        onChange(result);
    };

    return (
        <Select value={selected} onChange={handleChange} disableUnderline>
            {cdpTypes.map(item => (
                <SMenuItem value={item.asset} key={`colateral-${item.asset}`}>
                    {getAssetName(item.asset)}
                </SMenuItem>
            ))}
        </Select>
    );
};

export default CollateralSelect;
