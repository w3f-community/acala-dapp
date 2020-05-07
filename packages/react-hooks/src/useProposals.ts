import { useApi } from "./useApi";
import { useState, useEffect } from "react";
import { Proposal, Hash, Votes } from "@polkadot/types/interfaces";
import { Vec, Option } from "@polkadot/types";

export const useProposals = (council: string) => {
  const { api } = useApi();
  const [proposals, setProposals] = useState<Option<Proposal>[]>([]);
  const [votes, setVotes] = useState<Option<Votes>[]>([]);

  useEffect(() => {
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
