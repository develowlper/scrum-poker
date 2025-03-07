import { nanoid } from 'nanoid';
import { supabase } from '../supabaseClient';

export interface ICreateGame {
  name: string;
}

export const createGame = async (values: ICreateGame) => {
  const gameToCreate = {
    name: values.name,
    publicId: nanoid(6).toLowerCase(),
  };
  console.log(gameToCreate);

  const { data } = await supabase
    .from('games')
    .insert([gameToCreate])
    .select('publicId');

  if (!data) {
    throw new Error('Failed to create game');
  }

  return data[0];
};

export const getGame = async (publicId: string) => {
  const { data } = await supabase
    .from('games')
    .select('name, publicId')
    .eq('publicId', publicId)
    .single();

  if (!data) {
    throw new Error('Game not found');
  }

  return data;
};
