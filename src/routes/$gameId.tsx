import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { getGame } from '../api/game';
import Headline from '../components/Headline';
import { STORY_PONTS } from '../const';
import Button from '../components/Button';

import { useUserStore } from '../stores/user';
import { useAppForm } from '../hooks/form';
import { z } from 'zod';
import { createPlayer, getPlayer } from '../api/player';
import { createResult, getResult, ICreateResult } from '../api/result';
import { useMemo } from 'react';

export const Route = createFileRoute('/$gameId')({
  component: RouteComponent,
});

const EnterNameForm = () => {
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
    onSubmit: async ({ value }) => {
      const { publicId } = await createPlayer(value);
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
  const resultQueryKey = useMemo(
    () => ['result', gameId, playerId],
    [gameId, playerId],
  );

  const queryClient = useQueryClient();

  const savePointsMutation = useMutation({
    mutationFn: async (value: ICreateResult) => createResult(value),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: resultQueryKey }),
  });

  const { variables, isPending: isMutating } = savePointsMutation;

  console.log(savePointsMutation.variables);

  const { data: result, isPending } = useQuery({
    queryKey: resultQueryKey,
    queryFn: async () => getResult(gameId, playerId),
  });

  if (isPending) {
    return <div>Loading...</div>;
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
            savePointsMutation.mutateAsync({ points: point, gameId, playerId })
          }
        >
          {point}
        </Button>
      ))}
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
        </>
      ) : (
        <EnterNameForm />
      )}
    </div>
  );
}
