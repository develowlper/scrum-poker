import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getGame, hideResults, resetGame, showResults } from '../api/game';
import { useMemo } from 'react';

export default function useGame(gameId: string) {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ['game', gameId], [gameId]);

  const { data: game, isPending } = useQuery({
    queryKey,
    queryFn: () => getGame(gameId),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const showResultsMutation = useMutation({
    mutationFn: async () => showResults(gameId),
    onSettled: () => {
      // Invalidate the query to refetch the game data
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const hideResultsMutation = useMutation({
    mutationFn: async () => hideResults(gameId),
    onSettled: () => {
      // Invalidate the query to refetch the game data
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const resetGameMutation = useMutation({
    mutationFn: async () => resetGame(gameId),
    onSettled: () => {
      // Invalidate the query to refetch the game data
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['result'] });
    },
  });

  return {
    game,
    isPending,
    invalidate,
    showResults: showResultsMutation.mutate,
    hideResults: hideResultsMutation.mutate,
    resultsShown: game?.show_results,
    resetGame: resetGameMutation.mutate,
  };
}
