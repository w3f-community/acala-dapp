import { useContext } from 'react';
import { AccountsData, AccountContext } from '@acala-dapp/react-environment';

/**
 * @name useAccounts
 */
export const useAccounts = (): AccountsData => {
  const data = useContext(AccountContext);

  return data;
};
