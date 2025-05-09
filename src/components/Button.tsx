import clsx from 'clsx';

export default function Button({
  highlighted = false,
  children,
  ...props
}: { highlighted: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={clsx('btn', highlighted && 'btn-primary')} {...props}>
      {children}
    </button>
  );
}
