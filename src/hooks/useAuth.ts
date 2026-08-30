import { useMutation } from "@tanstack/react-query";
import { signIn, signOut } from "@/lib/api";

type SignInInput = {
  email: string;
  password: string;
};

export function useSignIn() {
  return useMutation({
    mutationFn: ({ email, password }: SignInInput) => signIn(email, password),
  });
}

export function useSignOut() {
  return useMutation({
    mutationFn: signOut,
  });
}
