import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../../stores/user';
import { getGame } from '../../api/game';
import { getPlayer } from '../../api/player';
import Headline from '../Headline';
import {
  ensureParticipant,
  getParticipant,
  getParticipantsForGame,
} from '../../api/participant';
import { useMemo } from 'react';
import { createResult, getResult, ICreateResult } from '../../api/result';
import Button from '../Button';
import { STORY_PONTS } from '../../const';
import { useParams } from '@tanstack/react-router';
import useGame from '../../hooks/useGame';
import clsx from 'clsx';

const StoryPoints = ({
  gameId,
  playerId,
}: {
  gameId: string;
  playerId: string;
}) => {
  const { data: participant, isLoading: isParticipantLoading } = useQuery({
    queryKey: ['particpant', gameId, playerId],
    queryFn: () => getParticipant(gameId, playerId),
    enabled: !!playerId,
  });

  const resultQueryKey = useMemo(
    () => ['result', gameId, participant?.id],
    [gameId, participant],
  );

  const queryClient = useQueryClient();

  const savePointsMutation = useMutation({
    mutationFn: async (value: ICreateResult) => createResult(value),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: resultQueryKey }),
  });

  const { variables, isPending: isMutating } = savePointsMutation;

  const { data: result, isPending } = useQuery({
    queryKey: resultQueryKey,
    queryFn: async () => getResult(gameId, participant?.id || ''),
    enabled: !!participant?.id,
  });

  if (isPending || isParticipantLoading) {
    return <div>Loading...</div>;
  }

  if (!participant) {
    return <div>Participant not found</div>;
  }

  const currentPoints = isMutating ? variables?.points : result?.points;

  return (
    <div>
      <div>Please enter your story points:</div>
      {STORY_PONTS.map((point) => (
        <Button
          highlighted={currentPoints === point}
          key={point}
          onClick={() =>
            savePointsMutation.mutateAsync({
              points: point,
              gameId,
              participantId: participant?.id,
            })
          }
        >
          {point}
        </Button>
      ))}
    </div>
  );
};

const Points = ({ participantId }: { participantId: string }) => {
  const { gameId } = useParams({ strict: false });

  if (!gameId) {
    throw new Error('Game ID is required');
  }

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
  const { data, isPending } = useQuery({
    queryKey: ['player', id],
    queryFn: () => getPlayer(id),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex gap-2">
      <div>{data?.name}</div>
      <Points participantId={participant} />
    </div>
  );
};

const PlayerList = () => {
  const { gameId } = useParams({ strict: false });

  if (!gameId) {
    throw new Error('Game ID is required');
  }

  const { data, isPending } = useQuery({
    queryKey: ['participants', gameId],
    queryFn: () => getParticipantsForGame(gameId),
    refetchInterval: 3000,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {data?.map((player) => (
        <Player participant={player.id} key={player.id} id={player.player} />
      ))}
    </div>
  );
};

const Options = () => {
  const { gameId } = useParams({ strict: false });

  if (!gameId) {
    throw new Error('Game ID is required');
  }

  const { showResults, hideResults, resultsShown, resetGame } = useGame(gameId);

  return (
    <div className="flex gap-4 items-center">
      <button
        className="btn btn-primary"
        onClick={() => showResults()}
        disabled={resultsShown}
      >
        Show Results
      </button>
      <button
        disabled={!resultsShown}
        className="btn btn-secondary"
        onClick={() => hideResults()}
      >
        Hide Results
      </button>
      <button onClick={() => resetGame()} className="btn btn-error">
        Reset
      </button>
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

  const { data, isPending } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => getGame(gameId),
  });

  const { data: player } = useQuery({
    queryKey: ['player', id],
    queryFn: () => getPlayer(id),
  });

  const { data: participant } = useQuery({
    queryKey: ['participant', gameId, id],
    queryFn: () => ensureParticipant(gameId, id),
  });

  if (isPending || !participant) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Headline text={`Welcome ${player?.name} to game ${data?.name}`} />
      <StoryPoints gameId={gameId} playerId={player?.publicId} />
      <PlayerList />
      <Options />
    </>
  );
}
