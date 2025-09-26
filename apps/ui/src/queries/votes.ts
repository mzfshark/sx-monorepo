import { useInfiniteQuery } from '@tanstack/vue-query';
import { MaybeRefOrGetter } from 'vue';
import { getNetwork } from '@/networks';
import { Proposal } from '@/types';
import { loadStakingData } from '@/networks/offchain/api';

const LIMIT = 20;

export function useProposalVotesQuery({
  proposal,
  choiceFilter,
  sortBy,
  enabled,
  recountVotes,
}: {
  proposal: MaybeRefOrGetter<Proposal>;
  choiceFilter: MaybeRefOrGetter<'any' | 'for' | 'against' | 'abstain'>;
  sortBy: MaybeRefOrGetter<
    'vp-desc' | 'vp-asc' | 'created-desc' | 'created-asc'
  >;
  enabled?: MaybeRefOrGetter<boolean>;
  recountVotes?: MaybeRefOrGetter<boolean>;
}) {
  return useInfiniteQuery({
    initialPageParam: 0,
    queryKey: [
      'votes',
      () => toValue(proposal).id,
      'list',
      {
        choiceFilter,
        sortBy
      }
    ],
    queryFn: async ({ pageParam }) => {
      const network = getNetwork(toValue(proposal).network);

      let res = await network.api.loadProposalVotes(
        toValue(proposal),
        { limit: LIMIT, skip: pageParam },
        toValue(choiceFilter),
        toValue(sortBy)
      );

      const stakingData = await loadStakingData();

      res = res.map(r => ({
        ...r,
        validator: stakingData.validatorsWithVotingPower.find(
          v => v.address.toUpperCase() === r?.voter?.id?.toUpperCase()
        )
      }))

      if(recountVotes) {
        res = res.map(r => ({
          ...r,
          vp: stakingData.validatorsWithVotingPower.find(
            v => v.address.toUpperCase() === r?.voter?.id?.toUpperCase()
          )?.votingPower || "0"
        }))
      }

      console.log(555, res);

      return res;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < LIMIT) return null;

      return pages.length * LIMIT;
    },
    enabled: enabled ? () => toValue(enabled) : undefined
  });
}
