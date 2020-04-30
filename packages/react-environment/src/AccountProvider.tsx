import React, { useState, useEffect, createContext, PropsWithChildren, FC, ReactElement, useCallback, memo, ReactNode } from 'react';

import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { useModal, useApi, useStorage } from '@honzon-platform/react-hooks';
import { SelectAccount } from '@honzon-platform/react-components';
import { BareProps } from '@honzon-platform/ui-components/types';

type AccountProviderError = 'NO_EXTENSIONS' | 'NO_ACCOUNTS' | '';
const ACTIVE_ACCOUNT_KEY = 'active-account';

export interface AccountsData {
  active: InjectedAccountWithMeta | null;
  accounts: InjectedAccountWithMeta[];
  error: AccountProviderError;
  ready: boolean;
  openSelectAccount: () => void;
  closeSelectAccount: () => void;
}

export const AccountContext = createContext<AccountsData>({} as AccountsData);

interface Props extends BareProps {
  applicationName: string;
  NoAccounts?: ReactNode;
  NoExtensions?: ReactNode;
}

export const AccountProvider: FC<Props> = memo(({
  applicationName = 'Honzon Platform',
  children,
  NoAccounts,
  NoExtensions
}) => {
  const { api } = useApi();
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [active, setActive] = useState<InjectedAccountWithMeta | null>(null);
  const [error, setError] = useState<AccountProviderError>('');
  const [ready, setReady] = useState<boolean>(false);
  const { getStorage, setStorage } = useStorage({ useAccountPrefix: false });
  const { open, close, status } = useModal(false);

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

  const setActiveAccount = async (account: InjectedAccountWithMeta): Promise<void> => {
    try {
      const injector = await web3FromAddress(account.address);
      api.setSigner(injector.signer);
      setActive(account);
      setReady(true);
      setStorage(ACTIVE_ACCOUNT_KEY, account.address);
    } catch (e) {
      setReady(false);
    }
  };

  const openSelectAccount = (): void => {
    open();
  };

  const closeSelectAccount = (): void => {
    close();
  };

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  useEffect(() => {
    if (!accounts.length || active) {
      return
    }

    // check saved active account
    const savedActiveAccountAddress = getStorage(ACTIVE_ACCOUNT_KEY);
    const savedActiveAccount = accounts.find((item): boolean => item.address === savedActiveAccountAddress);

    if (savedActiveAccount) {
      setActiveAccount(savedActiveAccount);
    } else if (accounts.length === 1){
      setActiveAccount(accounts[0]);
    } else {
      openSelectAccount();
    }
  }, [accounts]);

  const handleAccountSelect = (account: InjectedAccountWithMeta) => {
    setActiveAccount(account);
    closeSelectAccount();
  };

  const renderError = (): ReactNode => {
    if (error && error === 'NO_ACCOUNTS' && NoAccounts) {
      return NoAccounts;
    }

    if (error && error === 'NO_EXTENSIONS' && NoAccounts) {
      return NoExtensions;
    }

    return null;
  };

  return (
    <AccountContext.Provider
      value={{
        accounts,
        active,
        error,
        ready,
        openSelectAccount,
        closeSelectAccount
      }}
    >
      <SelectAccount
        accounts={accounts}
        visable={status}
        onSelect={handleAccountSelect}
      />
      {children}
      {renderError()}
    </AccountContext.Provider>
  );
});

AccountProvider.displayName = 'AccountProvider';
