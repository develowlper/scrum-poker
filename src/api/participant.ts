import { supabase } from '../supabaseClient';

export interface ICreateParticipant {
  game: string;
  player: string;
}

export type Participant = {
  id: string;
  game: string;
  player: string;
};

export const createParticipant = async (values: ICreateParticipant) => {
  const { data } = await supabase
    .from('participants')
    .insert([values])
    .select('*');

  if (!data) {
    throw new Error('Failed to create participant');
  }

  return data[0];
};

export async function getParticipantsForGame(
  gameId: string,
): Promise<Participant[]> {
  const { data } = await supabase
    .from('participants')
    .select('player, id, game')
    .eq('game', gameId);

  if (!data) {
    throw new Error('Participants not found');
  }
  return data;
}

export async function getParticipant(
  gameId: string,
  playerId: string,
): Promise<Participant> {
  const { data } = await supabase
    .from('participants')
    .select('id, game, player')
    .eq('game', gameId)
    .eq('player', playerId)
    .single();

  if (!data) {
    throw new Error('Participant not found');
  }

  return data;
}

export async function ensureParticipant(
  gameId: string,
  playerId: string,
): Promise<Participant> {
  const { data } = await supabase
    .from('participants')
    .select('id, game, player')
    .eq('game', gameId)
    .eq('player', playerId)
    .limit(1);

  if (!data || data?.length < 1) {
    return createParticipant({ game: gameId, player: playerId });
  }

  return data[0];
}

export async function removeParticipant(
  gameId: string,
  playerId: string,
): Promise<void> {
  const participant = await getParticipant(gameId, playerId);

  console.log(participant.id);

  const { error, data } = await supabase
    .from('participants')
    .delete()
    .eq('id', participant.id)
    .select();

  console.log(data, error);

  if (error) {
    console.error('Failed to remove participant', error);
    throw new Error('Failed to remove participant');
  }
}
