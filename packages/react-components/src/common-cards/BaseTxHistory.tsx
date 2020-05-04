import React, { FC, useEffect, useState } from 'react';
import { Card, Table, TableItem } from '@honzon-platform/ui-components';
import { useHistory, useAccounts } from '@honzon-platform/react-hooks';

interface Props {
  section: string;
  method: string;
}

export const BaseTxHistory: FC<Props> = ({
  section,
  method
}) => {
  const { active } = useAccounts();
  const { getHistory } = useHistory();
  const [result, setResult] = useState<any[]>([]);

  useEffect(() => {
    if (active) {
      getHistory({
        section,
        method,
        signer: active.address
      }, (result) => {
        console.log(result);
        setResult(result);
      })
    }
  }, [active]);

  const tableConfig: TableItem[] = [
    {
      key: 'tx',
      title: 'Tx Hash',
      render: (data) => {
        return data.hash
      }
    }
  ]
  return (
    <Card header='Transation'>
      <Table
        config={tableConfig}
        data={result}
        showHeader
      />
    </Card>
  );
}