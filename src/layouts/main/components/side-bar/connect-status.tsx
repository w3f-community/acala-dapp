import React from 'react';
import { FormControlLabel, Switch, createStyles, makeStyles, Theme } from '@material-ui/core';
import { createTypography } from '@/theme';
import { useSelector } from 'react-redux';
import { connectedSelector } from '@/store/chain/selectors';

const useFormControlStyles = makeStyles((theme: Theme) =>
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
            ...createTypography(17, 20, 400, 'Roboto', theme.palette.common.white),
        },
    }),
);

const DEFAULT_SWITCH_COLOR = '#616161';
const useSwitchStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: 58,
            height: 34,
            padding: 0,
            margin: theme.spacing(1),
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
            border: `4px solid ${DEFAULT_SWITCH_COLOR}`,
            background: DEFAULT_SWITCH_COLOR,
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
);

const ConnectStatus: React.FC = () => {
    const formControlClasses = useFormControlStyles();
    const switchClasses = useSwitchStyles();
    const connected = useSelector(connectedSelector);

    const handleConnect = () => {
        // TODO
    };

    return (
        <FormControlLabel
            control={<Switch classes={switchClasses} checked={connected} color="default" onChange={handleConnect} />}
            label={connected ? 'Connected' : 'Connect'}
            labelPlacement="start"
            classes={formControlClasses}
        />
    );
};

export default ConnectStatus;
