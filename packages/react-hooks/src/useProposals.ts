import { useState, useEffect } from 'react';
import { Proposal, Hash, Votes } from '@polkadot/types/interfaces';
import { Vec, Option } from '@polkadot/types';

import { useApi } from './useApi';

interface HooksReturnType {
  proposals: Option<Proposal>[];
  votes: Option<Votes>[];
}

export const useProposals = (council: string): HooksReturnType => {
  const { api } = useApi();
  const [proposals, setProposals] = useState<Option<Proposal>[]>([]);
  const [votes, setVotes] = useState<Option<Votes>[]>([]);

  useEffect((): void => {
    if (api && api.query[council]) {
      api.query[council].proposals((proposals: Vec<Hash>) => {
        api.query[council].proposalOf.multi(proposals, (result) => {
          setProposals(result as Option<Proposal>[]);
        });
        api.query[council].voting.multi(proposals, (result) => {
          setVotes(result as Option<Votes>[]);
        });
      });
    }
  }, [api, council]);

  return { proposals, votes };
};
