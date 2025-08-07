"use client";

import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function MapSearch({ serverId }: { serverId: string }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSearch = () => {
    setLoading(true);
    console.log("Search query:", query);
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
    </div>
  );
}
