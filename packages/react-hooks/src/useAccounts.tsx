import { useState, useEffect } from 'react';
import { defer, Observable, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useApi } from './useApi';

// account manager
class Account {
  public accountSubject: Subject<InjectedAccountWithMeta>;
  public activeAccount$: Observable<InjectedAccountWithMeta>;
  public accounts$: Observable<InjectedAccountWithMeta[]>;

  constructor (title: string) {
    this.accounts$ = defer(async () => {
      const injected = await web3Enable(title);

      if (!injected.length) {
        throw new Error('extension error');
      }

      const accounts = await web3Accounts();

      return accounts;
    }).pipe(shareReplay());
    this.accountSubject = new Subject<InjectedAccountWithMeta>();
    this.activeAccount$ = this.accountSubject.pipe(shareReplay());
  }

  setActiveAccount (account: InjectedAccountWithMeta): boolean {
    this.accountSubject.next(account);

    return true;
  }
}

// account manager instance
const account = new Account('Acala Honzon Platform');

interface ReturnData {
  accounts: InjectedAccountWithMeta[];
  activeAccount: InjectedAccountWithMeta | undefined;
  accountError: boolean;
  extensionError: boolean;
  ready: boolean;
  readLocalAccount: () => void;
  setActiveAccount: (address: string) => Promise<boolean>;
}

/**
 * @name useAccounts
 * @description useAccounts hook will get accounts information from @polkadot/extension
 */
export const useAccounts = (): ReturnData => {
  const [activeAccount, _setActiveAccount] = useState<InjectedAccountWithMeta>();
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [extensionError, setExtensionError] = useState<boolean>(false);
  const [accountError, setAccountError] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const api = useApi();

  // set active account
  const setActiveAccount = async (address: string): Promise<boolean> => {
    const data = accounts.find((account) => account.address === address);

    if (!data) {
      setAccountError(true);

      return false;
    } else {
      const injector = await web3FromAddress(data.address);

      api.setSigner(injector.signer);
      account.setActiveAccount(data);
    }

    return true;
  };

  const readLocalAccount = (): void => {
    const defaultAddress = window.localStorage.getItem('default_account');

    if (defaultAddress) {
      setActiveAccount(defaultAddress);
    }
  };

  const loadAccounts = (): () => void => {
    const accountsSubscription = account.accounts$.subscribe(
      (accounts: InjectedAccountWithMeta[]) => {
        setAccounts(accounts);
        setReady(true);
      },
      () => {
        setExtensionError(true);
      }
    );
    // subscribe new active account
    const activeAccountSubscription = account.activeAccount$.subscribe((account: InjectedAccountWithMeta) => {
      if (account) {
        _setActiveAccount(account);
      }
    });

    return (): void => {
      accountsSubscription.unsubscribe();
      activeAccountSubscription.unsubscribe();
    };
  };

  // read account from extension
  useEffect(() => {
    loadAccounts();
  }, []);

  return {
    accountError,
    accounts,
    activeAccount,
    extensionError,
    readLocalAccount,
    ready,
    setActiveAccount
  };
};
