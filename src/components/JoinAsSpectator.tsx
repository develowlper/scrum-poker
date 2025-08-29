import { Link, useParams } from '@tanstack/react-router';
import { CgSearch } from 'react-icons/cg';

export default function JoinAsSpectator({
  label = ' Join as Spectator',
}: {
  label?: string;
}) {
  const { gameId } = useParams({ strict: false });

  if (!gameId) return null;

  return (
    <Link
      className="btn btn-primary"
      to="/games/$gameId/spectator"
      params={{ gameId }}
    >
      <CgSearch />
      {label}
    </Link>
  );
}
