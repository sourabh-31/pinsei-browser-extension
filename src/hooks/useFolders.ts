import { useQuery } from "@tanstack/react-query";
import { fetchFolders } from "@/lib/api";
import { useSession } from "@/hooks/sessionContext";

function foldersQueryKey(userId: string | undefined) {
  return ["folders", userId] as const;
}

export function useFolders() {
  const { session } = useSession();
  const userId = session?.user.id;

  return useQuery({
    queryKey: foldersQueryKey(userId),
    queryFn: () => fetchFolders(userId!),
    enabled: !!userId,
  });
}
