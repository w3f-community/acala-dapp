import React from 'react';
import { Tx, UpdateVaultData } from '@/types/store';
import FixedU128 from '@/utils/fixed_u128';
import { useTranslate } from '@/hooks/i18n';
import { getAssetName } from '@/utils';
import { debitToStableCoin } from '@/utils/vault';
import { useSelector } from 'react-redux';
import { specCdpTypeSelector } from '@/store/chain/selectors';
import { formatBalance } from '../formatter';
import { STABLE_COIN } from '@/config';

interface Props {
    data: Tx;
}

const ZERO = FixedU128.fromNatural(0);

const TxDetail: React.FC<Props> = ({ data }) => {
    const { t } = useTranslate();
    const vault = useSelector(specCdpTypeSelector(data.data.asset));

    if (!vault) {
        return null;
    }

    // swap currency
    if (data.type === 'swapCurrency') {
        return <span>hello</span>;
    }

    // update vault
    if (data.type === 'updateVault') {
        const detail = data.data as UpdateVaultData;
        const assetName = getAssetName(detail.asset);
        const stableCoinName = getAssetName(STABLE_COIN);
        const message: Array<string> = [];
        if (detail.collateral.isGreaterThan(ZERO)) {
            message.push(`${t('deposit')} ${formatBalance(detail.collateral)} ${assetName}`);
        }
        if (detail.collateral.isLessThan(ZERO)) {
            message.push(`${t('withdraw')} ${formatBalance(detail.collateral.negated())} ${assetName}`);
        }
        if (detail.debit.isGreaterThan(ZERO)) {
            message.push(
                `${t('generate')} ${formatBalance(
                    debitToStableCoin(detail.debit, vault.debitExchangeRate),
                )} ${stableCoinName}`,
            );
        }
        if (detail.debit.isLessThan(ZERO)) {
            message.push(
                `${t('payback')} ${formatBalance(
                    debitToStableCoin(detail.debit.negated(), vault.debitExchangeRate),
                )} ${stableCoinName}`,
            );
        }
        return <span>{message.join(', ')}</span>;
    }

    console.warn('unsupport tx type, please update tx-detail component');
    return <span>hello</span>;
};

export default TxDetail;
