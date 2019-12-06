import React, { ReactNode } from 'react';
import {
    Grid,
    Button,
    Paper,
    TextField,
    List,
    ListItem,
    Typography,
    InputAdornment,
    makeStyles,
    createStyles,
    Theme,
} from '@material-ui/core';
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

const useInputStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: { width: '50%', marginBottom: 28 },
        label: {
            marginBottom: 22,
            ...createTypography(21, 28, 600, 'Roboto', theme.palette.primary.light),
        },
        helper: {
            marginTop: 28,
            ...createTypography(15, 20, 400, 'Roboto', theme.palette.common.black),
        },
    }),
);

const useListStyles = makeStyles(() =>
    createStyles({
        root: {
            padding: '39px 32px 37px 21px',
            background: 'rgba(161, 161, 161, 0.11)',
        },
        item: {
            ...createTypography(15, 22, 600, 'Roboto', '#424242'),
        },
    }),
);

const useBottomStyles = makeStyles(() =>
    createStyles({
        root: {
            paddingTop: 73,
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
    const inputClasses = useInputStyles();
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
            <Grid container>
                <Grid item xs={8}>
                    <Typography className={inputClasses.label}>
                        {t('How much ETH would you deposit as collateral?')}
                    </Typography>
                    <TextField
                        className={inputClasses.root}
                        helperText={
                            <p>
                                <span style={{ marginRight: 30 }}>{t('Max to Lock')}</span>
                                <span>{t('{{number}} {{asset}}', { number: 120, asset: 'ETH' })}</span>
                            </p>
                        }
                        InputProps={{
                            endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
                        }}
                        FormHelperTextProps={{
                            classes: { root: inputClasses.helper },
                        }}
                    />
                    <Typography className={inputClasses.label}>
                        {t('How much aUSD would you like to borrow?')}
                    </Typography>
                    <TextField
                        className={inputClasses.root}
                        helperText={
                            <p>
                                <span style={{ marginRight: 30 }}>{t('Max available to borrow')}</span>
                                <span>{t('{{number}} {{asset}}', { number: 120, asset: 'aUSD' })}</span>
                            </p>
                        }
                        InputProps={{
                            endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
                        }}
                        FormHelperTextProps={{
                            classes: { root: inputClasses.helper },
                        }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <List classes={{ root: listClasses.root }} disablePadding>
                        {renderListItem(t('Collateralization'), formatRatio(1.75))}
                        {renderListItem(t('Liquidation Ratio'), formatRatio(1.75))}
                        {renderListItem(t('ETH Price'), formatRatio(1.75))}
                        {renderListItem(t('Interest Rate'), formatRatio(1.75))}
                        {renderListItem(t('Liquidation Fee'), formatRatio(1.75))}
                        {renderListItem(t('Liquidation Price'), formatRatio(1.75))}
                    </List>
                </Grid>
            </Grid>
            <Grid container className={bottomClasses.root} justify="space-between">
                <Typography className={bottomClasses.note}>{t('ADD_VAULT_GENERATE_STABLE_COIN_NOTE')}</Typography>
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
