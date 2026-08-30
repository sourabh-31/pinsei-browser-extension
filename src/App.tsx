import { SessionProvider } from "@/hooks/session";
import { useSession } from "@/hooks/sessionContext";
import { Login } from "@/components/Login";
import { PopupShell } from "@/components/PopupShell";

export default function App() {
  return (
    <SessionProvider>
      <Root />
    </SessionProvider>
  );
}

function Root() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return null;
  }

  return session ? <PopupShell /> : <Login />;
}
