import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSignIn } from "@/hooks/useAuth";
import { Logo } from "@/components/Logo";

const fieldInput =
  "h-9.5 w-full box-border rounded-[10px] border border-border bg-card pl-8.5 pr-3 font-sans text-[12.5px] font-medium text-foreground shadow-field outline-none placeholder:text-muted-foreground hover:border-[oklch(0.9_0.004_300)] focus-visible:border-ring";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const signIn = useSignIn();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    signIn.mutate({ email, password });
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-app-shell px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="grid size-11 place-items-center rounded-2xl bg-card shadow-card">
          <Logo width={17} height={20.5} />
        </span>
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-[16px] font-bold text-foreground">
            Welcome back
          </h1>
          <p className="max-w-[22em] text-[11.5px] leading-normal font-medium text-muted-foreground">
            Sign in to save and browse your bookmarks
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2.5">
        <label className="relative flex items-center">
          <Mail
            size={14}
            className="pointer-events-none absolute left-3 text-muted-foreground"
          />
          <input
            type="email"
            placeholder="you@studio.com"
            className={fieldInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </label>

        <label className="relative flex items-center">
          <Lock
            size={14}
            className="pointer-events-none absolute left-3 text-muted-foreground"
          />
          <input
            type={reveal ? "text" : "password"}
            placeholder="Your password"
            className={`${fieldInput} pr-9`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            aria-label="Toggle password visibility"
            className="absolute right-1 grid size-7 cursor-pointer place-items-center rounded-[9px] border-0 bg-transparent text-muted-foreground"
          >
            {reveal ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </label>

        {signIn.isError && (
          <p className="text-[11px] font-medium text-destructive">
            {signIn.error instanceof Error
              ? signIn.error.message
              : "Couldn't sign in"}
          </p>
        )}

        <Button
          type="submit"
          size="md"
          className="mt-1 w-full justify-center"
          disabled={signIn.isPending}
        >
          {signIn.isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-[11px] font-medium text-muted-foreground">
        New to Pinsei?{" "}
        <a
          href="https://pinsei.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-foreground-secondary underline underline-offset-2 hover:text-foreground"
        >
          Create an account
        </a>
      </p>
    </div>
  );
}
