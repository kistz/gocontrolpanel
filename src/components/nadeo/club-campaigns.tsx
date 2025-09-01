"use client";

import { getClubCampaigns } from "@/actions/nadeo/clubs";
import { getErrorMessage } from "@/lib/utils";
import { ClubCampaign } from "@/types/api/nadeo";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ClubCampaignCard from "./club-campaign-card";

export default function ClubCampaigns({
  serverId,
  fmHealth,
  defaultCampaigns = [],
}: {
  serverId: string;
  fmHealth: boolean;
  defaultCampaigns?: ClubCampaign[];
}) {
  const [nameQuery, setNameQuery] = useState("");

  const [campaigns, setCampaigns] = useState<ClubCampaign[]>(defaultCampaigns);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSearch = async (more?: boolean) => {
    if (!hasMore && more) return;

    setLoading(true);

    try {
      const { data, error } = await getClubCampaigns(
        nameQuery,
        more ? campaigns.length : 0,
      );
      if (error) {
        throw new Error(error);
      }

      setError(null);
      setCampaigns(
        more ? [...campaigns, ...data.clubCampaignList] : data.clubCampaignList,
      );
      setHasMore(data.itemCount > campaigns.length);
    } catch (err) {
      setError("Failed to get campaigns: " + getErrorMessage(err));
      toast.error("Failed to get campaigns", {
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
          <Input
            type="text"
            placeholder="Search campaign name..."
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

      {campaigns.length > 0 ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-4">
            {campaigns.map((campaign, index) => (
              <ClubCampaignCard
                key={index}
                serverId={serverId}
                campaign={campaign}
                fmHealth={fmHealth}
              />
            ))}
          </div>

          {hasMore && (
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
