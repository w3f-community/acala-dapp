import React, { useEffect } from 'react';
import { Grid, Paper, Typography, Box } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import clsx from 'clsx';

import add from '@/assets/add.svg';
import { Vault } from '../../index.types';
import { getAssetName } from '@/utils';
import { useDispatch } from 'react-redux';

const useStyle = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        cardRoot: {
            flexShrink: 0,
            width: 120,
            height: 100,
        },
        cardContent: {
            width: '100%',
            height: '100%',
            padding: '16px 16px 8px',
            cursor: 'pointer',
        },
        addContent: {
            '& .MuiTypography-h6': {
                marginTop: 8,
                fontWeight: 400,
            },
        },
    }),
);

const AddVault: React.FC<Pick<Props, 'onAdd'>> = ({ onAdd }) => {
    const classes = useStyle();
    return (
        <Grid item onClick={onAdd}>
            <Paper elevation={2} className={classes.cardRoot} square={true}>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    className={clsx(classes.addContent, classes.cardContent)}
                >
                    <img src={add} />
                    <Typography variant="h6">Add Wallet</Typography>
                </Grid>
            </Paper>
        </Grid>
    );
};

interface Props {
    vaults: Vault[];
    onAdd: () => void;
}

const VaultsList: React.FC<Props> = ({ vaults, onAdd }) => {
    const classes = useStyle();
    const dispatch = useDispatch();
    return (
        <Grid container spacing={3}>
            {vaults.map((item: Vault) => (
                <Grid item key={`vault-type-${item.asset}`}>
                    <Paper elevation={2} className={classes.cardRoot} square={true}>
                        <Grid container direction="column" justify="space-between" className={classes.cardContent}>
                            <Typography variant="h6">{getAssetName(item.asset)}</Typography>
                            <Typography variant="body1">{item.liquidationRatio}%</Typography>
                        </Grid>
                    </Paper>
                </Grid>
            ))}
            <AddVault onAdd={onAdd} />
        </Grid>
    );
};

export default VaultsList;
