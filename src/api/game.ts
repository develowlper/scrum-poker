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
    .select('name, publicId, show_results')
    .eq('publicId', publicId)
    .single();

  if (!data) {
    throw new Error('Game not found');
  }

  return data;
};

export const showResults = async (id: string) => {
  const { data } = await supabase
    .from('games')
    .update({ show_results: true })
    .eq('publicId', id)
    .select();

  if (!data) {
    throw new Error('Game not found');
  }

  return data;
};
export const hideResults = async (id: string) => {
  const { data } = await supabase
    .from('games')
    .update({ show_results: false })
    .eq('publicId', id)
    .select();

  if (!data) {
    throw new Error('Game not found');
  }

  return data;
};

export const resetGame = async (id: string) => {
  // delete all results

  await hideResults(id);

  const { data } = await supabase
    .from('game_results')
    .delete()
    .eq('game_id', id);

  console.log(data);

  if (!data) {
    throw new Error('Game not found');
  }

  return data;
};
