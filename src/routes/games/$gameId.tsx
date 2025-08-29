import { createFileRoute } from '@tanstack/react-router';

import { useUserStore } from '../../stores/user';
import { useAppForm } from '../../hooks/form';
import { z } from 'zod';
import { createPlayer, ICreateUser } from '../../api/player';
import { createParticipant } from '../../api/participant';
import Game from '../../components/game/Game';

export const Route = createFileRoute('/games/$gameId')({
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
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.AppField
          name="name"
          children={(field) => (
            <field.TextField label="Please enter your name:" />
          )}
        />
        <form.AppForm>
          <form.SubmitButton label="Submit" />
        </form.AppForm>
      </form>
    </div>
  );
};

function RouteComponent() {
  const { gameId } = Route.useParams();

  const id = useUserStore((state) => state.id);

  return id ? (
    <Game gameId={gameId} />
  ) : (
    <div className="flex justify-center">
      <EnterNameForm />
    </div>
  );
}
