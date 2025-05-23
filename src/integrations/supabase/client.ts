
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wbvxnapruffchikhrqrs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndidnhuYXBydWZmY2hpa2hycXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MDIyOTgsImV4cCI6MjA2MzA3ODI5OH0.D4ZFSvFactaHtrhCDms7VF6yVJPO2PnOxUF_ugKU0FI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // Important for password reset and OAuth flows
      debug: false, // Turn off debug logs to reduce console noise
      flowType: 'pkce', // Use PKCE flow for better security
    },
  }
);

// Helper to check session state with more detailed logging
export const checkAndLogSessionStatus = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("[SupabaseClient] Erro ao verificar sessão:", error);
      console.error("[SupabaseClient] DETALHES EM PORTUGUÊS: Falha ao verificar estado da sessão");
      return { isAuthenticated: false, error };
    }
    
    console.log("[SupabaseClient] Status da sessão:", data.session ? "Ativa" : "Inativa");
    console.log("[SupabaseClient] DETALHES EM PORTUGUÊS:", 
      data.session 
        ? "Sessão válida encontrada" 
        : "Nenhuma sessão ativa encontrada");
    
    return { 
      isAuthenticated: !!data.session,
      user: data.session?.user || null,
      session: data.session
    };
  } catch (e) {
    console.error("[SupabaseClient] Erro inesperado ao verificar sessão:", e);
    console.error("[SupabaseClient] DETALHES EM PORTUGUÊS: Ocorreu um erro inesperado ao verificar o estado de autenticação");
    return { isAuthenticated: false, error: e };
  }
};
