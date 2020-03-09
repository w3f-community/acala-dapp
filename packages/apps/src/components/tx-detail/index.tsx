import React from 'react';
import { Tx, UpdateLoanData, TransferData } from '@honzon-platform/apps/types/store';
import FixedU128 from '@honzon-platform/apps/utils/fixed_u128';
import { useTranslate } from '@honzon-platform/apps/hooks/i18n';
import { getAssetName, formatAddress, formatHash } from '@honzon-platform/apps/utils';
import { debitToStableCoin } from '@honzon-platform/apps/utils/loan';
import { useSelector } from 'react-redux';
import { specCdpTypeSelector } from '@honzon-platform/apps/store/chain/selectors';
import { formatBalance } from '../formatter';
import { STABLE_COIN } from '@honzon-platform/apps/config';

interface Props {
    data: Tx;
}

const ZERO = FixedU128.fromNatural(0);

const TxDetail: React.FC<Props> = ({ data }) => {
    const { t } = useTranslate();
    const loan = useSelector(specCdpTypeSelector(data.data.asset));

    // swap currency
    if (data.type === 'swapCurrency') {
        return <span>Swap Currency</span>;
    }

    // update loan
    if (data.type === 'updateLoan' && loan) {
        const detail = data.data as UpdateLoanData;
        const assetName = getAssetName(detail.asset);
        const stableCoinName = getAssetName(STABLE_COIN);
        const message: Array<string> = [];
        if (detail.collateral.isGreaterThan(ZERO)) {
            message.push(`${t('Deposit')} ${formatBalance(detail.collateral)} ${assetName}`);
        }
        if (detail.collateral.isLessThan(ZERO)) {
            message.push(`${t('Withdraw')} ${formatBalance(detail.collateral.negated())} ${assetName}`);
        }
        if (detail.debit.isGreaterThan(ZERO)) {
            message.push(
                `${t('Generate')} ${formatBalance(
                    debitToStableCoin(detail.debit, loan.debitExchangeRate),
                )} ${stableCoinName}`,
            );
        }
        if (detail.debit.isLessThan(ZERO)) {
            message.push(
                `${t('Pay Back')} ${formatBalance(
                    debitToStableCoin(detail.debit.negated(), loan.debitExchangeRate),
                )} ${stableCoinName}`,
            );
        }
        return <span>{message.join(', ')}</span>;
    }

    if (data.type === 'transfer') {
        const detail = data.data as TransferData;
        const assetName = getAssetName(detail.asset);
        const amount = detail.amount.toNumber(2, 2);
        return (
            <div>
                <p>{`To ${formatHash(detail.account)}`}</p>
                <p>{`Transfer ${amount} ${assetName}`}</p>
            </div>
        );
    }

    console.warn('unsupport tx type, please update tx-detail component');
    return <span></span>;
};

export default TxDetail;
