"use client";
import { updateUser } from "@/actions/database/user";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Users } from "@/lib/prisma/generated";
import { getErrorMessage, getRoles } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EditUserSchema, EditUserSchemaType } from "./edit-user-schema";

const rolesOptions = [
  { label: "Admin", value: "admin", removable: false },
  { label: "Moderator", value: "moderator" },
];

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
      roles: getRoles(user.roles),
    },
  });

  async function onSubmit(values: EditUserSchemaType) {
    try {
      const { error } = await updateUser(user.id, {
        roles: values.roles,
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
          control={form.control}
          name={"roles"}
          options={rolesOptions}
          defaultValues={getRoles(user.roles)}
          label="Roles"
          description="The roles of the user."
          placeholder="Select roles"
          error={form.formState.errors.roles}
          className="w-full min-w-64"
          type="multi-select"
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
