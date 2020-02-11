import React from 'react';
import { withStyles, Grid, Paper, Button, Theme, createStyles, makeStyles } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import RightArrow from '@/assets/right-arrow.svg';
import Loan from '@/components/svgs/loan';
import { createTypography } from '@/theme';

const Card = withStyles(() => ({
    root: { padding: '47px 54px 98px 54px' },
}))(Paper);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            padding: '108px 0 80px 0',
        },
        img: {
            marginTop: 72,
            marginBottom: 62.5,
            width: '100%',
            maxWidth: 330,
        },
        title: {
            ...createTypography(22, 32, 500, 'Roboto', theme.palette.primary.light),
        },
        item: { ...createTypography(21, 28, 500, 'Roboto') },
        arrow: { width: 59 },
    }),
);

interface Props {
    onConfirm: () => void;
}

const Guide: React.FC<Props> = ({ onConfirm }) => {
    const { t } = useTranslate();
    const classes = useStyles();
    const steps: Array<{ key: string; title: string }> = [
        { key: 'select', title: t('Select Collateral') },
        { key: 'generate', title: t('Generate aUSD') },
        { key: 'confirm', title: t('Confirmation') },
    ];
    return (
        <Card square={true} elevation={1} className={classes.card}>
            <Grid container justify="center" alignItems="center" direction="column">
                <Grid container alignItems="center" spacing={2} justify="center" className={classes.title}>
                    {steps.map(({ key, title }, index) => {
                        return [
                            <Grid key={`add-loan-step-key-${key}`} item className={classes.item}>
                                {title}
                            </Grid>,
                            index < steps.length - 1 && (
                                <Grid item className={classes.arrow} key={`add-loan-step-title-${key}`}>
                                    <img src={RightArrow} alt="right-arrow" />
                                </Grid>
                            ),
                        ];
                    })}
                </Grid>
                <Loan className={classes.img} />
                <Button variant="contained" color="primary" onClick={onConfirm}>
                    {t('Get Started')}
                </Button>
            </Grid>
        </Card>
    );
};

export default Guide;
