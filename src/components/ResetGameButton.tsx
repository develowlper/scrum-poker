import { CgClose } from 'react-icons/cg';
import useGame from '../hooks/useGame';
import useGameId from '../hooks/useGameId';

export default function ResetGameButton() {
  const gameId = useGameId();

  const { resetGame } = useGame(gameId);

  return (
    <button onClick={() => resetGame()} className="btn btn-error">
      <CgClose />
      Reset
    </button>
  );
}
