import React from 'react';
import FixedU128 from '@/utils/fixed_u128';
import { makeStyles, createStyles, Theme } from '@material-ui/core';
import { red } from '@material-ui/core/colors';

function correct(num: number, base = 12): number {
    return parseFloat(num.toPrecision(base));
}

function format(num: number, precision = 100): number {
    return correct(Math.floor(num * precision) / precision);
}

function thousandth(num: number): string {
    const str = String(num);
    const result = str.replace(/(?!^)(?=(\d{3})+\.)/g, ',');
    return result;
}

export function formatBalance(num: FixedU128, suffix = ''): string {
    const result = format(num.toNumber());

    if (Number.isNaN(result)) {
        return '0';
    }

    if (!Number.isFinite(result)) {
        return 'Infinity';
    }

    return `${thousandth(result)} ${suffix}`;
}

export function formatRatio(num: FixedU128): string {
    const result = format(num.mul(FixedU128.fromNatural(100)).toNumber(), 100);

    if (Number.isNaN(result)) {
        return '0';
    }
    if (!Number.isFinite(result)) {
        return 'Infinity';
    }

    return result + '%';
}

export function formatPrice(num: FixedU128, prefix = ''): string {
    const result = num.toNumber();
    if (Number.isNaN(result)) {
        return '~';
    }
    if (!Number.isFinite(result)) {
        return '~';
    }
    return `${prefix}${thousandth(format(num.toNumber()))}`;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        warning: {
            color: red[600],
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
export type ColorType = 'warning' | 'primary' | 'normal';
export interface FormatterProps {
    data: FixedU128;
    type: FormatterType;
    color?: ColorType;
    prefix?: string;
    suffix?: string;
}

const Formatter: React.FC<FormatterProps> = ({ data, type = 'balance', color = 'normal', suffix, prefix }) => {
    const classes = useStyles();
    const render = (value: string) => (
        <span className={classes[(color as any) as keyof typeof classes]}> {value} </span>
    );

    if (type === 'balance') {
        return render(formatBalance(data, suffix));
    }
    if (type === 'ratio') {
        return render(formatRatio(data));
    }
    // price
    return render(formatPrice(data, prefix));
};

export default Formatter;
