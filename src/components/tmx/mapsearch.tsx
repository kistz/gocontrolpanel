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
  const [nameQuery, setNameQuery] = useState("");
  const [authorQuery, setAuthorQuery] = useState("");

  const [searchResults, setSearchResults] = useState<TMXMap[]>([]);
  const [hasMoreResults, setHasMoreResults] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSearch = async (more?: boolean) => {
    setLoading(true);

    try {
      let params: Record<string, string> = {
        name: nameQuery,
      };

      if (authorQuery) {
        params.author = authorQuery;
      }

      if (more) {
        params.after = searchResults[searchResults.length - 1]?.MapId.toString();
      }

      const { data, error } = await searchMaps(serverId, params);
      if (error) {
        throw new Error(error);
      }

      setError(null);
      setSearchResults(
        more ? [...searchResults, ...data.Results] : data.Results,
      );
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
      <div className="flex gap-2 items-end">
        <div className="flex flex-col gap-1">
          <span className="text-nowrap text-sm">Map Name</span>
          <Input
            type="text"
            className="max-w-92"
            placeholder="Search map name..."
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-1 flex-col">
          <span className="text-nowrap text-sm">Author</span>
          <Input
            type="text"
            className="max-w-92"
            placeholder="Search author..."
            value={authorQuery}
            onChange={(e) => setAuthorQuery(e.target.value)}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {searchResults.map((map, index) => (
              <TMXMapCard key={index} map={map} />
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
