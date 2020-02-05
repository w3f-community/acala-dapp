import React, { ReactNode } from 'react';
import { Typography, Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { createTypography } from '@/theme';

interface Props {
    children: ReactNode;
}

const STypography = withStyles((theme: Theme) => ({
    root: {
        marginBottom: 54,
        ...createTypography(34, 40, 500, 'Roboto', theme.palette.common.black),
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center',
            marginBottom: 26,
            marginTop: 35,
            ...createTypography(17, 20, 500, 'Roboto', theme.palette.common.black),
        },
    },
}))(Typography);

export const Title: React.FC<Props> = ({ children }) => {
    return <STypography>{children}</STypography>;
};
