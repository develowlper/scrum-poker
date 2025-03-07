import { supabase } from '../supabaseClient';

export interface ICreateUser {
  name: string;
}

export const createPlayer = async (values: ICreateUser) => {
  const playerToCreate = {
    name: values.name,
  };

  const { data } = await supabase
    .from('player')
    .insert([playerToCreate])
    .select('publicId, name');

  if (!data) {
    throw new Error('Failed to create player');
  }

  return data[0];
};

export const getPlayer = async (publicId: string) => {
  const { data } = await supabase
    .from('player')
    .select('name, publicId')
    .eq('publicId', publicId)
    .single();

  if (!data) {
    throw new Error('Player not found');
  }

  return data;
};
