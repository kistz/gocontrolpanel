"use client";
import { ServersWithUsers, updateServer } from "@/actions/database/servers";
import {
  getUsersMinimal,
  searchUsers,
  UserMinimal,
} from "@/actions/database/users";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import { UserServerRole } from "@/lib/prisma/generated";
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { EditServerSchema, EditServerSchemaType } from "./edit-server-schema";

export default function EditServerForm({
  server,
  callback,
}: {
  server: ServersWithUsers;
  callback?: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchResults, setSearchResults] = useState<UserMinimal[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    async function fetch() {
      try {
        const { data, error } = await getUsersMinimal();
        if (error) {
          throw new Error(error);
        }
        setSearchResults(data);
      } catch (error) {
        setError("Failed to get users: " + getErrorMessage(error));
        toast.error("Failed to fetch users", {
          description: getErrorMessage(error),
        });
      }

      setLoading(false);
    }

    fetch();
  }, []);

  const form = useForm<EditServerSchemaType>({
    resolver: zodResolver(EditServerSchema),
    defaultValues: {
      name: server.name,
      description: server.description || undefined,
      host: server.host,
      port: server.port,
      user: server.user,
      password: server.password,
      userServers: server.userServers.map((userServer) => ({
        userId: userServer.userId,
        role: userServer.role,
      })),
      filemanagerUrl: server.filemanagerUrl || undefined,
      filemanagerPassword: server.filemanagerPassword || undefined,
    },
  });

  const { control } = form;
  const {
    fields: userFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "userServers",
  });

  async function onSubmit(values: EditServerSchemaType) {
    try {
      const { error } = await updateServer(server.id, {
        ...values,
        userServers: values.userServers?.map((user) => ({
          userId: user.userId,
          role: user.role as UserServerRole,
        })),
      });
      if (error) {
        throw new Error(error);
      }
      toast.success("Server successfully updated");
      if (callback) {
        callback();
      }
    } catch (error) {
      toast.error("Failed to update server", {
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
          name={"name"}
          label="Name"
          description="The name of the server."
          placeholder="Enter server name"
          isRequired
        />

        <FormElement
          name={"description"}
          label="Description"
          description="The description of the server."
          placeholder="Enter server description"
        />

        <FormElement
          name={"host"}
          label="Host"
          description="The host of the server."
          placeholder="Enter server host"
          isRequired
        />

        <FormElement
          name={"port"}
          label="Port"
          description="The XMLRPC port of the server."
          placeholder="Enter server XMLRPC port"
          type="number"
          isRequired
        />

        <FormElement
          name={"user"}
          label="User"
          description="The XMLRPC user."
          placeholder="Enter user"
          isRequired
        />

        <FormElement
          name={"password"}
          label="Password"
          description="The XMLRPC password."
          placeholder="Enter password"
          isRequired
        />

        {/* Users with roles */}
        <div className="flex flex-col gap-2">
          <FormLabel className="text-sm">Users</FormLabel>
          {userFields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-2">
              <div className="flex-1">
                <FormElement
                  name={`userServers.${index}.userId`}
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
                name={`userServers.${index}.role`}
                className="w-30"
                placeholder="Select role"
                options={Object.values(UserServerRole).map((role) => ({
                  label: role,
                  value: role,
                }))}
                type="select"
              />
              <Button
                type="button"
                variant="destructive"
                size={"icon"}
                onClick={() => remove(index)}
              >
                <IconTrash />
                <span className="sr-only">Remove User</span>
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ userId: "", role: UserServerRole.Member })}
          >
            <IconPlus />
            Add User
          </Button>
        </div>

        <FormElement
          name={"filemanagerUrl"}
          label="Filemanager url"
          description="The url of the filemanager."
          placeholder="Enter filemanager url"
        />

        <FormElement
          name={"filemanagerPassword"}
          label="Filemanager password"
          description="The password for the filemanager."
          placeholder="Enter filemanager password"
        />

        <Button
          type="submit"
          className="w-full mt-4"
          disabled={form.formState.isSubmitting}
        >
          Edit Server
        </Button>
      </form>
    </Form>
  );
}
