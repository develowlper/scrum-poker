import clsx from 'clsx';

export default function Button({
  highlighted = false,
  children,
  className,
  disabled = false,
  ...props
}: {
  highlighted: boolean;
  className?: string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx('btn', highlighted && 'btn-primary', className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
