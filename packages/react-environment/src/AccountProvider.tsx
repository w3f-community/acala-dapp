import React, { useState, useEffect, createContext, PropsWithChildren, FC, ReactElement, useCallback } from 'react';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ApiPromise } from '@polkadot/api';

type AccountProviderError = 'NO_EXTENSIONS' | 'NO_ACCOUNTS' | '';

export interface AccountsData {
  active: InjectedAccountWithMeta | null;
  accounts: InjectedAccountWithMeta[];
  error: AccountProviderError;
  ready: boolean;
  setActiveAccount: (
    address: InjectedAccountWithMeta,
    api: ApiPromise
  ) => Promise<void>;
}

export const AccountContext = createContext<AccountsData>({} as AccountsData);

interface Props {
  applicationName: string;
  SelectAccount?: ReactElement;
}

export const AccountProvider: FC<PropsWithChildren<Props>> = ({
  SelectAccount,
  applicationName = 'Honzon Platform',
  children
}) => {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [active, setActive] = useState<InjectedAccountWithMeta | null>(null);
  const [error, setError] = useState<AccountProviderError>('');
  const [ready, setReady] = useState<boolean>(false);

  const loadAccounts = useCallback(async (): Promise<boolean> => {
    const injected = await web3Enable(applicationName);

    if (!injected.length) {
      setError('NO_EXTENSIONS');

      return false;
    }

    const accounts = await web3Accounts();

    if (!accounts.length) {
      setError('NO_ACCOUNTS');

      return false;
    }

    setAccounts(accounts);

    return true;
  }, [applicationName]);

  const setActiveAccount = useCallback(async (account: InjectedAccountWithMeta, api: ApiPromise): Promise<void> => {
    try {
      const injector = await web3FromAddress(account.address);

      api.setSigner(injector.signer);
      setActive(account);
      setReady(true);
    } catch (e) {
      setReady(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  return (
    <AccountContext.Provider
      value={{
        accounts,
        active,
        error,
        ready,
        setActiveAccount
      }}
    >
      {SelectAccount}
      {children}
    </AccountContext.Provider>
  );
};
