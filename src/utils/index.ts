import { assets } from '@/config';

function getAssetName(id: number): string {
    return assets.get(id) || '';
}

export { getAssetName };
