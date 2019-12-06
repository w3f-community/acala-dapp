import React, { ReactNode } from 'react';
import { Grid, Button, Paper, List, ListItem, makeStyles, createStyles, Radio } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import { createTypography } from '@/theme';
import { formatRatio } from '@/components/formatter';
import { BaseStepCard } from './index.types';

type Props = BaseStepCard;

const useCardStyles = makeStyles(() =>
    createStyles({
        root: { padding: '66px 35px 60px 29px' },
    }),
);

const useListStyles = makeStyles(() =>
    createStyles({
        item: {
            marginBottom: 24,
            ...createTypography(21, 28, 600, 'Roboto', '#424242'),
        },
        protocol: {
            marginTop: 30,
            ...createTypography(14, 19, 400, 'Roboto', '#757575'),
            '& .underline': {
                textDecoration: 'underline',
                cursor: 'pointer',
            },
        },
    }),
);

const useBottomStyles = makeStyles(() =>
    createStyles({
        root: {
            paddingTop: 66,
        },
        note: {
            width: 352,
            ...createTypography(14, 19, 400, 'Roboto', '#757575'),
        },
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

const Component: React.FC<Props> = ({ onNext, onPrev }) => {
    const { t } = useTranslate();
    const cardClasses = useCardStyles();
    const listClasses = useListStyles();
    const bottomClasses = useBottomStyles();
    const handleNextBtnClick = () => {
        onNext();
    };

    const renderListItem = (key: string, value: string): ReactNode => {
        return (
            <ListItem classes={{ root: listClasses.item }}>
                <Grid container justify="space-between">
                    <span>{key}</span>
                    <span>{value}</span>
                </Grid>
            </ListItem>
        );
    };

    return (
        <Paper square={true} elevation={1} classes={cardClasses}>
            <Grid container justify="center">
                <Grid item xs={6}>
                    <List disablePadding>
                        {renderListItem(t('Depositing'), formatRatio(1.75))}
                        {renderListItem(t('Borrowing/Generating'), formatRatio(1.75))}
                        {renderListItem(t('Collateralization Ratio'), formatRatio(1.75))}
                        {renderListItem(t('Liquidation Ratio'), formatRatio(1.75))}
                        {renderListItem(t('Liquidation Fee'), formatRatio(1.75))}
                        {renderListItem(t('Stability Fee/Interest Rate'), formatRatio(1.75))}
                    </List>
                    <Grid container className={listClasses.protocol} alignItems="center">
                        <Radio />
                        <span>{t('I have read and accepted the ')}</span>
                        <a className={'underline'}>{t('Terms and Conditions')}</a>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container className={bottomClasses.root} justify="flex-end">
                <Grid item>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Button className={bottomClasses.linkBtn}>{t('Cancel')}</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="secondary" onClick={onPrev}>
                                {t('Previous')}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={handleNextBtnClick}>
                                {t('Next')}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Component;
