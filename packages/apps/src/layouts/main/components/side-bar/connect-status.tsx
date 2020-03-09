import React from 'react';
import { FormControlLabel, Switch, createStyles, Theme, withStyles } from '@material-ui/core';
import { createTypography } from '@honzon-platform/apps/theme';
import { useSelector } from 'react-redux';
import { connectedSelector } from '@honzon-platform/apps/store/chain/selectors';

const ConnectFormControl = withStyles((theme: Theme) =>
    createStyles({
        root: {
            width: 162,
            justifyContent: 'space-between',
        },
        labelPlacementStart: {
            margin: 0,
        },
        label: {
            color: theme.palette.common.white,
            ...createTypography(17, 20, 500, 'Roboto', theme.palette.common.white),
        },
    }),
)(FormControlLabel);

const ConnectSwitch = withStyles((theme: Theme) =>
    createStyles({
        root: {
            width: 58,
            height: 34,
            padding: 0,
        },
        switchBase: {
            padding: 5,
            '&$checked': {
                '& + $track': {
                    backgroundColor: theme.palette.primary.light,
                },
            },
        },
        track: {
            borderRadius: 34 / 2,
            border: `4px solid ${theme.palette.primary.light}`,
            background: theme.palette.primary.light,
            opacity: 1,
        },
        thumb: {
            width: 24,
            height: 24,
        },
        checked: {
            '& + $track': {
                opacity: 1,
            },
        },
    }),
)(Switch);

const ConnectStatus: React.FC = () => {
    const connected = useSelector(connectedSelector);

    const handleConnect = () => {
        // TODO
    };

    return (
        <ConnectFormControl
            control={<ConnectSwitch checked={connected} color="default" onChange={handleConnect} />}
            label={connected ? 'Connected' : 'Connect'}
            labelPlacement="start"
        />
    );
};

export default ConnectStatus;
