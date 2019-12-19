import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { Grid, withStyles, Theme, Typography, Select, TextField } from '@material-ui/core';
import { createTypography } from '@/theme';
import TokenSelect from '@/components/token-select';
import { DEX_TOKENS } from '@/config';
import { useTranslate } from '@/hooks/i18n';
import { useSelector } from 'react-redux';
import { specBalanceSelector } from '@/store/account/selectors';
import FixedU128 from '@/utils/fixed_u128';

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
    onChange: (assetRef: number, value: number) => void;
    value?: number;
    defaultAsset?: number;
    error?: boolean;
}

const AmountInput: React.FC<AmountInputProps> = ({ title, defaultAsset = 1, value = 0, onChange, error }) => {
    const { t } = useTranslate();
    const [asset, setAsset] = useState<number>(defaultAsset);

    useEffect(() => {
        // notify assetRef change
        onChange(asset, value);
    }, [asset]);

    const handleTokenChange = (assetId: number) => setAsset(assetId);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(asset, Number(e.currentTarget.value) || 0);
    };

    return (
        <SGrid container alignItems="center" wrap="nowrap" style={{ width: 'auto' }}>
            <SubTitle>{title}</SubTitle>
            <TokenSelect defaultToken={defaultAsset} data={DEX_TOKENS} onChange={handleTokenChange} />
            <STextField
                type="Number"
                value={value ? value : ''}
                error={error}
                placeholder={t('Enter Amount')}
                className={'inputRef'}
                onChange={handleInputChange}
            />
        </SGrid>
    );
};

export default AmountInput;
