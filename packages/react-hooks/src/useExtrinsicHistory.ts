import { useEffect, useRef, useCallback, useState } from 'react';
import { Subject, interval} from 'rxjs';
import axios from 'axios';

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
  success: boolean;
  addon?: any;
  blockNum: number;
  [k: string]: any;
}

function formatHistory (origin: any[]) {
  if (!origin) {
    return [];
  }

  return origin.map((item) => {
    let params = [];

    try {
      params = JSON.parse(item.params);
    } catch(_error) {
      // swallow error
    }

    return {
      hash: item.extrinsic_hash,
      method: item.call_module_function,
      params: params.map((item: any) => item.value),
      section: item.call_module,
      signer: item.account_id,
      time: item.block_timestamp,
      blockNum: item.block_num,
      success: item.success
    };
  });
}

interface Pagination {
  currentPage: number;
  total: number;
  pageSize: number;
}

interface HooksReturnType {
  data: ExtrinsicHistoryData[];
  loading: boolean;
  error: Error | undefined;
  refresh: (delay: number) => void;
  pagination: Pagination;
  onPaginationChagne: (data: Partial<Pagination>) => void;
}

let count = 0;

const refresh$ = new Subject();

// refresh every 30 seconds
interval(1000 * 30).subscribe(() => {
  refresh$.next(count++);
});

const SUBSCAN_TX = 'https://acala-testnet.subscan.io/api/scan/extrinsics';

export const useHistory = (query?: QueryParams): HooksReturnType => {
  const savedQuery = useRef<string>('');
  const paginationRef = useRef<Pagination>({ currentPage: 0, total: 0, pageSize: 10 });
  const [pagination, setPagination] = useState<Pagination>({ currentPage: 0, total: 0, pageSize: 10 });
  const [data, setData] = useState<ExtrinsicHistoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();

  // const { data, loading, error, run } = useRequest({
  //   url: '',
  //   method: 'POST',
  //   manual: true,
  //   data: {
  //   },
  // });

  const fetch = useCallback((pagination: Pagination) => {
    setLoading(true);

    axios.post(SUBSCAN_TX, {
      address: query?.signer,
      call: query?.method,
      module: query?.section,
      page: pagination.currentPage,
      row: pagination.pageSize
    }).then((result) => {
      if (result.status === 200 && result.data.code == 0) {
        setData(formatHistory(result?.data?.data?.extrinsics));
        paginationRef.current.total = result?.data?.data?.count;
        setPagination({ ...paginationRef.current });
      }
    }).catch((error) => {
      // reset ref
      paginationRef.current = { ...pagination };
      setError(error);
    }).finally(() => {
      setLoading(false);
    });
  }, [query]);

  useEffect(() => {
    refresh$.subscribe(() => {
      fetch(pagination);
    });
  }, []);

  useEffect(() => {
    if (!query) {
      return;
    }

    if (savedQuery.current !== JSON.stringify(query)) {
      fetch(paginationRef.current);
      savedQuery.current = JSON.stringify(query);
    }

  }, [query]);

  const onPaginationChagne = useCallback((data: Partial<Pagination>) => {
    paginationRef.current = {
      ...paginationRef.current,
      ...data
    };

    fetch(paginationRef.current);
  }, [setPagination]);

  const refresh = useCallback((delay = 0) => {
    setTimeout(() => {
      refresh$.next(count++);
    }, delay)
  }, []);

  return { data, loading, error, refresh, pagination, onPaginationChagne };
};
