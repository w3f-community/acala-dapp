import React, { FC, useState } from 'react';
import { isEmpty } from 'lodash';
import { withStyles, Theme, Typography, Button, Box } from '@material-ui/core';
import { ProposalData } from '@honzon-platform/apps/types/store';
import { createTypography } from '@honzon-platform/apps/theme';
import { useTranslate } from '@honzon-platform/apps/hooks/i18n';
import Card from '@honzon-platform/apps/components/card';
import clsx from 'clsx';
import { ProposalDetail } from './proposal-detail';

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
        borderBottom: `2px solid ${theme.palette.secondary.main}`,
        '&:last-child': {
            borderBottom: 'none',
        },
    },
}))(Box);

const ProposalTitle = withStyles((theme: Theme) => ({
    root: {
        display: 'inline-block',
        ...createTypography(22, 32, 500, 'Roboto', theme.palette.common.black),
        '&.detail': {
            paddingBottom: 8,
            borderBottom: `2px solid ${theme.palette.secondary.main}`,
        },
    },
}))(Typography);

const Detail = withStyles((theme: Theme) => ({
    root: {
        minWidth: 100,
        marginTop: 17.5,
        ...createTypography(22, 32, 500, 'Roboto', theme.palette.common.black),
        wordBreak: 'break-all',
    },
}))(Box);

const Hash = withStyles((theme: Theme) => ({
    root: {
        minWidth: 100,
        marginTop: 8,
        ...createTypography(15, 22, 500, 'Roboto', theme.palette.secondary.main),
        wordBreak: 'break-all',
    },
}))(Box);

const VotedAddress = withStyles((theme: Theme) => ({
    root: {
        minWidth: 100,
        marginTop: 8,
        ...createTypography(15, 22, 500, 'Roboto', theme.palette.secondary.main),
        wordBreak: 'break-all',
    },
}))(Box);

const Summary = withStyles((theme: Theme) => ({
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

interface ItemProps {
    index: number;
    data: ProposalData;
    showVote?: boolean;
}
const ProposalItem: React.FC<ItemProps> = ({ index, data, showVote }) => {
    const { t } = useTranslate();
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const handleShowDetail = () => setShowDetail(true);
    return (
        <ProposalItemRoot display="flex" alignItems="flex-start" key={`proposal-item-${data.hash}`}>
            <Box flex={1}>
                <ProposalTitle className={clsx({ detail: showDetail })}>{`${index + 1} ${
                    data.proposal.method.name
                }`}</ProposalTitle>
                {!showDetail && <Summary onClick={handleShowDetail}>Detail</Summary>}
                {showDetail && (
                    <>
                        <Detail>
                            <ProposalDetail data={data} />
                        </Detail>
                        <Hash>
                            <p>{t('Proposal hash')}</p>
                            <p>{data.hash}</p>
                        </Hash>
                        <VotedAddress>
                            {!isEmpty(data.vote.ayes) && <p>Aye</p>}
                            {!isEmpty(data.vote.ayes) &&
                                data.vote.ayes.map(address => <p key={`ayes-${address}`}>{address}</p>)}
                        </VotedAddress>
                        <VotedAddress>
                            {!isEmpty(data.vote.nays) && <p>Nay</p>}
                            {!isEmpty(data.vote.nays) &&
                                data.vote.nays.map(address => <p key={`nays-${address}`}>{address}</p>)}
                        </VotedAddress>
                    </>
                )}
            </Box>
            <Box>
                {showVote && (
                    <VoteButton variant="contained" color="primary">
                        {t('Vote')}
                    </VoteButton>
                )}
            </Box>
        </ProposalItemRoot>
    );
};

interface Props {
    header: string;
    count: number;
    data: ProposalData[];
    showVote?: boolean;
}

export const ProposalCard: FC<Props> = ({ header, count, data, showVote }) => {
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
                <ProposalItem data={item} index={index} key={`proposal-item-${index}`} showVote={showVote} />
            ))}
        </Card>
    );
};
