import { useQuery } from '@tanstack/react-query';
import { getParticipant } from '../api/participant';
import useGameId from './useGameId';
import usePlayer from './usePlayer';

export default function useParticipant() {
  const gameId = useGameId();

  if (!gameId) {
    throw new Error('Game ID is required');
  }

  const { player } = usePlayer();

  const playerId = player?.publicId;

  const { data: participant, isLoading: isParticipantLoading } = useQuery({
    queryKey: ['participant', gameId, playerId],
    queryFn: () => getParticipant(gameId, playerId),
    enabled: !!playerId,
  });

  return { participant, isParticipantLoading };
}
