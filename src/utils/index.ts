import { assets } from '@/config';

export function getAssetName(id: number): string {
    const result = assets.get(id);
    return result ? result.name : '';
}

export function getAssetIcon(id: number): string {
    const result = assets.get(id);
    return result && result.icon ? result.icon : '';
}

export function u8aToNumber(value: any, radix = 10): number {

    // None -> 0,
    if (value.isNone) {
        return 0;
    }

    // should not use bn.js toNumber method, because toNumber return a JS Number limited 2^53-1;
    const result = parseInt(value.toString(), radix);

    // NaN -> 0
    if (Number.isNaN(result)) {
        return 0;
    }

    return result;
}
