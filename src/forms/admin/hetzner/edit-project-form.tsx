"use client";
import {
  HetznerProjectsWithUsers,
  updateHetznerProject,
} from "@/actions/database/hetzner-projects";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import { HetznerProjectRole, Users } from "@/lib/prisma/generated";
import { getErrorMessage, getList } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  EditProjectSchema,
  EditProjectSchemaType,
} from "./edit-project-schema";

export default function EditProjectForm({
  project,
  users,
  callback,
}: {
  project: HetznerProjectsWithUsers;
  users: Users[];
  callback?: () => void;
}) {
  const form = useForm<EditProjectSchemaType>({
    resolver: zodResolver(EditProjectSchema),
    defaultValues: {
      ...project,
      apiTokens: getList(project.apiTokens),
      users: project.hetznerProjectUsers.map((user) => ({
        userId: user.userId,
        role: user.role,
      })),
    },
  });

  async function onSubmit(values: EditProjectSchemaType) {
    try {
      const { error } = await updateHetznerProject(project.id, {
        ...values,
        apiTokens: getList(values.apiTokens),
        hetznerProjectUsers: values.users?.map((user) => ({
          userId: user.userId,
          role: user.role as HetznerProjectRole,
        })),
      });
      if (error) {
        throw new Error(error);
      }
      toast.success("Project successfully updated");
      if (callback) {
        callback();
      }
    } catch (error) {
      toast.error("Failed to update project", {
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
          label="Project Name"
          placeholder="Enter project name"
          isRequired
        />

        {/* API Tokens */}
        <div className="flex flex-col gap-2">
          <FormLabel className="text-sm">API Tokens</FormLabel>
          {form.watch("apiTokens")?.map((_, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="flex-1">
                <FormElement
                  name={`apiTokens.${index}`}
                  className="w-full"
                  placeholder="Enter API token"
                  isRequired
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size={"icon"}
                onClick={() => {
                  const currentTokens = form.getValues("apiTokens");
                  form.setValue(
                    "apiTokens",
                    currentTokens?.filter((_, i) => i !== index),
                  );
                }}
              >
                <IconTrash />
                <span className="sr-only">Remove Token</span>
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const currentTokens = form.getValues("apiTokens") || [];
              form.setValue("apiTokens", [...currentTokens, ""]);
            }}
          >
            <IconPlus />
            Add Token
          </Button>
        </div>

        {/* Users with roles */}
        <div className="flex flex-col gap-2">
          <FormLabel className="text-sm">Users</FormLabel>
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
                options={Object.values(HetznerProjectRole).map((role) => ({
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
                <span className="sr-only">Remove User</span>
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
              { userId: "", role: HetznerProjectRole.Moderator },
            ]);
          }}
        >
          Add User
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
