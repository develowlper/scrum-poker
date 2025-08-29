import clsx from 'clsx';
import { JSX } from 'react';

export default function GameHeader({
  start = <></>,
  end = <></>,
  center = <></>,
  className,
}: {
  start?: JSX.Element;
  end?: JSX.Element;
  center?: JSX.Element;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'grid grid-cols-[1fr_auto_1fr] items-center w-full',
        className,
      )}
    >
      <div className="justify-self-start">{start}</div>
      <div className="justify-self-center">{center}</div>
      <div className="justify-self-end">{end}</div>
    </div>
  );
}
