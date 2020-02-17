import React from 'react';
import FixedU128, { ROUND_MODE } from '@/utils/fixed_u128';
import { makeStyles, createStyles, Theme } from '@material-ui/core';
import { red, yellow } from '@material-ui/core/colors';

function thousandth(num: number): string {
    const str = String(num);
    const result = str.replace(/(?!^)(?=(\d{3})+\.)/g, ',');
    return result;
}

export function formatBalance(num: FixedU128, suffix = '', dp = 2, rm: ROUND_MODE = 3): string {
    const result = num.toNumber(dp, rm);

    if (Number.isNaN(result)) {
        return '0';
    }

    if (!Number.isFinite(result)) {
        return 'Infinity';
    }

    return `${thousandth(result)} ${suffix}`;
}

export function formatRatio(num: FixedU128, dp = 2, rm: ROUND_MODE = 2): string {
    const result = num.mul(FixedU128.fromNatural(100)).toNumber(dp, rm);

    if (Number.isNaN(result)) {
        return '0';
    }
    if (!Number.isFinite(result)) {
        return 'Infinity';
    }

    return result + '%';
}

export function formatPrice(num: FixedU128, prefix = '', dp = 2, rm: ROUND_MODE = 3): string {
    const result = num.toNumber(dp, rm);
    if (Number.isNaN(result)) {
        return '~';
    }
    if (!Number.isFinite(result)) {
        return '~';
    }
    return `${prefix}${thousandth(result)}`;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        error: {
            color: red[600],
        },
        warning: {
            color: yellow[800],
        },
        primary: {
            color: theme.palette.primary.light,
        },
        normal: {
            color: theme.palette.common.black,
        },
    }),
);

export type FormatterType = 'balance' | 'ratio' | 'price';
export type ColorType = 'error' | 'warning' | 'primary' | 'normal';
export interface FormatterProps {
    data: FixedU128;
    type: FormatterType;
    color?: ColorType;
    prefix?: string;
    suffix?: string;
    dp?: number;
    rm?: ROUND_MODE;
}

const Formatter: React.FC<FormatterProps> = ({ data, type = 'balance', color = 'normal', suffix, prefix, dp, rm }) => {
    const classes = useStyles();
    const render = (value: string) => (
        <span className={classes[(color as any) as keyof typeof classes]}> {value} </span>
    );

    if (type === 'balance') {
        return render(formatBalance(data, suffix, dp, rm));
    }
    if (type === 'ratio') {
        return render(formatRatio(data, dp, rm));
    }
    // price
    return render(formatPrice(data, prefix, dp, rm));
};

export default Formatter;
