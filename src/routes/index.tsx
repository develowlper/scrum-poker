import { createFileRoute } from '@tanstack/react-router';

import { useAppForm } from '../hooks/form';
import { nanoid } from 'nanoid';
import { z } from 'zod';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const form = useAppForm({
    defaultValues: {
      name: '',
      id: nanoid(6),
    },
    validators: {
      // Pass a schema or function to validate
      onChange: z.object({
        name: z.string().min(1),
        id: z.string().length(6),
      }),
      onSubmit: ({ value }) => {
        // Do something with form data
        console.log(value);
      },
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
