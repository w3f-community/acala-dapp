import React from 'react';
import { Paper, withStyles, Grid, Button, Typography } from '@material-ui/core';
import ExchangeArrows from '@/assets/exchange-arrows.svg';
import { useTranslate } from '@/hooks/i18n';
import AmountInput from './amount-input';

const SPaper = withStyles(() => ({
    root: {
        padding: '100px 64px 45px',
    },
}))(Paper);

const SButton = withStyles(() => ({
    root: {
        width: 162,
    },
}))(Button);

const ExchangeBar: React.FC = () => {
    const { t } = useTranslate();
    return (
        <SPaper square={true} elevation={1}>
            <Grid container alignItems="center" justify="space-between" wrap="nowrap">
                <AmountInput title={t('Pay with')} />
                <img src={ExchangeArrows} />
                <AmountInput title={t('Receive')} />
                <SButton variant="contained" color="primary">
                    Exchange
                </SButton>
            </Grid>
        </SPaper>
    );
};

export default ExchangeBar;
