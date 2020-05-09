import React, { FC } from 'react';
import { Card, Table, TableItem } from '@honzon-platform/ui-components';
import { useCouncilMembers } from '@honzon-platform/react-hooks';
import AccountId from '@polkadot/types/generic/AccountId';
import { FormatAddress } from '@honzon-platform/react-components';

interface Props {
  council: string;
}
export const CouncilMembers: FC<Props> = ({ council }) => {
  const members = useCouncilMembers(council);

  const tableConfig: TableItem<any>[] = [
    {
      align: 'left',
      title: 'Account',
      render: (account: AccountId) => {
        return (
          <FormatAddress
            address={account.toString()}
            withFullAddress
            withCopy
            withIcon
          />
        );
      }
    }
  ];

  if (!members) {
    return null;
  }

  return (
    <Card padding={false}>
      <Table
        showHeader
        config={tableConfig}
        data={members}
      />
    </Card>
  );
}
