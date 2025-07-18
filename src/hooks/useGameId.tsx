import { useParams } from '@tanstack/react-router';

export default function useGameId() {
  const { gameId } = useParams({ strict: false });
  return gameId;
}
