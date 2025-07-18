import { useQuery } from '@tanstack/react-query';
import useGameId from '../../hooks/useGameId';
import { getParticipantsForGame } from '../../api/participant';
import { useUserStore } from '../../stores/user';
import { getResult } from '../../api/result';
import usePlayer from '../../hooks/usePlayer';
import clsx from 'clsx';

const Player = ({ id, participant }: { id: string; participant: string }) => {
  const gameId = useGameId();

  const { player: data, isPending } = usePlayer(id);

  const { data: points } = useQuery({
    queryKey: ['result', participant],
    queryFn: () => getResult(gameId, participant),
    refetchInterval: 1000,
  });

  const userId = useUserStore((state) => state.id);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div
        className={clsx(
          'badge  badge-xl',
          userId === id && 'underline',
          points?.points ? 'badge-success' : 'badge-outline',
        )}
      >
        {data?.name}
      </div>
    </>
  );
};

export default function PlayerList() {
  const gameId = useGameId();

  const { data, isPending } = useQuery({
    queryKey: ['participants', gameId],
    queryFn: () => getParticipantsForGame(gameId),
    refetchInterval: 3000,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-lg">Votes:</div>
      <div className="flex gap-3 items-center flex-wrap">
        {data?.map((player) => (
          <Player participant={player.id} key={player.id} id={player.player} />
        ))}
      </div>
    </div>
  );
}
