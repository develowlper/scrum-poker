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
  console.log(values);

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
    .from<Participant>('participants')
    .select('player')
    .eq('game', gameId);

  if (!data) {
    throw new Error('Participants not found');
  }
  return data;
}
