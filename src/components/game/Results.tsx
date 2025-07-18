import useParticipantsForGame from '../../hooks/useParticipantsForGame';
import usePlayersForGame from '../../hooks/usePlayersForGame';
import useResults from '../../hooks/useResults';
import { groupBy, orderBy } from 'lodash';

const Result = ({
  points,
  participants,
  total,
}: {
  points: number;
  participants: string[] | null;
  total: number;
}) => {
  const { data: gameParticipants } = useParticipantsForGame();

  const { data: players, isLoading: playersLoading } = usePlayersForGame();

  if (participants === null || participants.length === 0) {
    return null;
  }

  if (playersLoading) {
    return <div>Loading players...</div>;
  }

  return (
    <div className="flex gap-4 items-center">
      <span className="font-bold text-lg">{points}</span>
      <span className="font bold text-lg">
        {(participants.length / total) * 100} %
      </span>
      <ul className="flex gap-2 flex-wrap">
        {participants.map((participant) => (
          <li key={participant} className="badge badge-lg badge-primary">
            {players?.find(
              (x) =>
                x.publicId ===
                gameParticipants?.find((p) => p.id === participant)?.player,
            )?.name || 'Unknown Player'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Results() {
  const { results, isPending } = useResults();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!results || results.length === 0) {
    return <div className="text-lg text-error">No results available</div>;
  }

  const groupedEntries = Object.entries(groupBy(results, 'points')).map(
    ([points, results]) => ({
      points: parseInt(points, 10),
      results,
    }),
  );

  const orderedResults = orderBy(groupedEntries, 'points', 'asc');

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xl">Votes:</div>
      <ul className="flex flex-col gap-2">
        {orderedResults.map((result) => {
          return (
            <li key={result.points}>
              <Result
                points={result.points}
                participants={result.results.map((r) => r.participant_id)}
                total={results.length}
              />
            </li>
          );
        })}
      </ul>
      {/* <img src="https://thecatapi.com/api/images/get?format=src&type=gif&nocache=2025-07-18T12:46:59.707Z" /> */}
    </div>
  );
}
