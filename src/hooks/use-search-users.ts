import { getUsersByIds, searchUser, UserMinimal } from "@/actions/database/users";
import { getErrorMessage } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UseSearchUsersProps {
  defaultUsers?: string[];
}

export function useSearchUsers({ defaultUsers }: UseSearchUsersProps) {
  const [searchResults, setSearchResults] = useState<UserMinimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getDefaultUsers() {
      if (!defaultUsers || defaultUsers.length === 0) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await getUsersByIds(defaultUsers);
        if (error) {
          throw new Error(error);
        }
        setSearchResults(data);
      } catch (error) {
        setError("Failed to fetch users: " + getErrorMessage(error));
        toast.error("Failed to fetch users", {
          description: getErrorMessage(error),
        });
      } finally {
        setLoading(false);
      }
    }

    getDefaultUsers();
  }, []);

  async function search(query?: string) {
    if (!query?.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    setError(null);

    try {
      const { data, error } = await searchUser(query);
      if (error) {
        throw new Error(error);
      }
      if (!data) return;

      setSearchResults(prev => {
        if (prev.some(user => user.id === data.id)) {
          return prev;
        }
        return [...prev, data];
      });  
    } catch (error) {
      setError("Failed to search users: " + getErrorMessage(error));
      toast.error("Failed to search users", {
        description: getErrorMessage(error),
      });
    } finally {
      setSearching(false);
    }
  }

  return {
    search,
    searchResults,
    searching,
    loading,
    error,
  };
}