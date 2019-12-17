import React, { useState } from 'react';
import { Grid, withStyles, Theme, Typography, Select, TextField } from '@material-ui/core';
import { createTypography } from '@/theme';
import TokenSelect from '@/components/token-select';
import { DEX_TOKENS } from '@/config';
import { useTranslate } from '@/hooks/i18n';

const SubTitle = withStyles((theme: Theme) => ({
    root: {
        position: 'absolute',
        top: -60,
        ...createTypography(28, 32, 600, 'Roboto', theme.palette.primary.light),
    },
}))(Typography);

const SGrid = withStyles((theme: Theme) => ({
    root: {
        position: 'relative',
    },
}))(Grid);

const STextField = withStyles(() => ({
    root: {
        marginLeft: 9,
    },
}))(TextField);

interface AmountInputProps {
    title: string;
    initialAsset?: number;
}

const AmountInput: React.FC<AmountInputProps> = ({ title, initialAsset = 1 }) => {
    const [asset, setAsset] = useState<number>(initialAsset);
    const { t } = useTranslate();

    const handleTokenChange = (token: number) => {
        setAsset(token);
    };

    return (
        <SGrid container alignItems="center" wrap="nowrap" style={{ width: 'auto' }}>
            <SubTitle>{title}</SubTitle>
            <TokenSelect asset={asset} data={DEX_TOKENS} onChange={handleTokenChange} />
            <STextField type="number" placeholder={t('Enter Amount')} className={'input'} />
        </SGrid>
    );
};

export default AmountInput;
