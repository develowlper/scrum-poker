import { createFileRoute } from '@tanstack/react-router';

import { useUserStore } from '../../../stores/user';
import { useAppForm } from '../../../hooks/form';
import { z } from 'zod';
import { createPlayer, ICreateUser } from '../../../api/player';
import { createParticipant } from '../../../api/participant';
import Game from '../../../components/game/Game';
import JoinAsSpectator from '../../../components/JoinAsSpectator';

export const Route = createFileRoute('/games/$gameId/')({
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
        name: z.string().min(1, 'Name is required'),
      }),
    },
    onSubmit: async ({ value }: { value: ICreateUser }) => {
      const { publicId } = await createPlayer(value);
      await createParticipant({ game: gameId, player: publicId });
      setId(publicId);
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="text-lg  mb-1">
        To join the scrum poker, you need to provide a name.
      </div>
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.AppField
          name="name"
          children={(field) => <field.TextField label="Enter your name here" />}
        />
        <form.AppForm>
          <form.SubmitButton label="Join Poker" />
        </form.AppForm>
      </form>
      <div>or you can</div>
      <JoinAsSpectator />
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
