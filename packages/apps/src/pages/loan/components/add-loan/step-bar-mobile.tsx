import React, { useState } from 'react';
import clsx from 'clsx';
import {
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    Grid,
    IconButton,
    makeStyles,
    createStyles,
    withStyles,
    Theme,
} from '@material-ui/core';

import { useTranslate } from '@honzon-platform/apps/hooks/i18n';
import CloseIcon from '@honzon-platform/apps/components/svgs/close';
import RightArrow from '@honzon-platform/apps/assets/right-arrow.svg';

import { StepData } from './step-bar';
import { createTypography } from '@honzon-platform/apps/theme';

interface Props {
    steps: StepData[];
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        item: {
            ...createTypography(21, 28, 500, 'Roboto', theme.palette.common.black),
        },
        arrow: {
            margin: '20px 0',
            transform: 'rotate(90deg)',
        },
        tips: {
            margin: '48px 0 28px 0',
            ...createTypography(15, 20, 400, 'Roboto'),
            textAlign: 'center',
        },
    }),
);

const SDialog = withStyles(() => ({
    paper: {
        paddingTop: 22,
    },
}))(Dialog);

const StepBarMobile: React.FC<Props> = ({ steps }) => {
    const [open, setOpen] = useState<boolean>(true);
    const { t } = useTranslate();
    const classes = useStyles();

    const handleClose = () => setOpen(false);
    return (
        <SDialog open={open}>
            <DialogTitle>
                <Grid container justify="flex-end" alignItems="center">
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <Grid container direction="column" justify="center" alignItems="center">
                    <Grid container alignItems="center" direction="column" justify="center">
                        {steps.map(({ key, title }, index) => {
                            return [
                                <Grid item key={`add-loan-step-key-${key}`} className={clsx(classes.item)}>
                                    {title}
                                </Grid>,
                                index < steps.length - 1 && (
                                    <Grid item key={`add-loan-step-title-${key}`} className={classes.arrow}>
                                        <img src={RightArrow} alt="right-arrow" />
                                    </Grid>
                                ),
                            ];
                        })}
                    </Grid>
                    <p className={classes.tips}>{t('Each collateral type has its own unique risk profiles.')}</p>
                    <Button variant="contained" color="primary" onClick={handleClose}>
                        {t('Ok')}
                    </Button>
                </Grid>
            </DialogContent>
        </SDialog>
    );
};

export default StepBarMobile;
