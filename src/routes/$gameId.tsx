import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { getGame } from '../api/game';
import Headline from '../components/Headline';
import { STORY_PONTS } from '../const';
import Button from '../components/Button';

import { useUserStore } from '../stores/user';
import { useAppForm } from '../hooks/form';
import { z } from 'zod';
import { createPlayer, getPlayer, ICreateUser } from '../api/player';
import { createResult, getResult, ICreateResult } from '../api/result';
import { useMemo } from 'react';
import {
  createParticipant,
  getParticipant,
  getParticipantsForGame,
} from '../api/participant';
import useGame from '../hooks/useGame';
import clsx from 'clsx';

export const Route = createFileRoute('/$gameId')({
  component: RouteComponent,
});

const EnterNameForm = () => {
  const { gameId } = Route.useParams();

  const setId = useUserStore((state) => state.setId);

  const form = useAppForm({
    defaultValues: {
      name: '',
    },
    validators: {
      onChange: z.object({
        name: z.string().min(1),
      }),
    },
    onSubmit: async ({ value }: { value: ICreateUser }) => {
      const { publicId } = await createPlayer(value);
      await createParticipant({ game: gameId, player: publicId });
      setId(publicId);
    },
  });

  return (
    <div>
      <div>Please enter your name:</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.AppField
          name="name"
          children={(field) => <field.TextField label="Name" />}
        />
        <form.AppForm>
          <form.SubmitButton label="Submit" />
        </form.AppForm>
      </form>
    </div>
  );
};

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
  const { gameId } = Route.useParams();

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
  const { gameId } = Route.useParams();
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
  const { gameId } = Route.useParams();
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

function RouteComponent() {
  const { gameId } = Route.useParams();

  const { data, isPending } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => getGame(gameId),
  });

  const id = useUserStore((state) => state.id);

  const { data: player } = useQuery({
    queryKey: ['player', id],
    queryFn: () => getPlayer(id as string),
    enabled: !!id,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {id ? (
        <>
          <Headline text={`Welcome ${player?.name} to game${data?.name}`} />
          <StoryPoints gameId={gameId} playerId={player?.publicId} />
          <PlayerList />
          <Options />
        </>
      ) : (
        <EnterNameForm />
      )}
    </div>
  );
}
