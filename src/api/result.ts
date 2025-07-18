import { supabase } from '../supabaseClient';

export interface ICreateResult {
  points: number;
  gameId: string;
  participantId: string;
}

export async function createResult(values: ICreateResult) {
  const { data: hasResult } = await supabase
    .from('game_results')
    .select('id')
    .eq('game_id', values.gameId)
    .eq('participant_id', values.participantId)
    .limit(1);

  if (hasResult && hasResult.length > 0) {
    const result = hasResult[0];

    return supabase
      .from('game_results')
      .update({ points: values.points })
      .eq('id', result.id);
  }

  const { data } = await supabase
    .from('game_results')
    .insert([
      {
        points: values.points,
        game_id: values.gameId,
        participant_id: values.participantId,
      },
    ])
    .select('*');

  if (!data) {
    throw new Error('Failed to create result');
  }

  return data[0];
}

export async function getResult(gameId: string, participantId: string) {
  const { data } = await supabase
    .from('game_results')
    .select('points')
    .eq('game_id', gameId)
    .eq('participant_id', participantId)
    .limit(1);

  if (!data || data.length === 0) {
    return null;
  }

  return data[0];
}
