import React from 'react';
import FixedU128 from '@/utils/fixed_u128';

function correct(source: number, base = 12): number {
    return parseFloat(source.toPrecision(base));
}

function format(source: number): number {
    source = correct(source);
    return correct(Math.floor(source * 1000000) / 1000000);
}

export function formatBalance(num: FixedU128, suffix = ''): string {
    const result = format(num.toNumber());

    if (Number.isNaN(result)) {
        return '0';
    }

    if (!Number.isFinite(result)) {
        return 'Infinity';
    }

    return `${result} ${suffix}`;
}

export function formatRatio(num: FixedU128): string {
    const result = format(num.mul(FixedU128.fromNatural(100)).toNumber());

    if (Number.isNaN(result)) {
        return '0';
    }
    if (!Number.isFinite(result)) {
        return 'Infinity';
    }

    return result + '%';
}

export function formatPrice(num: FixedU128, prefix = ''): string {
    return `${prefix}${format(num.toNumber())}`;
}

export type FormatterType = 'balance' | 'ratio' | 'price';

export interface FormatterProps {
    data: FixedU128;
    type: FormatterType;
    prefix?: string;
    suffix?: string;
}

const Formatter: React.FC<FormatterProps> = ({ data, type = 'balance', suffix, prefix }) => {
    if (type === 'balance') {
        return <span>{formatBalance(data, suffix)}</span>;
    }
    if (type === 'ratio') {
        return <span>{formatRatio(data)}</span>;
    }
    if (type === 'price') {
        return <span>{formatPrice(data, prefix)}</span>;
    }
    return <span>{data}</span>;
};

export default Formatter;
