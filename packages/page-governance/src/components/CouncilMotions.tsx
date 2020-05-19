import React, { FC, ReactNode } from 'react';
import { Card, Table, TableItem } from '@honzon-platform/ui-components';
import { useCouncilMembers } from '@honzon-platform/react-hooks';
import { FormatHash } from '@honzon-platform/react-components';
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
      /* eslint-disable-next-line react/display-name */
      render: (data: Option<Proposal>): ReactNode => {
        return (
          <FormatHash
            hash={data.isSome ? data.value.hash.toString() : ''}
          />
        );
      },
      title: 'Hash'
    },
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (_data: Option<Proposal>, index: number): ReactNode => {
        const vote = votes[index];

        return `${(vote.value as Votes).threshold || 0} / ${members ? members.length : 0}`;
      },
      title: 'Threshold'
    },
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (_data: Option<Proposal>, index: number): ReactNode => {
        const vote = votes[index];

        return `${(vote.value as Votes).ayes.length || 0} aye, ${(vote.value as Votes).nays.length || 0} nay`;
      },
      title: 'Current Vote'
    },
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (data: Option<Proposal>): ReactNode => {
        if ((data.value as Proposal).callIndex) {
          const callIndex = data.registry.findMetaCall((data.value as Proposal).callIndex);

          return `${callIndex.section}:${callIndex.method}(${(data.value as Proposal).args.toString()})`;
        }
      },
      title: 'Proposal'
    }
  ];

  if (!proposals) {
    return null;
  }

  return (
    <Card padding={false}>
      <Table
        config={tableConfig}
        data={proposals}
        empty='No Motions'
        showHeader
      />
    </Card>
  );
};
