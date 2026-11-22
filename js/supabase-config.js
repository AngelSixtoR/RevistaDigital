import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Cambia a 'supabase' cuando tengas tus credenciales y RLS configurados.
export const MODO = 'supabase';
export const SUPABASE_URL = "https://ywiczbibopjdyrzvljzh.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_oIDejPlgjuNWGgSrGJtjbg_fPmyPQF2";

export const supabase = MODO === 'supabase'
  ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  : null;
