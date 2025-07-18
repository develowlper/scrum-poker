import { useQuery } from '@tanstack/react-query';
import { getResultsForGame } from '../api/result';
import useGameId from './useGameId';

export default function useResults() {
  const gameId = useGameId();

  const { data: results, isPending } = useQuery({
    queryKey: ['results', gameId],
    queryFn: () => getResultsForGame(gameId),
    refetchInterval: 10000,
  });

  return { results, isPending };
}
