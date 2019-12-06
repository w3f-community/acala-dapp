import React from 'react';
import { Grid, Typography, Theme, makeStyles, createStyles } from '@material-ui/core';
import clsx from 'clsx';

import { useTranslate } from '@/hooks/i18n';
import { AddStep } from './index.types';
import RightArrow from '@/assets/right-arrow.svg';
import { createTypography } from '@/theme';

interface StepData {
    key: AddStep;
    title: string;
    desc: string;
}

interface Props {
    current: AddStep;
}

const useStepStyles = makeStyles((theme: Theme) =>
    createStyles({
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
    const steps: Array<StepData> = [
        {
            key: 'select',
            title: t('Select Collateral'),
            desc: t('Each collateral type has its own unique risk profiles.'),
        },
        {
            key: 'generate',
            title: t('Generate aUSD'),
            desc: t('Deposit ETH as collateral to genearte aUSD'),
        },
        {
            key: 'confirm',
            title: t('Confirmation'),
            desc: t('Confirm creating a collateralized loan for aUSD'),
        },
    ];
    const currentStepData = steps.filter(({ key }) => current === key);

    return (
        <>
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
                            <Typography variant="inherit">{title}</Typography>
                        </Grid>,
                        <Grid item className={classes.arrow} key={`add-vault-step-title-${key}`}>
                            {index < steps.length - 1 && <img src={RightArrow} />}
                        </Grid>,
                    ];
                })}
            </Grid>
            {currentStepData.map(({ key, desc }) => (
                <Typography key={`add-vault-step-dec-${key}`} className={classes.desc}>
                    {desc}
                </Typography>
            ))}
        </>
    );
};

export default Component;
