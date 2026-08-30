import { createContext, useContext } from "react";
import type { Session } from "@supabase/supabase-js";

interface SessionState {
  session: Session | null;
  isLoading: boolean;
}

export const SessionContext = createContext<SessionState>({
  session: null,
  isLoading: true,
});

export function useSession() {
  return useContext(SessionContext);
}
