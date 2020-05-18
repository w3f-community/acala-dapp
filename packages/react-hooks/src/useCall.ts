import { get } from 'lodash';
import { CallOptions, CallParams } from './types';

import { useEffect, useContext, useMemo } from 'react';

import { useIsAppReady } from './useIsAppReady';
import { globalStoreContext } from '@honzon-platform/react-environment';
import { useApi } from './useApi';
import { ApiPromise } from '@polkadot/api';

class Tracker {
  private trackerList: {[k in string]: { refCount: number, subscriber: () => Promise<void> }}

  constructor() {
    this.trackerList = {};
  }

  subscribe (api: ApiPromise, path: string, params: CallParams, key: string, updateFn: (key: string, valeu: any) => void) {
    if (!api || !path) {
      return
    }

    if (this.trackerList[key]) {
      this.trackerList[key].refCount += 1;

      return;
    }

    const fn = get(api, path);

    if (!fn) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore We tried to get the typings right, close but no cigar...
    const subscriber = fn(...params, (result) => {
      updateFn(key, result);
    });

    this.trackerList[key] = {
      refCount: 1,
      subscriber,
    };
  }

  unSubscribe (key: string) {
    if (this.trackerList[key]) {
      this.trackerList[key].refCount -= 1;
    }
  }
}

const tracker = new Tracker();

export function useCall <T> (path: string, params: CallParams = [], options: CallOptions<T> = {}): T | undefined {
  const { api } = useApi();
  const { appReadyStatus } = useIsAppReady();
  const { store, setStore } = useContext(globalStoreContext);
  const key = useMemo(() => `${path}${params.toString() ? '-' + params.toString() : ''}`, [path, params]);

  // on changes, re-subscribe
  useEffect(() => {
    // check if we have a function & that we are mounted
    if (appReadyStatus) {
      tracker.subscribe(api, path, params, key, setStore);
    }
    return () => {
      tracker.unSubscribe(key)
    };
  }, [appReadyStatus, api, path, params, key, setStore]);

  return store[key];
}
