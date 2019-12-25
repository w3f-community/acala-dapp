import React, { useState, useEffect, ChangeEvent } from 'react';
import { Grid, withStyles, Theme, Typography, TextField } from '@material-ui/core';
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
    onChange: (assetRef: number, value: number) => void;
    value?: number;
    defaultAsset?: number;
    error?: boolean;
}

const AmountInput: React.FC<AmountInputProps> = ({ title, defaultAsset = 1, value = 0, onChange, error }) => {
    const { t } = useTranslate();
    const [asset, setAsset] = useState<number>(defaultAsset);

    /* eslint-disable */
    useEffect(() => {
        // notify assetRef change
        onChange(asset, value);
    }, [asset]);
    /* eslint-enable */

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
