import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '../../hooks/form';
import { ZodError } from 'zod';

export default function TextField({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const field = useFieldContext<string>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className={className}>
      <label>
        <span className="label">{label}</span>
        <input
          className="input w-full"
          value={field.state.value}
          type="text"
          onChange={(e) => field.handleChange(e.target.value)}
        />
      </label>
      {errors.map((error: ZodError) => (
        <p className="label text-error" key={error.message}>
          {error.message}
        </p>
      ))}
    </div>
  );
}
