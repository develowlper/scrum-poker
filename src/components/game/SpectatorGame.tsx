import GameTitle from './GameTitle';
import GameOptions from './GameOptions';

import PlayerList from './PlayerList';
import useGame from '../../hooks/useGame';

import { match } from 'ts-pattern';
import Results from './Results';
import GameHeader from './GameHeader';
import ResetGameButton from '../ResetGameButton';
import { Link } from '@tanstack/react-router';

type GameProps = {
  gameId: string;
};

export default function SpectatorGame({ gameId }: GameProps) {
  const game = useGame(gameId);

  return (
    <div className="card card-md bg-base-200 w-full">
      <GameHeader
        className="p-2 bg-base-300"
        center={
          <div className="text-lg font-bold">
            <GameTitle />
          </div>
        }
        start={
          <div>
            <Link
              className="btn btn-primary"
              to="/games/$gameId"
              params={{ gameId }}
            >
              Join Poker
            </Link>
          </div>
        }
        end={<ResetGameButton />}
      />
      <div className="card-body">
        <div className="flex flex-col gap-2 items-center justify-center mt-6">
          <GameOptions />
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 ">
            <div className="flex flex-col gap-4">
              {match(game)
                .with({ isPending: true }, () => <div>Loading...</div>)
                .with(
                  { isPending: false, game: { show_results: true } },
                  () => <Results />,
                )
                .with(
                  { isPending: false, game: { show_results: false } },
                  () => <PlayerList />,
                )
                .otherwise(() => null)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
