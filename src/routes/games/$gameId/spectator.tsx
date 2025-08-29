import { createFileRoute } from '@tanstack/react-router';
import SpectatorGame from '../../../components/game/SpectatorGame';

export const Route = createFileRoute('/games/$gameId/spectator')({
  component: RouteComponent,
});

function RouteComponent() {
  const { gameId } = Route.useParams();

  return <SpectatorGame gameId={gameId} />;
}
