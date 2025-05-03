"use client";

import { setScriptName } from "@/actions/gbx/game";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ScriptNameSchema, ScriptNameSchemaType } from "./game-schema";

export default function ScriptNameForm({
  scriptName,
  scripts,
  serverId,
}: {
  scriptName: string;
  scripts: string[];
  serverId: number;
}) {
  const scriptNameForm = useForm<ScriptNameSchemaType>({
    resolver: zodResolver(ScriptNameSchema),
    defaultValues: {
      scriptName,
    },
  });

  async function onSubmitScriptName(values: ScriptNameSchemaType) {
    try {
      const { error } = await setScriptName(serverId, values.scriptName);
      if (error) {
        throw new Error(error);
      }
      toast.success("Script loaded successfully");
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
          options={scripts.map((script) => ({
            label: script,
            value: script,
          }))}
          error={scriptNameForm.formState.errors.scriptName}
          className="w-[200px] min-[500px]:w-1/2"
          type="select"
          isRequired
        >
          <Button
            className="w-20"
            type="submit"
            disabled={scriptNameForm.formState.isSubmitting}
          >
            Load
          </Button>
        </FormElement>
      </form>
    </Form>
  );
}
