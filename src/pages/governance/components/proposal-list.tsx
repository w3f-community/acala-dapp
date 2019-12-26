import React from 'react';
import { Paper, withStyles, Theme, Typography, Link, Button, Grid } from '@material-ui/core';
import Moment from 'dayjs';
import { ProposalData } from '@/types/store';
import { STABLE_COIN } from '@/config';
import { createTypography } from '@/theme';
import { formatPrice } from '@/components/formatter';
import FixedU128 from '@/utils/fixed_u128';
import { getAssetName } from '@/utils';
import { useTranslate } from '@/hooks/i18n';

const MockData: ProposalData[] = [
    {
        title: 'Multi-Collateral Dai Launch - November 18, 2019',
        summary: 'Vote to ratify the collection of system parameters needed to activate Multi-Collateral Dai',
        detail: 'xx',
        execute: {
            time: new Date().getDate(),
            target: {
                amount: FixedU128.fromNatural(72017.46),
                asset: STABLE_COIN,
            },
        },
        time: new Date().getDate(),
        current: {
            yay: FixedU128.fromNatural(3534.69),
            nay: FixedU128.fromNatural(0),
        },
    },
];

const SPaper = withStyles((theme: Theme) => ({
    root: {
        padding: '38px 47px',
        marginBottom: 28,
    },
}))(Paper);

const Title = withStyles((theme: Theme) => ({
    root: {
        ...createTypography(22, 32, 500, 'Roboto', theme.palette.common.black),
    },
}))(Typography);

const Summary = withStyles((theme: Theme) => ({
    root: {
        marginTop: 10,
        ...createTypography(22, 32, 500, 'Roboto', theme.palette.grey[600]),
    },
}))(Typography);

const Execute = withStyles((theme: Theme) => ({
    root: {
        marginTop: 10,
        ...createTypography(17, 24, 500, 'Roboto', theme.palette.primary.light),
    },
}))(Typography);

const ReadMore = withStyles((theme: Theme) => ({
    root: {
        display: 'block',
        marginTop: 18,
        ...createTypography(14, 19, 300, 'Roboto', theme.palette.common.black),
    },
}))(Link);

const VoteBtn = withStyles(() => ({
    root: {
        marginTop: 32,
        minWidth: 256,
    },
}))(Button);

const YayStatus = withStyles((theme: Theme) => ({
    root: {
        marginTop: 10,
        ...createTypography(22, 32, 500, 'Roboto', theme.palette.grey[600]),
    },
}))(Typography);

type Props = {
    [K in keyof ProposalData]: ProposalData[K];
};
const ProposalItem: React.FC<Props> = ({ title, summary, execute, current }) => {
    const { t } = useTranslate();
    const getExecuteSummary = (execute: ProposalData['execute']) => {
        return (
            <span>
                Executed on {Moment(execute.time).format('YYYY/MM/DD HH:mm')} with {formatPrice(execute.target.amount)}{' '}
                {getAssetName(execute.target.asset)}
            </span>
        );
    };
    const getYayStatus = (current: ProposalData['current'], execute: ProposalData['execute']) => {
        return (
            <span>
                {formatPrice(current.yay)} {getAssetName(execute.target.asset)} in support
            </span>
        );
    };
    return (
        <SPaper elevation={1}>
            <Title>{title}</Title>
            <Execute>{getExecuteSummary(execute)}</Execute>
            <Summary>{summary}</Summary>
            <ReadMore href="">{t('Read more')}</ReadMore>
            <VoteBtn variant="contained" color="primary">
                {t('Vote for this proposal')}
            </VoteBtn>
            <YayStatus>{getYayStatus(current, execute)}</YayStatus>
        </SPaper>
    );
};

const ProposalList: React.FC = () => {
    const data = MockData;
    return (
        <Grid container>
            {data.map(item => (
                <Grid xs={12} lg={8}>
                    <ProposalItem {...item} key={item.title} />
                </Grid>
            ))}
        </Grid>
    );
};

export default ProposalList;
