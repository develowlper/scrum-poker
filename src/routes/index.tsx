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

  const { handleSubmit, AppField, AppForm, SubmitButton } = useAppForm({
    defaultValues: {
      name: '',
    },
    validators: {
      // Pass a schema or function to validate
      onChange: z.object({
        name: z.string().min(1),
      }),
    },
    onSubmit: async ({ value }: { value: ICreateGame }) => {
      // Do something with form data
      const res = await saveGameMutation.mutateAsync(value);
      navigate({ to: `/games/$gameId`, params: { gameId: res.publicId } });
    },
  });

  return (
    <div className="flex justify-center">
      <div className="flex flex-col p-2 gap-2">
        <form
          className="w-[350px] flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <AppField
            name="name"
            children={(field) => (
              <field.TextField label="Enter a name for your game:" />
            )}
          />
          <AppForm>
            <SubmitButton label="Submit" />
          </AppForm>
        </form>
      </div>
    </div>
  );
}
