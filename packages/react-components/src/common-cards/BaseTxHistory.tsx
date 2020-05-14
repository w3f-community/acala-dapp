import React, { FC, useMemo } from 'react';
import { Card, Table, TableItem } from '@honzon-platform/ui-components';
import { useHistory, useAccounts, ExtrinsicHistoryData } from '@honzon-platform/react-hooks';
import Pagination from '@material-ui/lab/Pagination';

import classes from './BaseTxHistory.module.scss';
import { Box } from '@material-ui/core';

interface Props {
  section: string;
  method: string | string[];
  config?: TableItem<any>[];
}

const defaultTableConfig: TableItem<ExtrinsicHistoryData>[] = [
  {
    key: 'tx',
    title: 'Tx Hash',
    render: (data) => {
      return data.hash;
    }
  }
];

export const BaseTxHistory: FC<Props> = ({
  config = defaultTableConfig,
  method,
  section
}) => {
  const { active } = useAccounts();

  const { data, loading, error, pagination, onPaginationChagne } = useHistory({
    method,
    section,
    signer: active ? active.address : ''
  });

  const count = useMemo(() => {
    return Math.ceil(pagination.total / pagination.pageSize);
  }, [pagination]);

  const handlePaginationChagne = (_event: any, page: number) => {
    onPaginationChagne({ currentPage: page - 1 });
  }

  return (
    <Card
      padding={false}
      header='Transaction'
      className={classes.root}
    >
      <Table
        loading={loading}
        config={config}
        data={data}
        showHeader
        empty={ error ? 'Service Error' : 'No Tx History' }
      />
      <Box
        className={classes.pagination}
        display='flex'
        justifyContent='flex-end'
      >
        <Pagination
          page={pagination.currentPage + 1}
          count={count}
          shape="rounded"
          onChange={handlePaginationChagne}
        />
      </Box>
    </Card>
  );
};
