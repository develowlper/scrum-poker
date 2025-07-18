import clsx from 'clsx';

export default function Button({
  highlighted = false,
  children,
  className,
  ...props
}: {
  highlighted: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx('btn', highlighted && 'btn-primary', className)}
      {...props}
    >
      {children}
    </button>
  );
}
