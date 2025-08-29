import { useMemo } from 'react';
import useParticipant from '../../hooks/useParticipant';
import useGameId from '../../hooks/useGameId';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createResult, getResult, ICreateResult } from '../../api/result';
import Button from '../Button';
import { STORY_PONTS } from '../../const';
import clsx from 'clsx';

export default function StoryPoints({ disable }: { disable: boolean }) {
  const { participant, isParticipantLoading } = useParticipant();
  const gameId = useGameId();

  const resultQueryKey = useMemo(
    () => ['result', gameId, participant?.id],
    [gameId, participant],
  );

  const queryClient = useQueryClient();

  const savePointsMutation = useMutation({
    mutationFn: async (value: ICreateResult) => createResult(value),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: resultQueryKey }),
  });

  const { variables, isPending: isMutating } = savePointsMutation;

  const { data: result, isPending } = useQuery({
    queryKey: resultQueryKey,
    queryFn: async () => getResult(gameId, participant?.id || ''),
    enabled: !!participant?.id,
  });

  if (isPending || isParticipantLoading) {
    return <div>Loading...</div>;
  }

  if (!participant) {
    return <div>Participant not found</div>;
  }

  const currentPoints = isMutating ? variables?.points : result?.points;

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg">Please enter your story points:</div>
      <ul className="grid grid-cols-3 gap-3">
        {STORY_PONTS.map((point) => {
          const highlighted = currentPoints === point;
          return (
            <li key={point} className="">
              <Button
                className={clsx(
                  'btn-xl  w-full',
                  !highlighted && 'btn-outline',
                )}
                disabled={disable}
                highlighted={highlighted}
                onClick={() =>
                  savePointsMutation.mutateAsync({
                    points: point,
                    gameId,
                    participantId: participant?.id,
                  })
                }
              >
                {point}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
