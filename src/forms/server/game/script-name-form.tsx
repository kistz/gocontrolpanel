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
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to update Script Name", {
        description: errorMessage,
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
          description="The name of the script to run."
          placeholder="Script Name..."
          error={scriptNameForm.formState.errors.scriptName}
          className="w-2/3"
          isRequired
        >
          <div className="flex gap-2">
            <Button
              className="w-20"
              type="submit"
              disabled={scriptNameForm.formState.isSubmitting}
            >
              Save
            </Button>
          </div>
        </FormElement>
      </form>
    </Form>
  );
}
