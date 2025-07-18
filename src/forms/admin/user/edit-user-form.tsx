"use client";
import { updateUser } from "@/actions/database/users";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Roles, Users } from "@/lib/prisma/generated";
import { getErrorMessage, getList, permissions } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EditUserSchema, EditUserSchemaType } from "./edit-user-schema";

export default function EditUserForm({
  user,
  roles,
  callback,
}: {
  user: Users;
  roles: Roles[];
  callback?: () => void;
}) {
  const form = useForm<EditUserSchemaType>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      admin: user.admin,
      permissions: getList(user.permissions),
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

  const selectedRole = roles.find((role) => role.id === form.watch("role"));

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormElement
          name={"admin"}
          label="Admin"
          description="Check this box to grant admin privileges to the user."
          className="w-full min-w-64"
          type="checkbox"
        />

        <FormElement
          name={"permissions"}
          label="Permissions"
          description="Select the permissions to assign to the user."
          className="w-full min-w-64"
          type="multi-select"
          options={permissions.map((perm) => ({
            label: perm,
            value: perm,
          }))}
        />

        <div className="flex flex-col gap-2">
          <FormElement
            name={"role"}
            label="Role preset"
            description="Select a role preset to assign multiple permissions at once."
            className="w-full min-w-64"
            type="select"
            options={roles.map((role) => ({
              label: role.name,
              value: role.id,
            }))}
          />

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              form.setValue("permissions", getList(selectedRole?.permissions));
            }}
          >
            Apply Role Preset
          </Button>
        </div>

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
