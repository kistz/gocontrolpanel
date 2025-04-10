"use client";

import { setScriptName } from "@/actions/gbx/game";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScriptName } from "@/types/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ScriptNameSchema } from "./game-schema";
import { getErrorMessage } from "@/lib/utils";

export default function ScriptNameForm({ scriptName }: { scriptName: string }) {
  const scriptNameForm = useForm<ScriptName>({
    resolver: zodResolver(ScriptNameSchema),
    defaultValues: {
      scriptName,
    },
  });

  async function onSubmitScriptName(values: ScriptName) {
    try {
      await setScriptName(values.scriptName);
      toast.success("Script Name updated successfully");
    } catch (error) {
      toast.error("Failed to update Script Name", {
        description: getErrorMessage(error),
      });
    }
  }

  return (
    <Form {...scriptNameForm}>
      <form
        onSubmit={scriptNameForm.handleSubmit(onSubmitScriptName)}
        className="flex flex-col gap-2"
      >
        <FormElement
          control={scriptNameForm.control}
          name={"scriptName"}
          label="Script Name"
          description="The name of the script to load."
          placeholder="Trackmania/TM_TimeAttack_Online.Script.txt"
          error={scriptNameForm.formState.errors.scriptName}
          className="w-1/2 xl:w-2/3 min-w-48"
          isRequired
        >
          <Button
            className="w-20"
            type="submit"
            disabled={scriptNameForm.formState.isSubmitting}
          >
            Save
          </Button>
        </FormElement>
      </form>
    </Form>
  );
}
