import { useQuery } from '@tanstack/react-query';
import useGameId from './useGameId';
import { getParticipantsForGame } from '../api/participant';

export default function useParticipantsForGame() {
  const gameId = useGameId();

  return useQuery({
    queryKey: ['participants', gameId],
    queryFn: () => getParticipantsForGame(gameId),
    refetchInterval: 3000,
  });
}
