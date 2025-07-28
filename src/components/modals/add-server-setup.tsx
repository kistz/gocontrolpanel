"use client";
import { getHetznerImages } from "@/actions/hetzner/images";
import { getHetznerLocations } from "@/actions/hetzner/locations";
import { getAllNetworks } from "@/actions/hetzner/networks";
import { getServerTypes } from "@/actions/hetzner/server-types";
import { getAllDatabases } from "@/actions/hetzner/servers";
import AdvancedServerSetupForm from "@/forms/admin/hetzner/setup-steps/advanced/server-setup-form";
import SimpleServerSetupForm from "@/forms/admin/hetzner/setup-steps/simple/server-setup-form";
import { getErrorMessage } from "@/lib/utils";
import { HetznerLocation } from "@/types/api/hetzner/locations";
import { HetznerNetwork } from "@/types/api/hetzner/networks";
import {
  HetznerImage,
  HetznerServer,
  HetznerServerType,
} from "@/types/api/hetzner/servers";
import { IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DefaultModalProps } from "./default-props";

type Mode = "simple" | "advanced";

export default function AddServerSetupModal({
  closeModal,
  data,
}: DefaultModalProps<string>) {
  const [databases, setDatabases] = useState<HetznerServer[]>([]);
  const [networks, setNetworks] = useState<HetznerNetwork[]>([]);
  const [locations, setLocations] = useState<HetznerLocation[]>([]);
  const [serverTypes, setServerTypes] = useState<HetznerServerType[]>([]);
  const [images, setImages] = useState<HetznerImage[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      if (!data) return;
      setLoading(true);

      const [
        databasesResult,
        locationsResult,
        serverTypesResult,
        imagesResult,
        networksResult,
      ] = await Promise.allSettled([
        getAllDatabases(data),
        getHetznerLocations(data),
        getServerTypes(data),
        getHetznerImages(data),
        getAllNetworks(data),
      ]);

      // Handle databases
      if (databasesResult.status === "fulfilled") {
        const { data, error } = databasesResult.value;
        if (!error) {
          setDatabases(data);
        } else {
          toast.error("Failed to fetch existing databases", {
            description: error,
          });
        }
      } else {
        toast.error("Failed to fetch existing databases", {
          description: getErrorMessage(databasesResult.reason),
        });
      }

      // Handle locations
      if (locationsResult.status === "fulfilled") {
        const { data, error } = locationsResult.value;
        if (!error) {
          setLocations(data);
        } else {
          toast.error("Failed to fetch locations", { description: error });
          setError("Failed to get locations: " + error);
        }
      } else {
        toast.error("Failed to fetch locations", {
          description: getErrorMessage(locationsResult.reason),
        });
      }

      // Handle server types
      if (serverTypesResult.status === "fulfilled") {
        const { data, error } = serverTypesResult.value;
        if (!error) {
          setServerTypes(data);
        } else {
          toast.error("Failed to fetch server types", { description: error });
          setError("Failed to get server types: " + error);
        }
      } else {
        toast.error("Failed to fetch server types", {
          description: getErrorMessage(serverTypesResult.reason),
        });
      }

      // Handle images
      if (imagesResult.status === "fulfilled") {
        const { data, error } = imagesResult.value;
        if (!error) {
          setImages(data);
        } else {
          toast.error("Failed to fetch images", { description: error });
          setError("Failed to get images: " + error);
        }
      } else {
        toast.error("Failed to fetch images", {
          description: getErrorMessage(imagesResult.reason),
        });
      }

      // Handle networks
      if (networksResult.status === "fulfilled") {
        const { data, error } = networksResult.value;
        if (!error) {
          setNetworks(data);
        } else {
          toast.error("Failed to fetch networks", { description: error });
          setError("Failed to get networks: " + error);
        }
      } else {
        toast.error("Failed to fetch networks", {
          description: getErrorMessage(networksResult.reason),
        });
      }

      setLoading(false);
    }

    fetch();
  }, []);

  const router = useRouter();

  const [mode, setMode] = useState<Mode>("simple");

  if (!data) return null;

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSubmit = async () => {
    closeModal?.();
    router.refresh();
  };

  return (
    <Card
      onClick={stopPropagation}
      className="p-6 gap-6 sm:min-w-[400px] max-sm:w-full max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <h1 className="text-xl font-bold">Add Server</h1>

          <Select
            value={mode}
            onValueChange={(value) => setMode(value as Mode)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-9999">
              <SelectItem
                value={"simple"}
                className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
              >
                Simple
              </SelectItem>
              <SelectItem
                value={"advanced"}
                className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
              >
                Advanced
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <IconX
          className="h-6 w-6 cursor-pointer text-muted-foreground"
          onClick={closeModal}
        />
      </div>

      {loading && <span className="text-muted-foreground">Loading...</span>}

      {error && <span>{error}</span>}

      {!loading && !error && (
        <>
          {mode === "simple" && (
            <SimpleServerSetupForm
              projectId={data}
              callback={handleSubmit}
              locations={locations}
              databases={databases}
              serverTypes={serverTypes}
            />
          )}

          {mode === "advanced" && (
            <AdvancedServerSetupForm
              projectId={data}
              callback={handleSubmit}
              locations={locations}
              databases={databases}
              serverTypes={serverTypes}
              images={images}
              networks={networks}
            />
          )}
        </>
      )}
    </Card>
  );
}
