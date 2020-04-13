import React, { FC, ReactNode } from 'react';
import { List, ListItem, Typography, Grid } from '@material-ui/core';

import { CurrencyId } from '@acala-network/types/interfaces';

import { QueryBalance } from '@honzon-platform/react-query';
import { useAccounts } from '@honzon-platform/react-hooks';
import { FormatBalance } from './format/';

interface Props {
  tokens: (CurrencyId | string)[];
  currencyRender?: (currency: CurrencyId | string) => ReactNode;
}

const defaultCurencyRender = (currency: CurrencyId | string): ReactNode => {
  return (
    <Grid item xs={3}>
      <Typography>{currency.toString().toUpperCase()}</Typography>
    </Grid>
  );
};

export const Balances: FC<Props> = ({ tokens, currencyRender = defaultCurencyRender }) => {
  const { active } = useAccounts();
  return (
    <List>
      {
        tokens.map((item) => (
          <ListItem key={`balance-${item.toString()}`} disableGutters>
            <Grid container justify="space-between">
              {currencyRender(item)}
              <Grid item xs={3}>
                <QueryBalance
                  account={active!.address}
                  token={item}
                  render={(result) => <FormatBalance balance={result} />}
                />
              </Grid>
            </Grid>
          </ListItem>
        ))
      }
    </List>
  );
};
