import React from 'react';
import { Grid, Typography, Theme, makeStyles, createStyles } from '@material-ui/core';
import clsx from 'clsx';

import { useTranslate } from '@/hooks/i18n';
import RightArrow from '@/assets/right-arrow.svg';
import { createTypography } from '@/theme';
import { getAssetName } from '@/utils';
import { useForm } from '@/hooks/form';
import useMobileMatch from '@/hooks/mobile-match';

import { AddStep } from './types';
import StepBarMobile from './step-bar-mobile';
import { formContext } from './context';

export interface StepData {
    key: AddStep;
    title: string;
    desc: string;
}

interface Props {
    current: AddStep;
}

const useStepStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginBottom: 32,
        },
        item: {
            ...createTypography(21, 28, 600, 'Roboto', '#757575'),
        },
        active: {
            color: theme.palette.primary.light,
        },
        arrow: {
            width: 59,
        },
        desc: {
            marginTop: theme.spacing(2),
            ...createTypography(15, 20, 400, 'Roboto', theme.palette.common.black),
        },
    }),
);

const Component: React.FC<Props> = ({ current }) => {
    const { t } = useTranslate();
    const classes = useStepStyles();
    const { data } = useForm(formContext);
    const match = useMobileMatch('sm');

    const steps: Array<StepData> = [
        {
            key: 'select',
            title: t('Select Collateral'),
            desc: t('Each collateral type has its own unique risk profiles.'),
        },
        {
            key: 'generate',
            title: t('Generate aUSD'),
            desc: t('Deposit {{asset}} as collateral to genearte aUSD', {
                asset: getAssetName(data.asset.value),
            }),
        },
        {
            key: 'confirm',
            title: t('Confirmation'),
            desc: t('Confirm creating a collateralized loan for aUSD'),
        },
    ];

    const currentStepData = steps.filter(({ key }) => current === key);

    if (match) {
        return <StepBarMobile steps={steps} />;
    }

    // when current step is success, don't show step-bar
    if (current === 'success') {
        return null;
    }

    return (
        <div className={classes.root}>
            <Grid container alignItems="center" spacing={2}>
                {steps.map(({ key, title }, index) => {
                    return [
                        <Grid
                            key={`add-vault-step-key-${key}`}
                            item
                            className={clsx(classes.item, {
                                [classes.active]: key === current,
                            })}
                        >
                            {title}
                        </Grid>,
                        index < steps.length - 1 && (
                            <Grid item className={classes.arrow} key={`add-vault-step-title-${key}`}>
                                <img src={RightArrow} alt="right-arrow" />
                            </Grid>
                        ),
                    ];
                })}
            </Grid>
            {currentStepData.map(({ key, desc }) => (
                <Typography key={`add-vault-step-dec-${key}`} className={classes.desc}>
                    {desc}
                </Typography>
            ))}
        </div>
    );
};

export default Component;
