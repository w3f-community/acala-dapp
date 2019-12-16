import { assets } from '@/config';
import BN from 'bn.js';

export function getAssetName(id: number): string {
    return assets.get(id) || '';
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
    if (Number.isNaN(result)) {
        return 0;
    }

    return result;
}
