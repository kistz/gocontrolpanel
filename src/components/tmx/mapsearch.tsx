"use client";

import { searchMaps } from "@/actions/tmx/maps";
import { getErrorMessage } from "@/lib/utils";
import { TMXMap } from "@/types/api/tmx";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import TMXMapCard from "./tmx-map-card";

export default function MapSearch({ serverId }: { serverId: string }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TMXMap[]>([]);
  const [hasMoreResults, setHasMoreResults] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSearch = async () => {
    setLoading(true);

    try {
      const { data, error } = await searchMaps(serverId, {
        name: query,
      });
      if (error) {
        throw new Error(error);
      }

      setSearchResults(data.Results);
      setHasMoreResults(data.More);
    } catch (err) {
      setError("Failed to search maps: " + getErrorMessage(err));
      toast.error("Failed to search maps", {
        description: getErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 w-1/3">
        <Input
          type="text"
          placeholder="Search maps..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={onSearch} disabled={loading}>
          <IconSearch />
          Search
        </Button>
      </div>

      {error && <span>{error}</span>}

      {searchResults.length > 0 ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((map) => (
              <TMXMapCard key={map.MapId} map={map} />
            ))}
          </div>

          {hasMoreResults && (
            <Button
              className="max-w-32 mx-auto"
              onClick={onSearch}
              disabled={loading}
              variant={"outline"}
            >
              Load More
            </Button>
          )}
        </div>
      ) : (
        <span>No results found</span>
      )}
    </div>
  );
}
