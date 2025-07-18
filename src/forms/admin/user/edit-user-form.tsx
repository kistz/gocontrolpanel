"use client";
import { updateUser } from "@/actions/database/users";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Users } from "@/lib/prisma/generated";
import { getErrorMessage, getList } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EditUserSchema, EditUserSchemaType } from "./edit-user-schema";

export default function EditUserForm({
  user,
  callback,
}: {
  user: Users;
  callback?: () => void;
}) {
  const form = useForm<EditUserSchemaType>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      admin: user.admin,
    },
  });

  async function onSubmit(values: EditUserSchemaType) {
    try {
      const { error } = await updateUser(user.id, {
        admin: values.admin,
        permissions: getList(values.permissions),
      });
      if (error) {
        throw new Error(error);
      }
      toast.success("User successfully updated");
      if (callback) {
        callback();
      }
    } catch (error) {
      toast.error("Failed to update user", {
        description: getErrorMessage(error),
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormElement
          name={"admin"}
          label="Admin"
          description="Check this box to grant admin privileges to the user."
          className="w-full min-w-64"
          type="checkbox"
        />

        <Button
          type="submit"
          className="w-full mt-4"
          disabled={form.formState.isSubmitting}
        >
          Save
        </Button>
      </form>
    </Form>
  );
}
