import { SubmittableExtrinsic } from '@polkadot/api/types';
import { isEqual } from 'lodash';
import { useEffect, useState, useRef } from 'react';
import { Subject, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import Dexie from 'dexie';

interface QueryParams {
  method: string | string[];
  section: string;
  signer: string;
  [k: string]: string | string[];
}

export interface ExtrinsicHistoryData {
  hash: string;
  method: string;
  section: string;
  params: string[];
  signer: string;
  time: Date;
  [k: string]: any;
  addon?: any; }

class ExtrinsicHistoryCenter extends Dexie {
  private history: Dexie.Table<ExtrinsicHistoryData, string>;
  private event$: Subject<number>;
  private count: number;

  constructor () {
    super('extrinsic_2');
    this.version(2).stores({
      history: 'hash, method, section, params, signer'
    });
    this.history = this.table('history');
    this.event$ = new Subject();
    this.count = 0;
  }

  push (hash: string, tx: SubmittableExtrinsic<'promise'>, addon?: any) {
    this.history.add({
      hash: hash,
      method: tx.method.methodName,
      params: tx.method.args.toString().split(','),
      section: tx.method.sectionName,
      signer: tx.signer.toString(),
      time: new Date(),
      addon: addon
    });
    this.event$.next(this.count++);
  }

  async query (params: QueryParams): Promise<ExtrinsicHistoryData[]> {
    if (!params) {
      return [];
    }

    return await this.history.filter((item) => {
      let flag = true;

      Object.keys(params).forEach((key) => {
        if (Array.isArray(params[key])) {
          flag = flag && (params[key] as string[]).findIndex((i): boolean => i === item.method) !== -1;
        } else {
          flag = flag && params[key] as string === item[key];
        }
      });

      return flag;
    }).reverse().sortBy('time');
  }

  watch (callback: () => void): Subscription {
    return this.event$.pipe(
      startWith(-1)
    ).subscribe(() => callback());
  }
}

const extrinsicHistoryCenter = new ExtrinsicHistoryCenter();

interface HooksReturnType {
  push: (hash: string, tx: SubmittableExtrinsic<'promise'>, addon?: any) => void;
  result: ExtrinsicHistoryData[];
}

export const useHistory = (query?: QueryParams): HooksReturnType => {
  const [result, _setResult] = useState<ExtrinsicHistoryData[]>([]);
  const _savedQuery = useRef<QueryParams | undefined>();

  const push = (hash: string, tx: SubmittableExtrinsic<'promise'>, addon?: any): void => {
    extrinsicHistoryCenter.push(hash, tx, addon);
  };

  useEffect(() => {
    if (query && !isEqual(_savedQuery.current, query)) {
      extrinsicHistoryCenter.watch(async () => {
        const result = await extrinsicHistoryCenter.query(query);
        _setResult(result);
      });

      _savedQuery.current = query;
    }
  }, [query]);

  return {
    push,
    result
  };
};
