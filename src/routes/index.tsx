import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { useAppForm } from '../hooks/form';

import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { createGame, ICreateGame } from '../api/game';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  const saveGameMutation = useMutation({
    mutationFn: async (value: ICreateGame) => {
      return createGame(value);
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: 'Game',
    },
    validators: {
      // Pass a schema or function to validate
      onChange: z.object({
        name: z.string().min(1),
      }),
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      const res = await saveGameMutation.mutateAsync(value);
      navigate({ to: `/$gameId`, params: { gameId: res.publicId } });
      console.log(res);
    },
  });

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
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
}
