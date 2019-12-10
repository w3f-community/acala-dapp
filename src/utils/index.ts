import { assets } from '@/config';

export function getAssetName(id: number): string {
    return assets.get(id) || '';
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
