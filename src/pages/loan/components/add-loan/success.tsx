import React from 'react';
import {
    withStyles,
    Grid,
    Paper,
    Button,
    Theme,
    Typography,
    createStyles,
    makeStyles,
    IconButton,
} from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import CloseIcon from '@/components/svgs/close';
import Loan from '@/components/svgs/loan';
import { createTypography } from '@/theme';
import { useForm } from '@/hooks/form';
import { formContext } from './context';

const Card = withStyles(() => ({
    root: { padding: '20px 54px 64px 54px' },
}))(Paper);

const Title = withStyles((theme: Theme) => ({
    root: {
        marginTop: theme.spacing(6),
        ...createTypography(17, 24, 500, 'Roboto', theme.palette.primary.light),
    },
}))(Typography);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        img: {
            margin: theme.spacing(8),
            width: '100%',
            maxWidth: 330,
        },
    }),
);

interface Props {
    onCancel: () => void;
    onConfirm: (asset: number) => void;
}

const Success: React.FC<Props> = ({ onConfirm, onCancel }) => {
    const { t } = useTranslate();
    const { data } = useForm(formContext);
    const classes = useStyles();

    const handleClick = () => {
        onConfirm(data.asset.value);
    };

    return (
        <Card square={true} elevation={1}>
            <Grid container justify="flex-end" onClick={handleClick}>
                <IconButton>
                    <CloseIcon />
                </IconButton>
            </Grid>
            <Grid container justify="center" alignItems="center" direction="column">
                <Title>{t('Your loan is created, and aUSD is generated!')}</Title>
                <Loan className={classes.img} />
                <Button variant="contained" color="primary" onClick={handleClick}>
                    DONE
                </Button>
            </Grid>
        </Card>
    );
};

export default Success;
