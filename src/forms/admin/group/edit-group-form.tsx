"use client";
import { GroupsWithUsers, updateGroup } from "@/actions/database/groups";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import { GroupRole, Users } from "@/lib/prisma/generated";
import { getErrorMessage, getList } from "@/lib/utils";
import { Server } from "@/types/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconTrash } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EditGroupSchema, EditGroupSchemaType } from "./edit-group-schema";

export default function EditGroupForm({
  group,
  servers,
  users,
  callback,
}: {
  group: GroupsWithUsers;
  servers: Server[];
  users: Users[];
  callback?: () => void;
}) {
  const form = useForm<EditGroupSchemaType>({
    resolver: zodResolver(EditGroupSchema),
    defaultValues: {
      ...group,
      ids: getList(group.ids) || [],
      users: group.users.map((user) => ({
        userId: user.userId,
        role: user.role,
      })),
    },
  });

  async function onSubmit(values: EditGroupSchemaType) {
    try {
      const { error } = await updateGroup(group.id, {
        ...values,
        ids: getList(values.ids),
        users: values.users?.map((user) => ({
          userId: user.userId,
          role: user.role as GroupRole,
        })),
      });
      if (error) {
        throw new Error(error);
      }
      toast.success("Group successfully updated");
      if (callback) {
        callback();
      }
    } catch (error) {
      toast.error("Failed to update group", {
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
          name="name"
          label="Group Name"
          placeholder="Enter group name"
          isRequired
        />

        <FormElement
          name="description"
          label="Description"
          placeholder="Enter group description"
        />

        <FormElement
          name="ids"
          label="Servers"
          placeholder="Select servers"
          options={servers.map((server) => ({
            label: server.name,
            value: server.uuid,
          }))}
          type="multi-select"
        />

        {/* Users with roles */}
        <div className="flex flex-col gap-2">
          <FormLabel className="text-sm">Members</FormLabel>
          {form.watch("users")?.map((_, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="flex-1">
                <FormElement
                  name={`users.${index}.userId`}
                  className="w-full"
                  placeholder="Select user"
                  options={users.map((u) => ({
                    label: u.nickName,
                    value: u.id,
                  }))}
                  type="select"
                />
              </div>
              <FormElement
                name={`users.${index}.role`}
                className="w-30"
                placeholder="Select role"
                options={Object.values(GroupRole).map((role) => ({
                  label: role,
                  value: role,
                }))}
                type="select"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => {
                  const currentUsers = form.getValues("users");
                  form.setValue(
                    "users",
                    currentUsers?.filter((_, i) => i !== index),
                  );
                }}
              >
                <IconTrash />
                <span className="sr-only">Remove Member</span>
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const currentUsers = form.getValues("users") || [];
            form.setValue("users", [
              ...currentUsers,
              { userId: "", role: GroupRole.Member },
            ]);
          }}
        >
          Add Member
        </Button>

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
