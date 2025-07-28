"use client";

import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { HetznerServer, HetznerServerType } from "@/types/api/hetzner/servers";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ServerSetupSchemaType } from "./server-setup-schema";

export default function DatabaseForm({
  form,
  onNext,
  onBack,
  databases,
  serverTypes,
  serverController,
}: {
  form: UseFormReturn<ServerSetupSchemaType>;
  onNext: () => void;
  onBack: () => void;
  databases: HetznerServer[];
  serverTypes: HetznerServerType[];
  serverController: string | undefined;
}) {
  const isFirstRender = useRef(true);

  const [creatingNewDatabase, setCreatingNewDatabase] = useState(false);
  const newDatabase = form.watch("database.new");

  const existingDatabase = form.watch("database.existing");

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (newDatabase) {
      form.reset({
        ...form.getValues(),
        database: {
          new: true,
          serverType:
            serverTypes.length > 0
              ? serverTypes.find((st) => st.name === "cx22")?.id.toString() ||
                serverTypes[0].id.toString()
              : "",
          name: "",
        },
      });
      setCreatingNewDatabase(true);
    } else {
      setCreatingNewDatabase(false);
    }
  }, [newDatabase]);

  useEffect(() => {
    async function check() {
      if (existingDatabase) {
        const db = databases.find(
          (db) => db.id.toString() === existingDatabase,
        );
        if (db) {
          form.reset({
            ...form.getValues(),
            database: {
              new: false,
              existing: db.id.toString(),
              name: db.name,
              serverType: db.server_type?.id.toString(),
            },
          });
          await form.trigger("database");
        }
      }
    }

    check();
  }, [existingDatabase]);

  const selectedServerType = serverTypes.find(
    (type) => type.id.toString() === form.watch("database.serverType"),
  );

  const pricing =
    selectedServerType?.prices.find(
      (price) => price.location === form.getValues("server.location"),
    ) || selectedServerType?.prices.find((price) => price.location === "fsn1");

  let databaseOptions = [];
  switch (serverController) {
    case "evosc":
      databaseOptions = [{ value: "mysql", label: "MySQL" }];
      break;
    case "maniacontrol":
      databaseOptions = [{ value: "mysql", label: "MySQL" }];
      break;
    case "minicontrol":
      databaseOptions = [{ value: "mysql", label: "MySQL" }];
      break;
    case "pyplanet":
      databaseOptions = [{ value: "mysql", label: "MySQL" }];
      break;
    default:
      databaseOptions = [
        { value: "mysql", label: "MySQL" },
        { value: "postgres", label: "PostgreSQL" },
        { value: "mariadb", label: "MariaDB" },
      ];
      break;
  }

  return (
    <form className={"flex flex-col gap-4"}>
      {creatingNewDatabase ? (
        <div className="flex flex-col gap-4">
            <FormElement
              name="database.new"
              label="New Database"
              type="checkbox"
              description="Create a new database for this server"
            />

            <FormElement
              name={"database.name"}
              label="Server Name"
              placeholder="Enter server name"
              isRequired
            />

            <FormElement
              name={"database.serverType"}
              label="Server Type"
              placeholder="Select server type"
              type="select"
              className="w-32"
              options={serverTypes.map((type) => ({
                value: type.id.toString(),
                label: type.name,
              }))}
              isRequired
            />

            {/* Database Type Info */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex flex-col">
                <span className="font-semibold">Description</span>
                <span className="truncate">
                  {selectedServerType?.description || "-"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Cores</span>
                <span className="truncate">
                  {selectedServerType?.cores || "-"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Memory</span>
                <span className="truncate">
                  {selectedServerType?.memory
                    ? `${selectedServerType.memory} GB`
                    : "-"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Disk</span>
                <span className="truncate">
                  {selectedServerType?.disk
                    ? `${selectedServerType.disk} GB`
                    : "-"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Hourly Price</span>
                <span className="truncate">
                  {pricing
                    ? `€${parseFloat(pricing.price_hourly.gross).toFixed(4)}`
                    : "-"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Monthly Price</span>
                <span className="truncate">
                  {pricing
                    ? `€${parseFloat(pricing.price_monthly.gross).toFixed(4)}`
                    : "-"}
                </span>
              </div>
            </div>
          </div>
      ) : (
        <>
          <FormElement
            name="database.new"
            label="New Database"
            type="checkbox"
            description="Create a new database for this server"
          />

          <FormElement
            name="database.existing"
            label="Existing Database"
            description="Select an existing database to use for this server"
            className="min-w-32"
            type="select"
            isRequired
            options={databases.map((db) => ({
              value: db.id.toString(),
              label: db.name,
            }))}
          />
        </>
      )}

      <div className="flex gap-2 justify-between">
        <Button className="flex-1 max-w-32" variant="outline" onClick={onBack}>
          <IconArrowNarrowLeft />
          Previous
        </Button>
        <Button className="flex-1 max-w-32" type="button" onClick={onNext}>
          Next
          <IconArrowNarrowRight />
        </Button>
      </div>
    </form>
  );
}
