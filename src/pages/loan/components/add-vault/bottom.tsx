import React from 'react';
import { Grid, Button, makeStyles, createStyles, Theme } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import useMobileMatch from '@/hooks/mobile-match';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        linkBtn: {
            minWidth: 0,
            textDecoration: 'underline',
            color: '#757575',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
    }),
);

interface Props {
    className?: string;
    onNext: () => void;
    nextBtnDisabled?: boolean;
    onPrev: () => void;
    onCancel?: () => void;
}

const Bottom: React.FC<Props> = ({ className, onNext, nextBtnDisabled, onPrev, onCancel }) => {
    const { t } = useTranslate();
    const match = useMobileMatch('sm');
    const classes = useStyles();

    return (
        <>
            {match ? (
                <Grid container spacing={2} direction={match ? 'row' : 'row-reverse'} className={className}>
                    <Grid item xs={12} lg={8}>
                        <Grid container justify="space-between">
                            <Button variant="contained" color="secondary" onClick={onPrev}>
                                {t('Previous')}
                            </Button>
                            <Button variant="contained" color="primary" onClick={onNext}>
                                {t('Next')}
                            </Button>
                        </Grid>
                    </Grid>
                    {onCancel ? (
                        <Grid item xs={12} lg={3}>
                            <Grid container justify="center">
                                <Button className={classes.linkBtn} onClick={onCancel}>
                                    {t('Cancel')}
                                </Button>
                            </Grid>
                        </Grid>
                    ) : null}
                </Grid>
            ) : (
                <Grid container spacing={2} wrap="nowrap" className={className}>
                    {onCancel ? (
                        <Grid item>
                            <Button className={classes.linkBtn} onClick={onCancel}>
                                {t('Cancel')}
                            </Button>
                        </Grid>
                    ) : null}
                    <Grid item>
                        <Button variant="contained" color="secondary" onClick={onPrev}>
                            {t('Previous')}
                        </Button>
                    </Grid>

                    <Grid item>
                        <Button variant="contained" color="primary" onClick={onNext} disabled={nextBtnDisabled}>
                            {t('Next')}
                        </Button>
                    </Grid>
                </Grid>
            )}
        </>
    );
};

export default Bottom;
