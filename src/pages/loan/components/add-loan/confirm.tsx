import React, { ChangeEventHandler, useEffect } from 'react';
import clsx from 'clsx';
import {
    Grid,
    List,
    ListItem,
    makeStyles,
    createStyles,
    Checkbox,
    withStyles,
    Theme,
    Typography,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslate } from '@/hooks/i18n';
import { createTypography } from '@/theme';
import { formatRatio, formatBalance } from '@/components/formatter';
import { useForm } from '@/hooks/form';
import { specCdpTypeSelector, specPriceSelector, constantsSelector } from '@/store/chain/selectors';
import { specBalanceSelector } from '@/store/account/selectors';
import { getAssetName } from '@/utils';
import actions from '@/store/actions';
import { formContext } from './context';
import { statusSelector } from '@/store/loan/selectors';
import FixedU128 from '@/utils/fixed_u128';
import { calcCollateralRatio, calcStableFee, collateralToUSD, stableCoinToDebit } from '@/utils/loan';
import { STABLE_COIN } from '@/config';
import { loadingSelector } from '@/store/loading/reducer';
import rootActions from '@/store/actions';
import Bottom from './bottom';
import Card from '@/components/card';

const InfoItem = withStyles((theme: Theme) => ({
    root: {
        padding: 0,
        marginBottom: 8,
        ...createTypography(17, 24, 500, 'Roboto', theme.palette.common.black),
        [theme.breakpoints.down('sm')]: {
            marginBottom: 24,
            ...createTypography(15, 22, 500, 'Roboto', theme.palette.common.black),
        },
    },
}))(ListItem);

const ConfirmCheckbox = withStyles(() => ({
    root: {
        paddingLeft: 0,
    },
}))(Checkbox);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            padding: theme.spacing(4),
        },
        item: {
            marginBottom: 24,
        },
        protocol: {
            marginTop: 30,
            ...createTypography(14, 19, 400, 'Roboto', '#757575'),
            '& .underline': {
                textDecoration: 'underline',
                cursor: 'pointer',
            },
        },
        error: { color: 'red' },
        bottom: {
            marginTop: theme.spacing(4),
            justifyContent: 'flex-end',
            [theme.breakpoints.down('sm')]: {
                marginTop: 40,
            },
        },
    }),
);

const LoanInfoItemValue = withStyles((theme: Theme) => ({
    root: {
        font: 'inherit',
        color: theme.palette.secondary.main,
    },
}))(Typography);

const LoanInfoItem: React.FC<{ name: string; value: string }> = ({ name, value }) => {
    return (
        <InfoItem button>
            <Grid container justify="space-between">
                <span>{name}</span>
                <LoanInfoItemValue>{value}</LoanInfoItemValue>
            </Grid>
        </InfoItem>
    );
};

interface Props {
    onNext: () => void;
    onCancel: () => void;
    onPrev: () => void;
}

const Component: React.FC<Props> = ({ onNext, onPrev, onCancel }) => {
    const { t } = useTranslate();
    const classes = useStyles();
    const { data, setValue, setError, clearError } = useForm(formContext);
    const dispatch = useDispatch();

    const selectedAsset = data.asset.value;
    const collateral = FixedU128.fromNatural(data.collateral.value);
    const borrow = FixedU128.fromNatural(data.borrow.value);

    const assetName = getAssetName(selectedAsset);
    const cdpType = useSelector(specCdpTypeSelector(selectedAsset));
    const balance = useSelector(specBalanceSelector(selectedAsset));
    const [stableCoinPrice, collateralPrice] = useSelector(specPriceSelector([STABLE_COIN, selectedAsset]));
    const updateLoanStatus = useSelector(statusSelector('updateLoan'));
    const loading = useSelector(loadingSelector(rootActions.loan.UPDATE_VAULT));
    const constants = useSelector(constantsSelector)!;

    const handleNextBtnClick = () => {
        if (!data.agree.value) {
            setError('agree', 'need agree');
            return false;
        }

        if (!cdpType) {
            return false;
        }

        dispatch(
            actions.loan.updateLoan.request({
                asset: selectedAsset,
                collateral: collateral,
                debit: stableCoinToDebit(borrow, cdpType.debitExchangeRate),
            }),
        );
    };

    useEffect(() => {
        if (updateLoanStatus === 'success') {
            dispatch(actions.loan.reset());
            onNext();
        }
    }, [updateLoanStatus, dispatch, onNext]);

    const handleAgree: ChangeEventHandler<HTMLInputElement> = e => {
        const result = e.target.checked;
        setValue('agree', result);
        if (result) {
            clearError('agree');
        }
    };

    if (!cdpType || !constants) {
        return null;
    }

    return (
        <Card elevation={1} size="large" className={classes.card}>
            <Grid container>
                <Grid item xs={12}>
                    <List disablePadding>
                        {cdpType && balance && (
                            <>
                                <LoanInfoItem name={t('Depositing')} value={formatBalance(collateral, assetName)} />
                                <LoanInfoItem name={t('Borrowing')} value={formatBalance(borrow, 'aUSD')} />
                                <LoanInfoItem
                                    name={t('Collateralization Ratio')}
                                    value={formatRatio(
                                        calcCollateralRatio(
                                            collateralToUSD(collateral, collateralPrice),
                                            borrow.mul(stableCoinPrice),
                                        ),
                                    )}
                                />
                                <LoanInfoItem
                                    name={t('Liquidation Ratio')}
                                    value={formatRatio(cdpType.liquidationRatio)}
                                />
                                <LoanInfoItem
                                    name={t('Liquidation Fee')}
                                    value={formatRatio(cdpType.liquidationPenalty)}
                                />
                                <LoanInfoItem
                                    name={t('Interest Rate')}
                                    value={formatRatio(
                                        calcStableFee(cdpType.stabilityFee, constants.babe.expectedBlockTime),
                                    )}
                                />
                            </>
                        )}
                    </List>
                    <Grid
                        container
                        className={clsx(classes.protocol, {
                            [classes.error]: data.agree.error,
                        })}
                        alignItems="center"
                        wrap="nowrap"
                    >
                        <ConfirmCheckbox value={data.agree.value} onChange={handleAgree} />
                        <span>
                            {t('I have read and accepted the ')}
                            <a className={'underline'} href="/">
                                {t('Terms and Conditions')}
                            </a>
                        </span>
                    </Grid>
                </Grid>
            </Grid>
            <Bottom
                nextBtnDisabled={loading}
                onPrev={onPrev}
                onNext={handleNextBtnClick}
                onCancel={onCancel}
                className={classes.bottom}
            />
        </Card>
    );
};

export default Component;
