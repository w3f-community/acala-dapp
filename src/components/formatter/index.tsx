import React from 'react';
import { Numerical } from '@/types/numerical';

function correct(source: number, base = 12): number {
    return parseFloat(source.toPrecision(base));
}

function format(source: number): number {
    source = correct(source);
    return correct(Math.floor(source * 100) / 100);
}

export function formatBalance(num: number, suffix = ''): string {
    suffix = suffix ? ' ' + suffix : '';
    return `${format(num / 10 ** 18)
        .toString()
        .replace(/(?=(\B\d{3})+(\.\d+)?$)/g, ',')}${suffix}`;
}

export function formatRatio(num: number): string {
    // num / 10**18 * 100
    return format(num / 10 ** 16) + '%';
}

export function formatPrice(num: number, prefix = ''): string {
    return `${prefix}${format(num / 10 ** 18)}`;
}

export type FormatterType = 'balance' | 'ratio' | 'price';

export interface FormatterProps {
    data: Numerical;
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
