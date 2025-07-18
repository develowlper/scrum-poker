import { useQuery } from '@tanstack/react-query';
import useParticipantsForGame from './useParticipantsForGame';
import { getPlayersByIds } from '../api/player';

import useGameId from './useGameId';

export default function usePlayersForGame() {
  const gameId = useGameId();
  const { data: participants } = useParticipantsForGame();

  return useQuery({
    queryKey: ['players', gameId],
    queryFn: () => getPlayersByIds(participants?.map((p) => p.player) || []),
    enabled: !!participants,
  });
}
