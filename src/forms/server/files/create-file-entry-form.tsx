"use client";

import { createFileEntry } from "@/actions/filemanager";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  CreateFileEntrySchema,
  CreateFileEntrySchemaType,
} from "./create-file-entry-schema";

export default function CreateFileEntryForm({
  serverId,
  path,
  isDir = false,
  callback,
}: {
  serverId: number;
  path: string;
  isDir?: boolean;
  callback?: () => void;
}) {
  const form = useForm<CreateFileEntrySchemaType>({
    resolver: zodResolver(CreateFileEntrySchema),
    defaultValues: {
      path,
      isDir,
      content: "",
    },
  });

  async function onSubmit(values: CreateFileEntrySchemaType) {
    try {
      const { error } = await createFileEntry(serverId, values);
      if (error) {
        throw new Error(error);
      }

      toast.success("File entry successfully created");
      console.log("Creating file entry:", values);
      if (callback) {
        callback();
      }
    } catch (error) {
      toast.error("Failed to create file entry", {
        description: getErrorMessage(error),
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormElement
          control={form.control}
          name={"path"}
          label="Path"
          description={
            isDir ? "The path of the directory." : "The path of the file."
          }
          placeholder={isDir ? "Enter directory path" : "Enter file path"}
          error={form.formState.errors.path}
          isRequired
          autoFocus
        />

        {!isDir && (
          <FormElement
            control={form.control}
            name={"content"}
            label="Content"
            description="The content of the file."
            placeholder="Enter file content"
            error={form.formState.errors.content}
            isRequired
            type="textarea"
          />
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {isDir ? "Create Directory" : "Create File"}
        </Button>
      </form>
    </Form>
  );
}
