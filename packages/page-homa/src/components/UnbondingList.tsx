import React, { FC, useContext, memo } from 'react';
import { StakingPoolContext } from '@honzon-platform/react-components';
import { List, ListItem, Grid, Typography, Radio } from '@material-ui/core';
import { useCall, useApi } from '@honzon-platform/react-hooks';
import { Codec } from '@polkadot/types/types';
import { Fixed18 } from '@acala-network/app-util';

interface UnbondingItemProps {
  era: number;
  selected: number;
  onChange: (value: number) => {};
}

const UnbondingItem: FC<UnbondingItemProps> = ({ selected, era, onChange }) => {
  const { api } = useApi();
  const result = useCall<[Codec, Codec]>(api.query.stakingPool.unbonding, [era]);
  const _onChange = () => {
    onChange(era);
  }
  if (!result) {
    return null;
  }
  const free = Fixed18.fromParts(result[0].toString()).sub(Fixed18.fromParts(result[1].toString()));
  return (
    <ListItem>
      <Grid container justify="space-between">
        <Grid item>
          <Grid container alignItems="center">
            <Radio name="era" checked={era === selected} onChange={_onChange} />
            <Typography variant="body2">{era}</Typography>
          </Grid>
        </Grid>
        <Typography variant="body2">{free.toNumber()}</Typography>
      </Grid>
    </ListItem>
  );
};

interface Props {
  selected: number;
  onChange: (value: number) => {}
}
export const UnbondingList: FC<Props> = ({ selected, onChange }) => {
  const { stakingPool } = useContext(StakingPoolContext);
  const stakingCurrencyName = stakingPool.stakingCurrency.toString().toUpperCase();
  const currentEra = stakingPool.currentEra.toNumber();
  const eraArray = new Array(14).fill(undefined).map((_i, index) => currentEra + index + 1);

  return (
    <List style={{width: '50%'}}>
      <ListItem>
        <Grid container justify="space-between">
          <Typography variant="body2">ERA</Typography>
          <Typography variant="body2">{`Free ${stakingCurrencyName}`}</Typography>
        </Grid>
      </ListItem>
      {
        eraArray.map(era => (
          <UnbondingItem era={era} selected={selected} onChange={onChange} />
        ))
      }
    </List>
  );
};
