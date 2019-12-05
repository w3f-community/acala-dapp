import React from 'react';
import { Numerical } from '@/types/numerical';

export function formatBalance(num: number, suffix = ''): string {
    suffix = suffix ? ' ' + suffix : '';
    return `${num.toString().replace(/(?=(\B\d{3})+(\.\d+)?$)/g, ',')}${suffix}`;
}

export function formatRatio(num: number): string {
    return num * 100 + '%';
}

export function formatPrice(num: number, prefix = ''): string {
    return `${prefix}${num}`;
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
