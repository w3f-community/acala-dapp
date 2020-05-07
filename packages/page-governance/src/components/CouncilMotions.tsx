import React, { FC } from 'react';
import { Card, Table, TableItem } from '@honzon-platform/ui-components';
import { useCouncilMembers } from '@honzon-platform/react-hooks';
import AccountId from '@polkadot/types/generic/AccountId';
import { FormatAddress, FormatHash } from '@honzon-platform/react-components';
import { useProposals } from '@honzon-platform/react-hooks/useProposals';
import { Option } from '@polkadot/types';
import { Proposal, Votes } from '@polkadot/types/interfaces';

interface Props {
  council: string;
}
export const CouncilMotions: FC<Props> = ({ council }) => {
  const { proposals, votes } = useProposals(council);
  const members = useCouncilMembers(council);

  const tableConfig: TableItem<any>[] = [
    {
      align: 'left',
      title: 'Hash',
      render: (data: Option<Proposal>, index: number) => {
        return (
          <FormatHash
            hash={data.isSome ? data.value.hash.toString() : ''}
          />
        );
      }
    },
    {
      align: 'left',
      title: 'Threshold',
      render: (_data: Option<Proposal>, index: number) => {
        const vote = votes[index];
        return `${vote?.value?.threshold || 0} / ${members?.length || 0}`;
      }
    },
    {
      align: 'left',
      title: 'Current Vote',
      render: (_data: Option<Proposal>, index: number) => {
        const vote = votes[index];
        return `${vote?.value?.ayes?.length || 0} aye, ${vote?.value?.nays?.length || 0} nay`;
      }
    },
    {
      align: 'left',
      title: 'Proposal',
      render: (data: Option<Proposal>) => {
        if (data?.value?.callIndex) {
          const callIndex = data.registry.findMetaCall((data.value as Proposal).callIndex);
          return `${callIndex.section}:${callIndex.method}(${data?.value?.args?.toString()})`;
        }
      }
    },
  ];

  if (!proposals) {
    return null;
  }

  return (
    <Card padding={false}>
      <Table
        showHeader
        config={tableConfig}
        data={proposals}
        empty='No Motions'
      />
    </Card>
  );
}
