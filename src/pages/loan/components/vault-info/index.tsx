import React from 'react';
import { Grid, Box, Paper, Typography, makeStyles, createStyles, Theme } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import Formatter, { FormatterProps } from '@/components/formatter';
import { CurrentVault } from '../../index.types';

const useCardStyle = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: 133,
            padding: '26px 32px',
            '& .MuiGrid-root': {
                height: '100%',
            },
        },
    }),
);

type CardProps = {
    header: string;
    content: number;
    formatterProps: Omit<FormatterProps, 'data'>;
};

const Card: React.FC<CardProps> = ({ header, content, formatterProps }) => {
    const cardClasses = useCardStyle();
    return (
        <Grid item xs>
            <Paper elevation={2} square={true} classes={cardClasses}>
                <Grid container direction="column" justify="space-between" alignItems="center">
                    <Typography variant="body2">{header}</Typography>
                    <Typography variant="body1">
                        <Formatter data={content} {...formatterProps} />
                    </Typography>
                </Grid>
            </Paper>
        </Grid>
    );
};

interface Props {
    data: CurrentVault;
}

const VaultInfo: React.FC<Props> = ({ data }) => {
    const { t } = useTranslate();
    return (
        <Grid container spacing={3}>
            <Card header={t('Interest Rate')} content={data.stabilityFee} formatterProps={{ type: 'ratio' }} />
            <Card
                header={t('Current Collateral Ratio')}
                content={data.currentCollateralRatio}
                formatterProps={{ type: 'ratio' }}
            />
            <Card header={t('Liquidation Ratio')} content={data.liquidationRatio} formatterProps={{ type: 'ratio' }} />
            <Card
                header={t('Liquidation Price')}
                content={data.liquidationPrice}
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
