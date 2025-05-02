import { updatePlayer } from "@/actions/database/player";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getErrorMessage } from "@/lib/utils";
import { EditPlayer, Player } from "@/types/player";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EditPlayerSchema } from "./edit-player-schema";

const rolesOptions = [
  { label: "Admin", value: "admin" },
  { label: "Moderator", value: "moderator" },
];

export default function EditPlayerForm({
  player,
  callback,
}: {
  player: Player;
  callback?: () => void;
}) {
  const form = useForm<EditPlayer>({
    resolver: zodResolver(EditPlayerSchema),
    defaultValues: {
      roles: player.roles ?? [],
    },
  });

  async function onSubmit(values: EditPlayer) {
    try {
      const { error } = await updatePlayer(player._id, {
        roles: values.roles,
      });
      if (error) {
        throw new Error(error);
      }
      toast.success("Player updated successfully");
      if (callback) {
        callback();
      }
    } catch (error) {
      toast.error("Failed to update player", {
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
          label="Roles"
          description="The roles of the player."
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
