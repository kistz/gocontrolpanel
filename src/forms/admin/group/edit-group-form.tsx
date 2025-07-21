"use client";
import {
  GroupsWithUsersWithServers,
  updateGroup,
} from "@/actions/database/groups";
import { getServersMinimal, ServerMinimal } from "@/actions/database/servers";
import {
  getUsersMinimal,
  searchUsers,
  UserMinimal,
} from "@/actions/database/users";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import { GroupRole } from "@/lib/prisma/generated";
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EditGroupSchema, EditGroupSchemaType } from "./edit-group-schema";

export default function EditGroupForm({
  group,
  callback,
}: {
  group: GroupsWithUsersWithServers;
  callback?: () => void;
}) {
  const [servers, setServers] = useState<ServerMinimal[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchResults, setSearchResults] = useState<UserMinimal[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    async function fetch() {
      try {
        const { data, error } = await getServersMinimal();
        if (error) {
          throw new Error(error);
        }
        setServers(data);
      } catch (error) {
        setError("Failed to get servers: " + getErrorMessage(error));
        toast.error("Failed to fetch servers", {
          description: getErrorMessage(error),
        });
      }

      try {
        const { data, error } = await getUsersMinimal();
        if (error) {
          throw new Error(error);
        }
        setSearchResults(data);
      } catch (error) {
        setError("Failed to search users: " + getErrorMessage(error));
        toast.error("Failed to search users", {
          description: getErrorMessage(error),
        });
      }

      setLoading(false);
    }

    fetch();
  }, []);

  const form = useForm<EditGroupSchemaType>({
    resolver: zodResolver(EditGroupSchema),
    defaultValues: {
      ...group,
      groupServers: group.groupServers.map((server) => server.serverId),
      groupMembers: group.groupMembers.map((user) => ({
        userId: user.userId,
        role: user.role,
      })),
    },
  });

  async function onSubmit(values: EditGroupSchemaType) {
    try {
      const { error } = await updateGroup(group.id, {
        ...values,
        groupServers:
          values.groupServers?.map((id) => ({
            serverId: id,
          })) || [],
        groupMembers: values.groupMembers?.map((user) => ({
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

  const handleSearch = async (query?: string) => {
    if (!query?.trim()) {
      return;
    }
    setSearching(true);
    try {
      const { data, error } = await searchUsers(query);
      if (error) {
        throw new Error(error);
      }
      setSearchResults((prev) => {
        const existingIds = new Set(prev.map((u) => u.id));
        return [...prev, ...data.filter((u) => !existingIds.has(u.id))];
      });
    } catch (error) {
      setError("Failed to search users: " + getErrorMessage(error));
      toast.error("Failed to search users", {
        description: getErrorMessage(error),
      });
    } finally {
      setSearching(false);
    }
  };

  if (loading) {
    return <span className="text-muted-foreground">Loading...</span>;
  }

  if (error) {
    return <span>{error}</span>;
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
          name="groupServers"
          label="Servers"
          placeholder="Select servers"
          options={servers.map((server) => ({
            label: server.name,
            value: server.id,
          }))}
          type="multi-select"
        />

        {/* Users with roles */}
        <div className="flex flex-col gap-2">
          <FormLabel className="text-sm">Members</FormLabel>
          {form.watch("groupMembers")?.map((_, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="flex-1">
                <FormElement
                  name={`groupMembers.${index}.userId`}
                  className="w-full"
                  placeholder="Search user..."
                  onSearch={handleSearch}
                  options={searchResults.map((u) => ({
                    label: u.nickName,
                    value: u.id,
                  }))}
                  isLoading={searching}
                  type="search"
                />
              </div>
              <FormElement
                name={`groupMembers.${index}.role`}
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
                  const currentUsers = form.getValues("groupMembers");
                  form.setValue(
                    "groupMembers",
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
            const currentUsers = form.getValues("groupMembers") || [];
            form.setValue("groupMembers", [
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
