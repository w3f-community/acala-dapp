import React, { FC, ReactNode } from 'react';
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
      /* eslint-disable-next-line react/display-name */
      render: (account: AccountId): ReactNode => {
        return (
          <FormatAddress
            address={account.toString()}
            withCopy
            withFullAddress
            withIcon
          />
        );
      },
      title: 'Account'
    }
  ];

  if (!members) {
    return null;
  }

  return (
    <Card padding={false}>
      <Table
        config={tableConfig}
        data={members}
        showHeader
      />
    </Card>
  );
};
