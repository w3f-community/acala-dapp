import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';

import add from '@/assets/add.svg';
import { getAssetName, getAssetIcon } from '@/utils';
import { vaultsSelector, pricesFeedSelector } from '@/store/chain/selectors';
import { accountVaultsSelector } from '@/store/account/selectors';
import Formatter from '@/components/formatter';
import clsx from 'clsx';
import { collateralToUSD, debitToUSD, calcCollateralRatio } from '@/utils/vault';
import { STABLE_COIN } from '@/config';
import FixedU128 from '@/utils/fixed_u128';
import useMobileMatch from '@/hooks/mobile-match';

const useStyle = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            [theme.breakpoints.down('sm')]: {
                flexDirection: 'column',
            },
        },
        paper: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',

            flexShrink: 0,
            minWidth: 120,
            height: 100,
            padding: '19px 16px 8px',
            cursor: 'pointer',

            [theme.breakpoints.down('sm')]: {
                padding: '13px 52px',
                width: 'auto',
                height: 'auto',
                flexDirection: 'row',
                alignItems: 'center',
            },

            '&.addContent': {
                alignItem: 'center',
                justifyContent: 'center',
                '& .MuiTypography-h6': {
                    marginTop: 11,
                    fontWeight: 400,
                    textAlign: 'center',
                },
            },
        },
        header: {
            [theme.breakpoints.down('sm')]: {
                width: 'auto',
                '& img': {
                    marginLeft: 10,
                },
            },
        },
        addVault: {
            [theme.breakpoints.down('sm')]: {
                marginTop: 13,
                '& $paper': {
                    flexDirection: 'column',
                    height: 89,
                },
            },
        },
    }),
);

const AddVault: React.FC<Pick<Props, 'onAdd'>> = ({ onAdd }) => {
    const classes = useStyle();
    return (
        <Grid item onClick={onAdd} className={classes.addVault}>
            <Paper elevation={2} className={clsx(classes.paper, { addContent: true })} square={true}>
                <img src={add} alt="add" />
                <Typography variant="h6">Add Loan</Typography>
            </Paper>
        </Grid>
    );
};

interface Props {
    onAdd: () => void;
    onSelect: (vault: number) => void;
}

const ZERO = FixedU128.fromNatural(0);

const VaultsList: React.FC<Props> = ({ onAdd, onSelect }) => {
    const classes = useStyle();
    const systemVaults = useSelector(vaultsSelector);
    const userVaults = useSelector(accountVaultsSelector);
    const prices = useSelector(pricesFeedSelector);
    const mobileMatch = useMobileMatch('sm');

    const stableCoinPrice = prices.find(item => item.asset === STABLE_COIN) || { price: ZERO };

    return (
        <Grid container spacing={mobileMatch ? 0 : 3} className={classes.root}>
            {userVaults.map(item => {
                const vault = systemVaults.find(vault => vault.asset === item.asset);

                if (!vault) return null;

                const collateralPrice = prices.find(price => price.asset === item.asset) || { price: ZERO };
                const currentCollateralRatio = calcCollateralRatio(
                    collateralToUSD(item.collateral, collateralPrice.price),
                    debitToUSD(item.debit, vault.debitExchangeRate, stableCoinPrice.price),
                );
                const status = currentCollateralRatio.isGreaterThan(
                    vault.requiredCollateralRatio.add(FixedU128.fromNatural(0.2)),
                );

                return (
                    <Grid item key={`vault-type-${item.asset}`} onClick={() => onSelect(item.asset)}>
                        <Paper elevation={mobileMatch ? 2 : 0} className={classes.paper} square={true}>
                            <Grid container justify="space-between" alignItems="center" className={classes.header}>
                                <Typography variant="h6">{getAssetName(item.asset)}</Typography>
                                <img src={getAssetIcon(item.asset)} alt={`icon-${item.asset}`} width={20} />
                            </Grid>
                            <Typography variant="body1">
                                <Formatter
                                    type="ratio"
                                    data={currentCollateralRatio}
                                    color={status ? 'primary' : 'warning'}
                                />
                            </Typography>
                        </Paper>
                    </Grid>
                );
            })}
            <AddVault onAdd={onAdd} />
        </Grid>
    );
};

export default VaultsList;
