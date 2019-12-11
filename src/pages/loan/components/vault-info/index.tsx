import React from 'react';
import { Grid, Box, Paper, Typography, makeStyles, createStyles, Theme, withStyles } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import Formatter, { FormatterProps } from '@/components/formatter';
import { CurrentVault } from '../../index.types';
import { useSelector } from 'react-redux';
import { vaultsSelector } from '@/store/chain/selectors';

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
    const systemVaults = useSelector(vaultsSelector);
    const currentVault = systemVaults.filter(item => item.asset === current);
    if (!currentVault.length) {
        return null;
    }
    const data = currentVault[0];
    return (
        <Grid container spacing={3}>
            <Card header={t('Interest Rate')} content={data.stabilityFee} formatterProps={{ type: 'ratio' }} />
            <Card
                header={t('Current Collateral Ratio')}
                content={data.stabilityFee}
                formatterProps={{ type: 'ratio' }}
            />
            <Card header={t('Liquidation Ratio')} content={data.liquidationRatio} formatterProps={{ type: 'ratio' }} />
            <Card
                header={t('Liquidation Price')}
                content={data.liquidationPenalty}
                formatterProps={{ type: 'price', prefix: '$' }}
            />
            <Card
                header={t('Liquidation Penalty')}
                content={data.liquidationPenalty}
                formatterProps={{ type: 'ratio' }}
            />
        </Grid>
    );
};

export default VaultInfo;
