import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ServerSettings } from "@/types/server";
import { UseFormReturn } from "react-hook-form";

interface SettingsFormProps {
  form: UseFormReturn<ServerSettings>;
  onSubmit: (values: ServerSettings) => void;
}

export default function SettingsForm({ form, onSubmit }: SettingsFormProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="gap-4 lg:gap-x-8 2xl:gap-x-16 grid grid-rows-18 lg:grid-rows-9 
        2xl:grid-rows-6 grid-flow-col"
      >
        <FormElement
          control={form.control}
          name={"defaultOptions.Name"}
          label="Server Name"
          description="The name of the server."
          placeholder="Server name..."
          error={form.formState.errors.defaultOptions?.Name}
          className="w-full min-w-64"
          isRequired
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.Comment"}
          label="Server Comment"
          description="The comment of the server."
          placeholder="Server comment..."
          error={form.formState.errors.defaultOptions?.Comment}
          className="w-full min-w-64"
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.Password"}
          label="Server Password"
          description="The password of the server for players."
          placeholder="Server password..."
          error={form.formState.errors.defaultOptions?.Password}
          className="w-2/3 min-w-64"
          type="password"
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.PasswordForSpectator"}
          label="Server Password Spectator"
          description="The password of the server for spectators."
          placeholder="Server password spectator..."
          error={form.formState.errors.defaultOptions?.PasswordForSpectator}
          className="w-2/3 min-w-64"
          type="password"
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.NextCallVoteTimeOut"}
          label="Call Vote Timeout"
          description="The timeout for call vote in seconds."
          placeholder="Call vote timeout..."
          error={form.formState.errors.defaultOptions?.NextCallVoteTimeOut}
          className="w-20"
          type="number"
          isRequired
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.CallVoteRatio"}
          label="Call Vote Ratio"
          description="The ratio for call vote in %."
          placeholder="Call vote ratio..."
          error={form.formState.errors.defaultOptions?.CallVoteRatio}
          className="w-20"
          type="number"
          isRequired
        />
        <FormElement
          control={form.control}
          name={"defaultOptions.HideServer"}
          label="Server Visibility"
          description="The visibility of the server."
          options={[
            { label: "Visible", value: "0" },
            { label: "Hidden", value: "1" },
            { label: "Hidden from nations", value: "2" },
          ]}
          error={form.formState.errors.defaultOptions?.HideServer}
          className="w-3/5 min-w-48"
          type="select"
          isRequired
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.NextMaxPlayers"}
          label="Max Players"
          description="The maximum number of players."
          placeholder="Max players..."
          error={form.formState.errors.defaultOptions?.NextMaxPlayers}
          className="w-20"
          type="number"
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.NextMaxSpectators"}
          label="Max Spectators"
          description="The maximum number of spectators."
          placeholder="Max spectators..."
          error={form.formState.errors.defaultOptions?.NextMaxSpectators}
          className="w-20"
          type="number"
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.KeepPlayerSlots"}
          label="Keep Player Slots"
          description="Keep player slots for spectators."
          error={form.formState.errors.defaultOptions?.KeepPlayerSlots}
          className="w-20"
          type="checkbox"
          isRequired
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.AllowMapDownload"}
          label="Allow Map Download"
          description="Allow map download."
          error={form.formState.errors.defaultOptions?.AllowMapDownload}
          className="w-20"
          type="checkbox"
          isRequired
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.AutoSaveReplays"}
          label="Auto Save Replays"
          description="Auto save replays."
          error={form.formState.errors.defaultOptions?.AutoSaveReplays}
          className="w-20"
          type="checkbox"
          isRequired
        />
        <FormElement
          control={form.control}
          name={"defaultOptions.DisableHorns"}
          label="Horns"
          description="Enable horns."
          error={form.formState.errors.defaultOptions?.DisableHorns}
          className="w-20"
          type="checkbox"
          isRequired
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.DisableServiceAnnounces"}
          label="Service Announcements"
          description="Enable service announcements."
          error={form.formState.errors.defaultOptions?.DisableServiceAnnounces}
          className="w-20"
          type="checkbox"
          isRequired
        />

        <FormElement
          control={form.control}
          name={"downloadRate"}
          label="Download Rate"
          description="The download rate of the server."
          placeholder="Download rate..."
          error={form.formState.errors.downloadRate}
          className="w-26"
          type="number"
          isRequired
        />

        <FormElement
          control={form.control}
          name={"uploadRate"}
          label="Upload Rate"
          description="The upload rate of the server."
          placeholder="Upload rate..."
          error={form.formState.errors.uploadRate}
          className="w-26"
          type="number"
          isRequired
        />

        <FormElement
          control={form.control}
          name={"profileSkins"}
          label="Profile Skins"
          description="Enable profile skins."
          error={form.formState.errors.profileSkins}
          className="w-20"
          type="checkbox"
          isRequired
        />

        <Button
          type="submit"
          className="mt-4 w-1/4 min-w-24"
          disabled={form.formState.isSubmitting}
        >
          Save
        </Button>
      </form>
    </Form>
  );
}
