import React, { useEffect, ChangeEvent, createRef } from 'react';
import { Grid, withStyles, Theme, Typography, TextField } from '@material-ui/core';
import { createTypography } from '@/theme';
import TokenSelect from '@/components/token-select';
import { DEX_TOKENS } from '@/config';
import { useTranslate } from '@/hooks/i18n';
import useMobileMatch from '@/hooks/mobile-match';

const SubTitle = withStyles((theme: Theme) => ({
    root: {
        position: 'absolute',
        top: -60,
        ...createTypography(28, 32, 500, 'Roboto', theme.palette.primary.light),
        [theme.breakpoints.down('sm')]: {
            position: 'relative',
            top: 0,
            width: '100%',
            marginBottom: 26,
        },
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
    asset?: number;
    value?: number;
    min?: number;
    max?: number;
    onAssetChange: (asset: number) => void;
    onValueChange: (value: number) => void;
    error?: string;
}

const AmountInput: React.FC<AmountInputProps> = ({
    title,
    asset = 1,
    value = 0,
    onAssetChange,
    onValueChange,
    error,
}) => {
    const { t } = useTranslate();
    const match = useMobileMatch('sm');
    const ref = createRef<HTMLInputElement>();

    const handleTokenChange = (asset: number) => {
        onAssetChange(asset);
    };
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        onValueChange(Number(e.currentTarget.value));
    };

    useEffect(() => {
        if (ref.current) {
            ref.current.value = value ? value.toString() : '';
        }
    }, [value]);

    return (
        <SGrid container alignItems="center" wrap={match ? 'wrap' : 'nowrap'} style={{ width: 'auto' }}>
            <SubTitle>{title}</SubTitle>
            <TokenSelect defaultToken={asset} data={DEX_TOKENS} onChange={handleTokenChange} />
            {/* uncontrolled input */}
            <STextField
                inputRef={ref}
                type="Number"
                error={!!error}
                placeholder={t('Enter Amount')}
                className={'inputRef'}
                onChange={handleInputChange}
                helperText={error}
            />
        </SGrid>
    );
};

export default AmountInput;
