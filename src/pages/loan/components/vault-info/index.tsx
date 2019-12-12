import React from 'react';
import { Grid, Box, Paper, Typography, makeStyles, createStyles, Theme, withStyles } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import Formatter, { FormatterProps } from '@/components/formatter';
import { CurrentVault } from '../../index.types';
import { useSelector } from 'react-redux';
import { vaultsSelector, specVaultSelector, specPriceSelector } from '@/store/chain/selectors';
import { STABLE_COIN } from '@/config';
import { specUserVaultSelector, userVaultsSelector } from '@/store/user/selectors';

const StyledPaper = withStyles(() => ({
    root: {
        height: 133,
        padding: '26px 32px',
        '& .MuiGrid-root': {
            height: '100%',
        },
    },
}))(Paper);

type CardProps = {
    header: string;
    content: number;
    formatterProps: Omit<FormatterProps, 'data'>;
};

const Card: React.FC<CardProps> = ({ header, content, formatterProps }) => {
    return (
        <Grid item xs>
            <StyledPaper elevation={2} square={true}>
                <Grid container direction="column" justify="space-between" alignItems="center">
                    <Typography variant="body2" style={{ whiteSpace: 'nowrap' }}>
                        {header}
                    </Typography>
                    <Typography variant="body1">
                        <Formatter data={content} {...formatterProps} />
                    </Typography>
                </Grid>
            </StyledPaper>
        </Grid>
    );
};

interface Props {
    current: number;
}

const VaultInfo: React.FC<Props> = ({ current }) => {
    const { t } = useTranslate();
    const currentVault = useSelector(specVaultSelector(current));
    const userVault = useSelector(specUserVaultSelector(current));
    const collateralPrice = useSelector(specPriceSelector(current));
    const stableCoinPrice = useSelector(specPriceSelector(STABLE_COIN));

    if (!currentVault || !userVault) {
        return null;
    }

    const currentCollateralRatio =
        ((userVault.collateral * collateralPrice) /
            (userVault.debit * currentVault.debitExchangeRate * stableCoinPrice)) *
        10 ** 36;

    return (
        <Grid container spacing={3}>
            <Card header={t('Interest Rate')} content={currentVault.stabilityFee} formatterProps={{ type: 'ratio' }} />
            <Card
                header={t('Current Collateral Ratio')}
                content={currentCollateralRatio}
                formatterProps={{ type: 'ratio' }}
            />
            <Card
                header={t('Liquidation Ratio')}
                content={currentVault.liquidationRatio}
                formatterProps={{ type: 'ratio' }}
            />
            <Card
                header={t('Liquidation Price')}
                content={currentVault.liquidationPenalty}
                formatterProps={{ type: 'price', prefix: '$' }}
            />
            <Card
                header={t('Liquidation Penalty')}
                content={currentVault.liquidationPenalty}
                formatterProps={{ type: 'ratio' }}
            />
        </Grid>
    );
};

export default VaultInfo;
