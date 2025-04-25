import { useFormContext } from '../../hooks/form';
import Button from '../Button';

export default function SubmitButton({ label }: { label: string }) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting: boolean) => (
        <Button highlighted disabled={isSubmitting}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}
