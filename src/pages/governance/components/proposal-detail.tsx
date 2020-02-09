import React, { FC } from 'react';
import { ProposalData } from '@/types/store';
import FixedU128 from '@/utils/fixed_u128';

interface Props {
    data: ProposalData;
}
export const ProposalDetail: FC<Props> = ({ data }) => {
    const { proposal } = data;
    if (proposal.method.name === 'set_collateral_params') {
        return (
            <>
                <p>Set {proposal.args.currency_id.toUpperCase()} CDP Parameters:</p>
                {proposal.args.stability_fee ? (
                    <p>Stable Fee To {FixedU128.fromParts(parseInt(proposal.args.stability_fee, 16)).toNumber()}</p>
                ) : null}
                {proposal.args.liquidation_penalty ? (
                    <p>
                        Liquidation Penalty To{' '}
                        {FixedU128.fromParts(parseInt(proposal.args.liquidation_penalty, 16)).toNumber()}
                    </p>
                ) : null}
                {proposal.args.liquidation_ratio ? (
                    <p>
                        Liquidation Ratio To{' '}
                        {FixedU128.fromParts(parseInt(proposal.args.liquidation_ratio, 16)).toNumber()}
                    </p>
                ) : null}
                {proposal.args.required_collateral_ratio ? (
                    <p>
                        Required Collateral Ratio To{' '}
                        {FixedU128.fromParts(parseInt(proposal.args.required_collateral_ratio, 16)).toNumber()}
                    </p>
                ) : null}
                {proposal.args.maximum_total_debit_value ? (
                    <p>
                        Maximum Total Debit Value To{' '}
                        {FixedU128.fromParts(parseInt(proposal.args.maximum_total_debit_value, 16)).toNumber()}
                    </p>
                ) : null}
            </>
        );
    }
    return null;
};
