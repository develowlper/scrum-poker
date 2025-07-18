import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/user';

import { getPlayer } from '../../api/player';

import {
  ensureParticipant,
  getParticipantsForGame,
} from '../../api/participant';
import { getResult } from '../../api/result';

import useGame from '../../hooks/useGame';
import clsx from 'clsx';
import GameTitle from './GameTitle';
import useGameId from '../../hooks/useGameId';
import StoryPoints from './StoryPoints';

const Points = ({ participantId }: { participantId: string }) => {
  const gameId = useGameId();

  const { resultsShown } = useGame(gameId);

  const { data, isPending } = useQuery({
    queryKey: ['result', participantId],
    queryFn: () => getResult(gameId, participantId),
    refetchInterval: 3000,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={clsx(
        'p-1 text-xl aspect-square w-8 h-8',
        data?.points && 'bg-lime-700',
      )}
    >
      {(resultsShown && data?.points) || '-'}
    </div>
  );
};

const Player = ({ id, participant }: { id: string; participant: string }) => {
  const gameId = useGameId();

  const { data, isPending } = useQuery({
    queryKey: ['player', id],
    queryFn: () => getPlayer(id),
  });

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
      {/* <Points participantId={participant} /> */}
    </>
  );
};

const PlayerList = () => {
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
      <div className="flex gap-3 items-center">
        {data?.map((player) => (
          <Player participant={player.id} key={player.id} id={player.player} />
        ))}
      </div>
    </div>
  );
};

type GameProps = {
  gameId: string;
};

export default function Game({ gameId }: GameProps) {
  const id = useUserStore((state) => state.id);

  if (!id) {
    throw new Error('User ID is required');
  }

  const { data: participant } = useQuery({
    queryKey: ['participant', gameId, id],
    queryFn: () => ensureParticipant(gameId, id),
  });

  if (!participant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card card-md bg-base-200 w-full">
      <div className="card-body">
        <GameTitle />

        <div className="flex gap-6 mt-6">
          <div className="flex-1 flex justify-end ">
            <StoryPoints />
          </div>
          <div className="flex-1">
            <PlayerList />
          </div>
        </div>
      </div>
    </div>
  );
}
