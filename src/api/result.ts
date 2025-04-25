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
    .single();

  if (hasResult) {
    return supabase
      .from('game_results')
      .update({ points: values.points })
      .eq('id', hasResult.id);
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
    .single();

  return data;
}
