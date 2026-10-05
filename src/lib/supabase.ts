
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl) {
  throw new Error(
    'EXPO_PUBLIC_SUPABASE_URL não foi encontrada no arquivo .env',
  );
}

if (!supabaseKey) {
  throw new Error(
    'EXPO_PUBLIC_SUPABASE_KEY não foi encontrada no arquivo .env',
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
);

