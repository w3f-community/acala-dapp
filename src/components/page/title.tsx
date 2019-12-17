import React, { ReactNode } from 'react';
import { Typography, Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { createTypography } from '@/theme';

interface Props {
    children: ReactNode;
}

const STypography = withStyles((theme: Theme) => ({
    root: {
        paddingTop: 123,
        paddingBottom: 38,
        ...createTypography(34, 40, 700, 'Roboto', theme.palette.common.black),
    },
}))(Typography);

const Title: React.FC<Props> = ({ children }) => {
    return <STypography>{children}</STypography>;
};

export default Title;
