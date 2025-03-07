import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '../../hooks/form';
import { ZodError } from 'zod';

export default function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div>
      <label className="input">
        <span className="label">{label}</span>
        <input
          value={field.state.value}
          type="text"
          onChange={(e) => field.handleChange(e.target.value)}
        />
      </label>
      {errors.map((error: ZodError) => (
        <div key={error.message} style={{ color: 'red' }}>
          {error.message}
        </div>
      ))}
    </div>
  );
}
