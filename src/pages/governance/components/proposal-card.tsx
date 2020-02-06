import React, { FC, ReactNode, useState } from 'react';
import { Paper, withStyles, Theme, Typography, Link, Button, Grid, Box } from '@material-ui/core';
import Moment from 'dayjs';
import { ProposalData } from '@/types/store';
import { STABLE_COIN } from '@/config';
import { createTypography } from '@/theme';
import { formatPrice } from '@/components/formatter';
import FixedU128 from '@/utils/fixed_u128';
import { getAssetName } from '@/utils';
import { useTranslate } from '@/hooks/i18n';
import Card from '@/components/card';

const Title = withStyles((theme: Theme) => ({
    root: {
        minWidth: 100,
        ...createTypography(22, 32, 500, 'Roboto', theme.palette.common.black),
    },
}))(Typography);

const Count = withStyles((theme: Theme) => ({
    root: {
        marginLeft: 23,
        ...createTypography(22, 32, 500, 'Roboto', theme.palette.secondary.main),
    },
}))(Typography);

const ProposalItemRoot = withStyles((theme: Theme) => ({
    root: {
        paddingBottom: 26,
        borderBottom: `1px solid ${theme.palette.secondary.main}`,
        '&:last-child': {
            borderBottom: 'none',
        },
    },
}))(Box);

const ProposalTitle = withStyles((theme: Theme) => ({
    root: {
        ...createTypography(22, 32, 500, 'Roboto', theme.palette.common.black),
    },
}))(Typography);

const Execute = withStyles((theme: Theme) => ({
    root: {
        cursor: 'pointer',
        marginTop: theme.spacing(1),
        ...createTypography(15, 22, 500, 'Roboto', theme.palette.primary.light),
    },
}))(Typography);

const VoteButton = withStyles(() => ({
    root: {
        width: 128,
    },
}))(Button);

const YayStatus = withStyles((theme: Theme) => ({
    root: {
        marginTop: 10,
        ...createTypography(22, 32, 500, 'Roboto', theme.palette.grey[600]),
    },
}))(Typography);

interface ItemProps {
    index: number;
    data: ProposalData;
}
const ProposalItem: React.FC<ItemProps> = ({ index, data }) => {
    const { t } = useTranslate();
    const [showDetail, setShowDetail] = useState<boolean>(false);
    return (
        <ProposalItemRoot display="flex" alignItems="flex-start" key={`proposal-item-${data.hash}`}>
            <Box flex={1}>
                <ProposalTitle>{`${index + 1} ${data.proposal.method.name}`}</ProposalTitle>
                <Execute>Detail</Execute>
            </Box>
            <Box>
                <VoteButton variant="contained" color="primary">
                    {t('Vote')}
                </VoteButton>
            </Box>
        </ProposalItemRoot>
    );
};

interface Props {
    header: string;
    count: number;
    data: ProposalData[];
}

export const ProposalCard: FC<Props> = ({ header, count, data }) => {
    return (
        <Card
            header={
                <Box display="flex">
                    <Title>{header}</Title>
                    <Count>{count}</Count>
                </Box>
            }
            elevation={1}
            size="normal"
            divider={false}
        >
            {data.map((item, index) => (
                <ProposalItem data={item} index={index} key={`proposal-item-${index}`} />
            ))}
        </Card>
    );
};
