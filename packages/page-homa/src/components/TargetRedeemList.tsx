import React, { FC, useContext } from 'react';
import { StakingPoolContext } from '@honzon-platform/react-components';
import { useApi } from '@honzon-platform/react-hooks';
import { Dropdown, DropdownConfig } from '@honzon-platform/ui-components';
import { BareProps } from '@honzon-platform/ui-components/types';

interface Props extends BareProps {
  value: number;
  onChange: (value: number) => {};
}

export const TargetRedeemList: FC<Props> = ({
  className,
  value,
  onChange
}) => { 
  const { stakingPool, freeList } = useContext(StakingPoolContext);
  if (!stakingPool.bondingDuration) {
    return null;
  }

  const config: DropdownConfig[] = freeList.map(({ era, free}) => {
    return {
      value: era,
      render: () => (
        <div>
          Era: {era}, Free to Redeem: {free}
        </div>
      )
    };
  });

  return (
    <Dropdown
      config={config}
      className={className}
      value={value}
      size='small'
      onChange={onChange}
    />
  );
};
