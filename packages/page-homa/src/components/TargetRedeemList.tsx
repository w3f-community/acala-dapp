import React, { FC, useContext } from 'react';
import { StakingPoolContext, formtDuration } from '@honzon-platform/react-components';
import { Dropdown, DropdownConfig } from '@honzon-platform/ui-components';
import { BareProps } from '@honzon-platform/ui-components/types';
import classes from './TargetRedeemList.module.scss';
import { Fixed18 } from '@acala-network/app-util';

interface Props extends BareProps {
  value: number;
  onChange: (value: number) => void;
}

export const TargetRedeemList: FC<Props> = ({
  className,
  onChange,
  value
}) => {
  const { freeList, stakingPool, stakingPoolHelper } = useContext(StakingPoolContext);

  if (!stakingPool.bondingDuration) {
    return null;
  }

  const config: DropdownConfig[] = freeList.map(({ era, free }) => {
    return {
      value: era,
      render: () => (
        <div>
          At Era: {era} ≈ {formtDuration(era)}, Free to Redeem: {Fixed18.fromNatural(free).div(stakingPoolHelper.liquidExchangeRate)}
        </div>
      )
    };
  });

  return (
    <Dropdown
      className={className}
      config={config}
      menuClassName={classes.menu}
      onChange={onChange}
      selectedRender={(era) => era}
      size='small'
      value={value}
    />
  );
};
