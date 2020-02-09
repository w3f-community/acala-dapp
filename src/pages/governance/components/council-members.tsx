import React, { FC } from 'react';
import { useTranslate } from '@/hooks/i18n';
import { Box, withStyles, Typography, Theme } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { councilSelector } from '@/store/governance/selectors';
import Card from '@/components/card';
import { createTypography } from '@/theme';

const Title = withStyles((theme: Theme) => ({
    root: {
        minWidth: 100,
        ...createTypography(22, 32, 500, 'Roboto', theme.palette.common.black),
    },
}))(Typography);

const Account = withStyles((theme: Theme) => ({
    root: {
        marginTop: 17.5,
        ...createTypography(22, 32, 500, 'Roboto', theme.palette.secondary.main),
    },
}))(Typography);

export const CouncilMembers: FC = () => {
    const { t } = useTranslate();
    const members: string[] = useSelector(councilSelector);
    return (
        <>
            <Card
                header={
                    <Box display="flex">
                        <Title>{t('Members')}</Title>
                    </Box>
                }
                elevation={1}
                size="normal"
                divider={false}
            >
                {' '}
                {members.map((account, index) => (
                    <Account key={`council-${account}`}>{`${index + 1}. ${account}`}</Account>
                ))}
            </Card>
        </>
    );
};
