import { useQuery } from '@tanstack/react-query';
import { getPlayer } from '../api/player';
import { useUserStore } from '../stores/user';

export default function usePlayer(idArg?: string) {
  const storeId = useUserStore((state) => state.id);
  const id = idArg || storeId;

  if (!id) {
    throw new Error('User ID is required');
  }

  const { data: player, isPending } = useQuery({
    queryKey: ['player', id],
    queryFn: () => getPlayer(id),
  });

  return { player, isPending };
}
