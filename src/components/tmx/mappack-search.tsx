"use client";

import { searchMaps } from "@/actions/tmx/maps";
import { getErrorMessage } from "@/lib/utils";
import { TMXMap, TMXMappack } from "@/types/api/tmx";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import TMXMapCard from "./tmx-map-card";
import { searchMappacks } from "@/actions/tmx/mappacks";
import TMXMappackCard from "./tmx-mappack-card";

export default function MappackSearch({
  serverId,
  fmHealth,
}: {
  serverId: string;
  fmHealth: boolean;
}) {
  const [nameQuery, setNameQuery] = useState("");

  const [searchResults, setSearchResults] = useState<TMXMappack[]>([]);
  const [hasMoreResults, setHasMoreResults] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSearch = async (more?: boolean) => {
    setLoading(true);

    try {
      let params: Record<string, string> = {
        name: nameQuery,
      };

      if (more) {
        params.after =
          searchResults[searchResults.length - 1]?.MappackId.toString();
      }

      const { data, error } = await searchMappacks(serverId, params);
      if (error) {
        throw new Error(error);
      }

      setError(null);
      setSearchResults(
        more ? [...searchResults, ...data.Results] : data.Results,
      );
      setHasMoreResults(data.More);
    } catch (err) {
      setError("Failed to search mappacks: " + getErrorMessage(err));
      toast.error("Failed to search mappacks", {
        description: getErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-end">
        <div className="flex flex-col gap-1">
          <span className="text-nowrap text-sm">Mappack Name</span>
          <Input
            type="text"
            placeholder="Search mappack name..."
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>

        <Button onClick={() => onSearch()} disabled={loading}>
          <IconSearch />
          Search
        </Button>
      </div>

      {error && <span>{error}</span>}

      {searchResults.length > 0 ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-4">
            {searchResults.map((mappack, index) => (
              <TMXMappackCard
                key={index}
                serverId={serverId}
                mappack={mappack}
                fmHealth={fmHealth}
              />
            ))}
          </div>

          {hasMoreResults && (
            <Button
              className="max-w-32 mx-auto"
              onClick={() => onSearch(true)}
              disabled={loading}
              variant={"outline"}
            >
              Load More
            </Button>
          )}
        </div>
      ) : loading ? (
        <span>Loading...</span>
      ) : (
        <span>No results found</span>
      )}
    </div>
  );
}
