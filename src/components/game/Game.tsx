import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/user';

import { ensureParticipant, removeParticipant } from '../../api/participant';

import GameTitle from './GameTitle';
import GameOptions from './GameOptions';

import StoryPoints from './StoryPoints';
import PlayerList from './PlayerList';
import useGame from '../../hooks/useGame';

import { match } from 'ts-pattern';
import Results from './Results';
import GameHeader from './GameHeader';
import ResetGameButton from '../ResetGameButton';
import { Link } from '@tanstack/react-router';
import JoinAsSpectator from '../JoinAsSpectator';
import { useEffect } from 'react';

type GameProps = {
  gameId: string;
};

export default function Game({ gameId }: GameProps) {
  const id = useUserStore((state) => state.id);

  if (!id) {
    throw new Error('User ID is required');
  }

  const game = useGame(gameId);

  const { data: participant } = useQuery({
    queryKey: ['participant', gameId, id],
    queryFn: () => ensureParticipant(gameId, id),
    refetchInterval: 1000,
  });

  useEffect(() => {
    return () => {
      removeParticipant(gameId, id);
    };
  }, [gameId, id]);

  if (!participant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card card-md bg-base-200 w-full">
      <GameHeader
        className="p-2 bg-base-300"
        center={
          <div className="text-lg font-bold">
            <GameTitle />
          </div>
        }
        start={<JoinAsSpectator label="Spectate" />}
        end={<ResetGameButton />}
      />
      <div className="card-body">
        <div className="flex justify-center ">
          <GameOptions />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 ">
          <div className="flex justify-end ">
            <StoryPoints disable={game.game?.show_results === true} />
          </div>
          <div className="flex flex-col gap-4">
            {match(game)
              .with({ isPending: true }, () => <div>Loading...</div>)
              .with({ isPending: false, game: { show_results: true } }, () => (
                <Results />
              ))
              .with({ isPending: false, game: { show_results: false } }, () => (
                <PlayerList />
              ))
              .otherwise(() => null)}
          </div>
        </div>
      </div>
    </div>
  );
}
