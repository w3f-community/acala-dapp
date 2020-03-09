import { assets as defaultAssets } from '@honzon-platform/apps/config';
import { Account } from '@honzon-platform/apps/types/store';

export function getAssetName(id: number, assets = defaultAssets): string {
    const result = assets.get(id);
    return result ? result.name : '';
}

export function getAssetIcon(id: number, assets = defaultAssets): string {
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

export function formatAddress(account: Account | string | null, length = 8, suffix = '...'): string {
    let address = '';
    if (typeof account === 'string') {
        address = account;
    }
    if (typeof account === 'object' && account) {
        address = account.address;
    }
    return address.slice(0, length) + suffix;
}

export function formatHash(hash: string): string {
    return hash.replace(/^(.{6}).*?(.{7})$/, '$1.....$2');
}
