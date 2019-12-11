import { assets } from '@/config';

export function getAssetName(id: number): string {
    return assets.get(id) || '';
}

export function getBalance(source: number): number {
    if (!source) {
        return 0;
    }
    return source * 10 ** 15;
}

export function getMaxBorrow(): number {
    return 0;
}

export function u8aToNumber(value: any, radix = 10): number {
    // None -> 0
    if (value.isNone) {
        return 0;
    }

    const result = parseInt(value.toString(), radix);

    // NaN -> 0
    if (result === NaN) {
        return 0;
    }

    return result;
}
