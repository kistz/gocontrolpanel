"use client";

import { loadMatchSettings, saveMatchSettings } from "@/actions/gbx/game";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MatchSettingsSchema, MatchSettingsSchemaType } from "./game-schema";

export default function MatchSettingsForm({
  serverUuid,
}: {
  serverUuid: string;
}) {
  const matchSettingsForm = useForm<MatchSettingsSchemaType>({
    resolver: zodResolver(MatchSettingsSchema),
    defaultValues: {
      filename: "",
    },
  });

  async function onLoadMatchSettings() {
    try {
      matchSettingsForm.trigger("filename");
      const filename = matchSettingsForm.getValues("filename");
      const { error } = await loadMatchSettings(
        serverUuid,
        "MatchSettings/" + filename,
      );
      if (error) {
        throw new Error(error);
      }
      toast.success("Match settings successfully loaded");
    } catch (error) {
      toast.error("Failed to load match settings", {
        description: getErrorMessage(error),
      });
    }
  }

  async function onSaveMatchSettings() {
    try {
      matchSettingsForm.trigger("filename");
      const filename = matchSettingsForm.getValues("filename");
      const { error } = await saveMatchSettings(
        serverUuid,
        "MatchSettings/" + filename,
      );
      if (error) {
        throw new Error(error);
      }
      toast.success("Match settings saved successfully");
    } catch (error) {
      toast.error("Failed to save match settings", {
        description: getErrorMessage(error),
      });
    }
  }

  return (
    <Form {...matchSettingsForm}>
      <form className="flex flex-col gap-2">
        <FormElement
          name={"filename"}
          label="Match Settings"
          description="The name of the file to save/load match settings."
          placeholder="matchlist.txt"
          className="w-1/2 xl:w-2/3 xl:max-w-[calc(100%-192px)] min-w-48"
          isRequired
        >
          <div className="gap-2 hidden max-[500px]:hidden max-[960px]:flex min-[1080px]:flex">
            <Button
              className="w-20"
              type="button"
              onClick={onLoadMatchSettings}
            >
              Load
            </Button>
            <Button
              className="w-20"
              type="button"
              onClick={onSaveMatchSettings}
            >
              Save
            </Button>
          </div>
        </FormElement>

        <div className="flex gap-2 max-[500px]:flex max-[960px]:hidden min-[1080px]:hidden">
          <Button className="w-20" type="button" onClick={onLoadMatchSettings}>
            Load
          </Button>
          <Button className="w-20" type="button" onClick={onSaveMatchSettings}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
