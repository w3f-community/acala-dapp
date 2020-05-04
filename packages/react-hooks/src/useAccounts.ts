import { useContext } from 'react';
import { AccountsData, AccountContext } from '@honzon-platform/react-environment';

/**
 * @name useAccounts
 */
export const useAccounts = (): AccountsData => {
  const data = useContext(AccountContext);

  return data;
};
