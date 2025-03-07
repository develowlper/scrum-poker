import { supabase } from '../supabaseClient';

export interface ICreateResult {
  points: number;
  gameId: string;
  playerId: string;
}

export async function createResult(values: ICreateResult) {
  const { data: hasResult } = await supabase
    .from('game_results')
    .select('id')
    .eq('game_id', values.gameId)
    .eq('player_id', values.playerId)
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
        player_id: values.playerId,
      },
    ])
    .select('*');

  if (!data) {
    throw new Error('Failed to create result');
  }

  return data[0];
}

export async function getResult(gameId: string, playerId: string) {
  const { data } = await supabase
    .from('game_results')
    .select('points')
    .eq('game_id', gameId)
    .eq('player_id', playerId)
    .single();

  return data;
}
