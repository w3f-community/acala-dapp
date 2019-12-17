import { assets } from '@/config';

export function getAssetName(id: number): string {
    const result = assets.get(id);
    return result ? result.name : '';
}

export function getAssetIcon(id: number): string {
    const result = assets.get(id);
    return result && result.icon ? result.icon : '';
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
