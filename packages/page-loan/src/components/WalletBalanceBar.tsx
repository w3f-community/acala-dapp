import React, { FC } from 'react';
import { Card } from '@honzon-platform/ui-components';
import { useApi } from '@honzon-platform/react-hooks';
import { getAllCurrencyIds, Token, UserBalance } from '@honzon-platform/react-components';
import classes from './WalletBalanceBar.module.scss';

export const WalletBalanceBar: FC = () => {
  const { api } = useApi();
  const allToken = getAllCurrencyIds(api);

  return (
    <Card
      className={classes.root}
      header='Wallet Balance'
      headerClassName={classes.header}
    >
      <ul className={classes.content}>
        {
          allToken.map((item) => {
            return (
              <li className={classes.item}>
                <div className={classes.token}>
                  <Token
                    token={item}
                    icon={false}
                  />
                  <span>(</span>
                  <UserBalance
                    token={item}
                    withIcon={false}
                  />
                  <span>)</span>
                </div>
                <div className={classes.amount}>
                  <UserBalance
                    token={item}
                    withPrice
                  />
                </div>
              </li>
            );
          })
        }
      </ul>
    </Card>
  );
};