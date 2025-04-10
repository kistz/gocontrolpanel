"use client";

import { loadMatchSettings, saveMatchSettings } from "@/actions/gbx/game";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MatchSettings } from "@/types/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MatchSettingsSchema } from "./game-schema";

export default function MatchSettingsForm() {
  const matchSettingsForm = useForm<MatchSettings>({
    resolver: zodResolver(MatchSettingsSchema),
    defaultValues: {
      filename: "",
    },
  });

  async function onLoadMatchSettings() {
    try {
      const filename = matchSettingsForm.getValues("filename");
      await loadMatchSettings(filename);
      toast.success("Match settings loaded successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to load match settings", {
        description: errorMessage,
      });
    }
  }

  async function onSaveMatchSettings() {
    try {
      const filename = matchSettingsForm.getValues("filename");
      await saveMatchSettings("MatchSettings/" + filename);
      toast.success("Match settings saved successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to save match settings", {
        description: errorMessage,
      });
    }
  }

  return (
    <Form {...matchSettingsForm}>
      <form className="flex flex-col gap-2">
        <FormElement
          control={matchSettingsForm.control}
          name={"filename"}
          label="Filename"
          description="The name of the file to save/load match settings."
          placeholder="matchlist.txt"
          error={matchSettingsForm.formState.errors.filename}
          className="w-1/2 xl:w-2/3 xl:max-w-[calc(100%-192px)] min-w-48"
          isRequired
        >
          <div className="gap-2 hidden min-[500px]:flex">
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

        <div className="flex gap-2 min-[500px]:hidden">
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
