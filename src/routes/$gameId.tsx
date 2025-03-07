import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { getGame } from '../api/game';
import Headline from '../components/Headline';
import { STORY_PONTS } from '../const';
import Button from '../components/Button';

import { useUserStore } from '../stores/user';
import { useAppForm } from '../hooks/form';
import { z } from 'zod';

export const Route = createFileRoute('/$gameId')({
  component: RouteComponent,
});

const EnterNameForm = () => {
  const setName = useUserStore((state) => state.setName);

  const form = useAppForm({
    defaultValues: {
      name: '',
    },
    validators: {
      onChange: z.object({
        name: z.string().min(1),
      }),
    },
    onSubmit: ({ value }) => {
      setName(value.name);
      // Do something with form d
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

const StoryPoints = () => {
  return (
    <div>
      <div>Please enter your story points:</div>
      {STORY_PONTS.map((point) => (
        <Button key={point} onClick={() => console.log(point)}>
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

  const name = useUserStore((state) => state.name);

  console.log(name);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {name ? (
        <>
          <Headline text={`Welcome ${name} to game${data?.name}`} />
          <StoryPoints />
        </>
      ) : (
        <EnterNameForm />
      )}
    </div>
  );
}
